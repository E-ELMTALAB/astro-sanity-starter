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
  backgroundImage {
    ...,
    "image": {
      "_id": image.asset->_id,
      "src": image.asset->url
    }
  },
  _type == "cardsSection" => {
    items[] {
      ...,
      image ${IMAGE}
    }
  },
  _type == "featuredProductsSection" => {
    items[] {
      ...,
      image ${IMAGE}
    }
  },
  _type == "logosSection" => {
    items[] ${IMAGE}
  },
  _type == "heroCarouselSection" => {
    banners[] { ... }
  },
  _type == "categoriesSection" => {
    items[] { ... }
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
  _type == "testimonialsSection" => {
    items[] {
        ...,
        author-> {
            _type,
            _id,
            name,
            title,
            image ${IMAGE},
            company-> {
                _type,
                _id,
                name,
                logo ${IMAGE}
            }
        }
    }
  },
}`;
