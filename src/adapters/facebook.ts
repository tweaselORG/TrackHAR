import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    name: 'Facebook',
    datenanfragenSlug: 'facebook',
};

export const adapters: Adapter[] = [
    {
        tracker,

        endpointUrls: [/^https:\/\/graph\.facebook\.com\/v12\.0/],
        match: (r) => r.content?.startsWith('{"') || r.content?.startsWith('format=json&'),
    },
];
