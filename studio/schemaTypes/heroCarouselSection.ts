import { defineField, defineType } from 'sanity'
import { SquareIcon } from '@sanity/icons'
import { SECTION_BASE_FIELDS, SECTION_BASE_GROUPS } from './sectionBase'

export default defineType({
  name: 'heroCarouselSection',
  title: 'Hero Carousel',
  type: 'object',
  icon: SquareIcon,
  groups: SECTION_BASE_GROUPS,
  fields: [
    defineField({
      name: 'banners',
      title: 'Banners',
      type: 'array',
      of: [
        {
          type: 'banner',
        },
      ],
      group: 'content',
    }),
    ...SECTION_BASE_FIELDS,
  ],
})



