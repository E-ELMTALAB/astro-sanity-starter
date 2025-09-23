import { type ModelExtension } from '@stackbit/types';

export const siteConfig: ModelExtension = {
    name: 'siteConfig',
    type: 'data',
    singleInstance: true,
    canDelete: false,
    fields: [
        { name: 'checkoutBaseUrl', controlType: 'text' },
        { name: 'checkoutProductParam', controlType: 'text' },
        { name: 'checkoutVariantParam', controlType: 'text' }
    ]
};
