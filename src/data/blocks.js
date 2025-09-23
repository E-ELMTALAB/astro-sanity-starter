export const IMAGE = `
  {
    "_id": image.asset->_id,
    "src": image.asset->url,
    "dimensions": image.asset->metadata.dimensions,
    "alt": alt,
  }
`;

export const SECTIONS = `{
  ...,
  _type == "featuredProductsSection" => {
    items[] {
      ...,
      image ${IMAGE}
    }
  },
  _type == "heroCarouselSection" => {
    banners[] {
      ...
    }
  },
  _type == "categoriesSection" => {
    items[] {
      ...
    }
  },
  _type == "flashSaleSection" => {
    items[] {
      ...,
      image ${IMAGE}
    }
  },
  _type == "storiesSection" => {
    items[] {
      ...,
      cover ${IMAGE},
      slides[] {
        ...,
        image ${IMAGE}
      }
    }
  },
  _type == "supportSection" => {
    items[] {
      ...
    }
  },
}`;
