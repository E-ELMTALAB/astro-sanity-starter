import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'banner',
    title: 'Banner',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'buttonText',
            title: 'Button Text',
            type: 'string',
        }),
        defineField({
            name: 'buttonLink',
            title: 'Button Link',
            type: 'string',
        }),
        defineField({
            name: 'badge',
            title: 'Badge',
            type: 'string',
        }),
        defineField({
            name: 'gradient',
            title: 'Gradient (Tailwind classes)',
            type: 'string',
        }),
    ],
})
