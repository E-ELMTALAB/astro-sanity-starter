import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'slide',
    title: 'Slide',
    type: 'object',
    fields: [
        defineField({
            name: 'image',
            title: 'Image',
            type: 'customImage',
        }),
        defineField({
            name: 'text',
            title: 'Text',
            type: 'string',
        }),
        defineField({
            name: 'duration',
            title: 'Duration (ms)',
            type: 'number',
        }),
    ],
})
