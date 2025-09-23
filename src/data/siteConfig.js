import { client } from '@utils/sanity-client';
import { IMAGE } from './blocks';

const CONFIG_QUERY_OBJ = `{
  _id,
  "favicon": {
    "src": favicon.asset->url
  },
  header {
    title,
    logo ${IMAGE},
    navItems[] {
      _key,
      label,
      href
    }
  },
  footer {
    text
  },
  titleSuffix,
  checkoutBaseUrl,
  checkoutProductParam,
  checkoutVariantParam
}`;

export async function fetchData() {
    return await client.fetch(`*[_type == "siteConfig"][0] ${CONFIG_QUERY_OBJ}`);
}
