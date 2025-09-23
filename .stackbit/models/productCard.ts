import { type ModelExtension } from '@stackbit/types';

export const productCard: ModelExtension = {
    name: 'productCard',
    fields: [
        {
            name: 'productSlug',
            controlType: 'text',
            label: 'Product slug',
            helperText: 'Slug passed to the Telegram shop checkout page.'
        },
        {
            name: 'variantSku',
            controlType: 'text',
            label: 'Variant SKU',
            helperText: 'Optional variant SKU used by the Telegram shop checkout.'
        }
    ]
};



