import { defineField, defineType } from 'sanity'
import { SquareIcon } from '@sanity/icons'
import { SECTION_BASE_FIELDS, SECTION_BASE_GROUPS } from './sectionBase'

export default defineType({
  name: 'categoriesSection',
  title: 'Categories',
  type: 'object',
  icon: SquareIcon,
  groups: SECTION_BASE_GROUPS,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
    defineField({ name: 'body', title: 'Body', type: 'markdown', group: 'content' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'categoryItem',
        },
      ],
      group: 'content',
    }),
    ...SECTION_BASE_FIELDS,
  ],
})



