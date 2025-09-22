import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'
import {SECTION_BASE_FIELDS, SECTION_BASE_GROUPS} from './sectionBase'

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
          type: 'object',
          name: 'categoryItem',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'icon', title: 'Icon (emoji or text)', type: 'string' },
            { name: 'count', title: 'Count Label', type: 'string' },
            { name: 'gradient', title: 'Gradient (Tailwind classes)', type: 'string' },
            { name: 'url', title: 'URL', type: 'string' },
          ],
        },
      ],
      group: 'content',
    }),
    ...SECTION_BASE_FIELDS,
  ],
})



