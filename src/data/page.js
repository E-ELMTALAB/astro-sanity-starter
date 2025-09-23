import { client } from '@utils/sanity-client';
import { SECTIONS } from './blocks';
import { fallbackPages } from './fallback';

const PAGE_QUERY_OBJ = `{
  _id,
  slug,
  title,
  metaTitle,
  metaDescription,
  "socialImage": {
    "src": socialImage.asset->url
  },
  sections[] ${SECTIONS}
}`;

function isSanityDisabledError(error) {
    return error instanceof Error && error.message === 'SANITY_CLIENT_DISABLED';
}

export async function fetchData() {
    try {
        const pages = await client.fetch(`*[_type == "page"] ${PAGE_QUERY_OBJ}`);
        return Array.isArray(pages) && pages.length > 0 ? pages : fallbackPages;
    } catch (error) {
        if (isSanityDisabledError(error)) {
            return fallbackPages;
        }
        throw error;
    }
}

export async function getPageById(id) {
    try {
        const pages = await client.fetch(`*[_type == "page" && _id == "${id}"] ${PAGE_QUERY_OBJ}`);
        if (Array.isArray(pages) && pages.length > 0) {
            return pages;
        }
    } catch (error) {
        if (!isSanityDisabledError(error)) {
            throw error;
        }
    }
    return fallbackPages.filter((page) => page._id === id || page.slug?.current === id || id === undefined);
}
