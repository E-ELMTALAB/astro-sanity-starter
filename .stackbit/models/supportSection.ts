import { type ModelExtension } from '@stackbit/types';
import { commonFields } from './sectionCommon';

export const supportSection: ModelExtension = {
    name: 'supportSection',
    fields: [
        ...commonFields,
        { name: 'heading' },
        { name: 'body' },
        { name: 'items' }
    ]
};


