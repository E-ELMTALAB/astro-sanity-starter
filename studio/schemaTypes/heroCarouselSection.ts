import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'
import {SECTION_BASE_FIELDS, SECTION_BASE_GROUPS} from './sectionBase'

export default defineType({
  name: 'heroCarouselSection',
  title: 'Hero Carousel',
  type: 'object',
  icon: SquareIcon,
  groups: SECTION_BASE_GROUPS,
  fields: [
    defineField({
      name: 'banners',
      title: 'Banners',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'banner',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
            { name: 'buttonText', title: 'Button Text', type: 'string' },
            { name: 'buttonLink', title: 'Button Link', type: 'string' },
            { name: 'badge', title: 'Badge', type: 'string' },
            { name: 'gradient', title: 'Gradient (Tailwind classes)', type: 'string' },
            {
              name: 'productSlug',
              title: 'Product slug',
              description: 'Slug passed to the Telegram shop checkout page.',
              type: 'string',
            },
            {
              name: 'variantSku',
              title: 'Variant SKU',
              description: 'Optional variant SKU used by the Telegram shop checkout.',
              type: 'string',
            },
          ],
        },
      ],
      group: 'content',
    }),
    ...SECTION_BASE_FIELDS,
  ],
})



