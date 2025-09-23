import { client } from '@utils/sanity-client';
import { IMAGE } from './blocks';
import { fallbackSiteConfig } from './fallback';

const CONFIG_QUERY_OBJ = `{
  _id,
  "favicon": {
    "src": favicon.asset->url
  },
  header {
    ...,
    logo ${IMAGE}
  },
  footer,
  titleSuffix
}`;

function isSanityDisabledError(error) {
    return error instanceof Error && error.message === 'SANITY_CLIENT_DISABLED';
}

export async function fetchData() {
    try {
        const config = await client.fetch(`*[_type == "siteConfig"][0] ${CONFIG_QUERY_OBJ}`);
        return config ?? fallbackSiteConfig;
    } catch (error) {
        if (isSanityDisabledError(error)) {
            return fallbackSiteConfig;
        }
        throw error;
    }
}
