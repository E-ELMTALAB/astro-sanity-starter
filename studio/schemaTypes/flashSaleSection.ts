import { defineField, defineType } from 'sanity'
import { SquareIcon } from '@sanity/icons'
import { SECTION_BASE_FIELDS, SECTION_BASE_GROUPS } from './sectionBase'

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
          type: 'flashProduct',
        },
      ],
      group: 'content',
    }),
    ...SECTION_BASE_FIELDS,
  ],
})



