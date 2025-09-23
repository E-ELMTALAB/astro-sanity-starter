import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productCard',
  title: 'Product Card',
  type: 'object',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta'},
  ],
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'customImage', group: 'content' }),
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'rating', title: 'Rating', type: 'number', group: 'meta' }),
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'meta' }),
    defineField({ name: 'price', title: 'Price', type: 'number', group: 'meta' }),
    defineField({ name: 'url', title: 'URL', type: 'string', group: 'meta' }),
    defineField({
      name: 'productSlug',
      title: 'Product slug',
      description: 'Slug passed to the Telegram shop checkout page.',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'variantSku',
      title: 'Variant SKU',
      description: 'Optional variant SKU used by the Telegram shop checkout.',
      type: 'string',
      group: 'meta',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image.image.asset',
    },
    prepare(selection) {
      return {
        title: selection.title,
        media: selection.media,
      }
    },
  },
})



