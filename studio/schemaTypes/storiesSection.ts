import { defineField, defineType } from 'sanity'
import { SquareIcon } from '@sanity/icons'
import { SECTION_BASE_FIELDS, SECTION_BASE_GROUPS } from './sectionBase'

export default defineType({
  name: 'storiesSection',
  title: 'Stories',
  type: 'object',
  icon: SquareIcon,
  groups: SECTION_BASE_GROUPS,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
    defineField({
      name: 'items',
      title: 'Stories',
      type: 'array',
      of: [
        {
          type: 'story',
        },
      ],
      group: 'content',
    }),
    ...SECTION_BASE_FIELDS,
  ],
})



