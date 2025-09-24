import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'flashProduct',
    title: 'Flash Product',
    type: 'object',
    fields: [
        defineField({
            name: 'image',
            title: 'Image',
            type: 'customImage',
        }),
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
        }),
        defineField({
            name: 'originalPrice',
            title: 'Original Price',
            type: 'number',
        }),
        defineField({
            name: 'discount',
            title: 'Discount %',
            type: 'number',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
        }),
        defineField({
            name: 'rating',
            title: 'Rating',
            type: 'number',
        }),
        defineField({
            name: 'url',
            title: 'URL',
            type: 'string',
        }),
    ],
})
