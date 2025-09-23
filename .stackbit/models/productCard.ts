import { type ModelExtension } from '@stackbit/types';

export const productCard: ModelExtension = {
    name: 'productCard',
    fields: [
        { name: 'image' },
        { name: 'name' },
        { name: 'description' },
        { name: 'rating' },
        { name: 'category' },
        { name: 'price' },
        { name: 'url' }
    ]
};



