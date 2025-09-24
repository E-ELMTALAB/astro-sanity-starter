export const IMAGE = `
  {
    "_id": image.asset->_id,
    "src": image.asset->url,
    "dimensions": image.asset->metadata.dimensions,
    "alt": alt
  }
`;

const BACKGROUND_IMAGE = `
  backgroundImage {
    ...,
    "image": image.asset->{
      "_id": _id,
      "src": url,
      "dimensions": metadata.dimensions
    }
  }
`;

const ENRICHED_IMAGE = `
  {
    "_id": image.asset->_id,
    "src": image.asset->url,
    "dimensions": image.asset->metadata.dimensions,
    "alt": alt
  }
`;

const WITH_KEY_AND_ID = `
  _type,
  _key,
  "_id": coalesce(_id, _key),
  theme,
  width,
  ${BACKGROUND_IMAGE}
`;

export const SECTIONS = `{
  ${WITH_KEY_AND_ID},
  _type == "heroCarouselSection" => {
    ${WITH_KEY_AND_ID},
    banners[] {
      _key,
      "_id": coalesce(_id, _key),
      title,
      subtitle,
      buttonText,
      buttonLink,
      badge,
      gradient
    }
  },
  _type == "storiesSection" => {
    ${WITH_KEY_AND_ID},
    heading,
    items[] {
      _key,
      "_id": coalesce(_id, _key),
      name,
      cover ${IMAGE},
      slides[] {
        _key,
        "_id": coalesce(_id, _key),
        image ${ENRICHED_IMAGE},
        text,
        duration
      }
    }
  },
  _type == "categoriesSection" => {
    ${WITH_KEY_AND_ID},
    heading,
    body,
    items[] {
      _key,
      "_id": coalesce(_id, _key),
      name,
      icon,
      count,
      gradient,
      url
    }
  },
  _type == "flashSaleSection" => {
    ${WITH_KEY_AND_ID},
    heading,
    subtitle,
    endsIn,
    items[] {
      _key,
      "_id": coalesce(_id, _key),
      image ${ENRICHED_IMAGE},
      name,
      description,
      price,
      originalPrice,
      discount,
      category,
      rating,
      url
    }
  },
  _type == "featuredProductsSection" => {
    ${WITH_KEY_AND_ID},
    heading,
    body,
    items[] {
      _key,
      "_id": coalesce(_id, _key),
      image ${ENRICHED_IMAGE},
      name,
      description,
      rating,
      category,
      price,
      url
    }
  },
  _type == "supportSection" => {
    ${WITH_KEY_AND_ID},
    heading,
    body,
    items[] {
      _key,
      "_id": coalesce(_id, _key),
      icon,
      title,
      description,
      actionText,
      actionLink
    }
  }
}`;
