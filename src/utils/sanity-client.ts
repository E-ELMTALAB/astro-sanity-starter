import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import { createClient, type ClientConfig, type SanityClient } from '@sanity/client';

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN, STACKBIT_PREVIEW, SANITY_PREVIEW_DRAFTS } = loadEnv(
    process.env.NODE_ENV || '',
    process.cwd(),
    ''
);
const isDev = import.meta.env.DEV;
const isDeployPreview = process.env.CONTEXT === 'deploy-preview';
const previewDrafts = STACKBIT_PREVIEW?.toLowerCase() === 'true' || SANITY_PREVIEW_DRAFTS?.toLowerCase() === 'true';
const hasSanityCredentials = Boolean(SANITY_PROJECT_ID && SANITY_PROJECT_ID.trim().length > 0);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sanityConfig: ClientConfig = {
    projectId: SANITY_PROJECT_ID || 'local',
    dataset: SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-31',
    token: SANITY_TOKEN,
    perspective: isDev || isDeployPreview || previewDrafts ? 'previewDrafts' : 'published'
};

const fallbackClient = {
    fetch: async () => {
        throw new Error('SANITY_CLIENT_DISABLED');
    },
    listen: () => ({
        subscribe: () => ({ unsubscribe() {} })
    })
} as unknown as SanityClient;

export const client: SanityClient = hasSanityCredentials ? createClient(sanityConfig) : fallbackClient;

/**
 * @param {SanityClient} client The Sanity client to add the listener to
 * @param {Array<String>} types An array of types the listener should take an action on
 * Creating Sanity listener to subscribe to whenever a new document is created or deleted to refresh the list in Create
 */
if (hasSanityCredentials) {
    [{ client: client, types: ['page'] }].forEach(({ client, types }: { client: SanityClient; types: Array<String> }) =>
        client.listen(`*[_type in ${JSON.stringify(types)}]`, {}, { visibility: 'query' }).subscribe(async (event: any) => {
            if (event.transition === 'appear' || event.transition === 'disappear') {
                const filePath = path.join(__dirname, '../layouts/Layout.astro');
                const time = new Date();
                await fs.promises.utimes(filePath, time, time);
            }
        })
    );
}
