import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'
import {SECTION_BASE_FIELDS, SECTION_BASE_GROUPS} from './sectionBase'

export default defineType({
  name: 'supportSection',
  title: 'Support',
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
          name: 'supportItem',
          fields: [
            { name: 'icon', title: 'Icon (Phone/Mail/etc. text key)', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'actionText', title: 'Action Text', type: 'string' },
            { name: 'actionLink', title: 'Action Link', type: 'string' },
          ],
        },
      ],
      group: 'content',
    }),
    ...SECTION_BASE_FIELDS,
  ],
})


