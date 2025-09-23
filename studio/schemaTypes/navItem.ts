import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (Rule) => Rule.required() })
  ]
})
