import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'
import {SECTION_BASE_FIELDS, SECTION_BASE_GROUPS} from './sectionBase'

export default defineType({
  name: 'flashSaleSection',
  title: 'Flash Sale',
  type: 'object',
  icon: SquareIcon,
  groups: SECTION_BASE_GROUPS,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string', group: 'content' }),
    defineField({ name: 'endsIn', title: 'Ends In (text)', type: 'string', group: 'content' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'flashProduct',
          fields: [
            { name: 'image', title: 'Image', type: 'customImage' },
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'price', title: 'Price', type: 'number' },
            { name: 'originalPrice', title: 'Original Price', type: 'number' },
            { name: 'discount', title: 'Discount %', type: 'number' },
            { name: 'category', title: 'Category', type: 'string' },
            { name: 'rating', title: 'Rating', type: 'number' },
            { name: 'url', title: 'URL', type: 'string' },
          ],
        },
      ],
      group: 'content',
    }),
    ...SECTION_BASE_FIELDS,
  ],
})



