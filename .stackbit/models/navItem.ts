import { type ModelExtension } from '@stackbit/types';

export const navItem: ModelExtension = {
    name: 'navItem',
    fields: [
        { name: 'label', controlType: 'text' },
        { name: 'href', controlType: 'text' }
    ]
};
