import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'categoryItem',
    title: 'Category Item',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'icon',
            title: 'Icon (emoji or text)',
            type: 'string',
        }),
        defineField({
            name: 'count',
            title: 'Count Label',
            type: 'string',
        }),
        defineField({
            name: 'gradient',
            title: 'Gradient (Tailwind classes)',
            type: 'string',
        }),
        defineField({
            name: 'url',
            title: 'URL',
            type: 'string',
        }),
    ],
})
