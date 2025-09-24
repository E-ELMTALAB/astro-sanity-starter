import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'story',
    title: 'Story',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'cover',
            title: 'Cover',
            type: 'customImage',
        }),
        defineField({
            name: 'slides',
            title: 'Slides',
            type: 'array',
            of: [
                {
                    type: 'slide',
                },
            ],
        }),
    ],
})
