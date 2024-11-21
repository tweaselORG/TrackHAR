import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'id5',
    name: 'ID5 Technology Ltd.',
    description: 'id5',
    datenanfragenSlug: 'id5',
};

const id5CommonCookieAndHeaderPaths: Adapter['containedDataPaths'] = {
    userId: {
        context: 'cookie',
        path: 'id5',
        reasoning: 'https://github.com/id5io/id5-api.js/blob/874ace5d11a667b992650df198d53775fdb60709/README.md#id5-id',
    },

    userAgent: [
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://id5.io/platform-privacy-policy/#what-information-do-we-collect',
        },
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://id5.io/platform-privacy-policy/#what-information-do-we-collect',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://id5.io/platform-privacy-policy/#what-information-do-we-collect',
        },
    ],

    referer: [
        {
            context: 'header',
            path: 'Referer',
            reasoning: 'obvious property name',
        },
        {
            context: 'header',
            path: 'referer',
            reasoning: 'obvious property name',
        },
    ],
};

const id5PartnerDataPaths = (prefix: string): Adapter['containedDataPaths'] => ({
    viewedPage: {
        context: 'body',
        path: `${prefix}.8`,
        reasoning:
            'https://wiki.id5.io/identitycloud/retrieve-id5-ids/passing-partner-data-to-id5#supported-partner-data-keys',
    },

    websiteUrl: {
        context: 'body',
        path: `${prefix}.9`,
        reasoning:
            'https://wiki.id5.io/identitycloud/retrieve-id5-ids/passing-partner-data-to-id5#supported-partner-data-keys',
    },

    publicIp: [
        {
            context: 'body',
            path: `${prefix}.10`,
            reasoning:
                'https://wiki.id5.io/identitycloud/retrieve-id5-ids/passing-partner-data-to-id5#supported-partner-data-keys',
        },
        {
            context: 'body',
            path: `${prefix}.11`,
            reasoning:
                'https://wiki.id5.io/identitycloud/retrieve-id5-ids/passing-partner-data-to-id5#supported-partner-data-keys',
        },
    ],

    userAgent: {
        context: 'body',
        path: `${prefix}.12`,
        reasoning:
            'https://wiki.id5.io/identitycloud/retrieve-id5-ids/passing-partner-data-to-id5#supported-partner-data-keys',
    },
});

export const adapters: Adapter[] = [
    {
        slug: 'api-config-prebid',
        // See: https://wiki.id5.io/en/identitycloud/retrieve-id5-ids/prebid-user-id-module/id5-prebid-user-id-module
        name: 'ID5 Prebid User ID Module',
        description: 'id5-prebid-user-id',
        tracker,

        endpointUrls: ['https://id5-sync.com/api/config/prebid'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'decodeBase64', input: 'res.body.params.pd', output: 'res.body.params.pdDecoded' },
            { function: 'parseQueryString', input: 'res.body.params.pdDecoded', output: 'res.body.params.pdParsed' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            id5CommonCookieAndHeaderPaths,
            id5PartnerDataPaths('params.pdParsed'),
            {
                propertyId: {
                    context: 'body',
                    path: 'params.partner',
                    reasoning:
                        'https://wiki.id5.io/en/identitycloud/retrieve-id5-ids/prebid-user-id-module/id5-prebid-user-id-module#configuration-parameters',
                },
            }
        ),
    },

    {
        slug: 'g-v2-json',
        // This version of the endpoint was introduced in https://github.com/prebid/Prebid.js/pull/5406 and later
        // changed in https://github.com/prebid/Prebid.js/pull/8784.
        name: 'ID5 Prebid User ID Module v2',
        tracker,

        endpointUrls: [/^https:\/\/id5-sync\.com\/g\/v2\/\d+\.json/],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'decodeBase64', input: 'res.body.pd', output: 'res.body.pdDecoded' },
            { function: 'parseQueryString', input: 'res.body.pdDecoded', output: 'res.body.pdParsed' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(id5CommonCookieAndHeaderPaths, id5PartnerDataPaths('pdParsed'), {
            propertyId: {
                context: 'body',
                path: 'partner',
                reasoning:
                    'https://wiki.id5.io/en/identitycloud/retrieve-id5-ids/prebid-user-id-module/id5-prebid-user-id-module#configuration-parameters',
            },
        }),
    },

    {
        slug: 'cookie-sync-gif',
        // See: https://wiki.id5.io/en/identitycloud/cookie-sync-with-id5/inititiate-cookie-sync-to-id5
        name: 'ID5 Cookie Sync Pixel',
        description: 'id5-cookie-sync',
        tracker,

        endpointUrls: [/^https:\/\/id5-sync\.com\/s\/\d+\/\d+\.gif/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(id5CommonCookieAndHeaderPaths, {
            userId: {
                context: 'query',
                path: 'puid',
                reasoning:
                    'https://wiki.id5.io/en/identitycloud/cookie-sync-with-id5/inititiate-cookie-sync-to-id5#id5-cookie-sync-pixel-url-with-a-user-id',
            },

            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning:
                    'https://wiki.id5.io/en/identitycloud/cookie-sync-with-id5/inititiate-cookie-sync-to-id5#id5-cookie-sync-pixel-url-with-a-user-id',
            },
        }),
    },

    {
        slug: 'gm-v3',
        // See: https://github.com/id5io/id5-api.js/blob/874ace5d11a667b992650df198d53775fdb60709/packages/multiplexing/src/fetch.js#L9
        name: 'ID5 multi fetch v3',
        tracker,

        endpointUrls: ['https://id5-sync.com/gm/v3'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'decodeBase64', mapInput: 'res.body.requests.*.pd', output: 'res.body.pdDecoded' },
            { function: 'parseQueryString', mapInput: 'res.body.pdDecoded', output: 'res.body.pdParsed' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(id5CommonCookieAndHeaderPaths, id5PartnerDataPaths('pdParsed.*'), {
            propertyId: {
                context: 'body',
                path: 'requests.*.partner',
                reasoning:
                    'https://wiki.id5.io/en/identitycloud/retrieve-id5-ids/prebid-user-id-module/id5-prebid-user-id-module#configuration-parameters',
            },

            viewedPage: [
                {
                    context: 'body',
                    path: 'requests.*.tml',
                    // Stands for "topmost location", see: https://github.com/id5io/id5-api.js/blob/874ace5d11a667b992650df198d53775fdb60709/packages/multiplexing/src/fetch.js#L180
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'body',
                    // https://github.com/id5io/id5-api.js/blob/874ace5d11a667b992650df198d53775fdb60709/packages/multiplexing/src/fetch.js#L182
                    path: 'requests.*.cu',
                    reasoning: 'obvious observed values',
                },
            ],

            referer: {
                context: 'body',
                // https://github.com/id5io/id5-api.js/blob/874ace5d11a667b992650df198d53775fdb60709/packages/multiplexing/src/fetch.js#L181
                path: 'requests.*.ref',
                reasoning: 'obvious property name',
            },

            userAgent: [
                {
                    context: 'body',
                    // https://github.com/id5io/id5-api.js/blob/874ace5d11a667b992650df198d53775fdb60709/packages/multiplexing/src/fetch.js#L188
                    path: 'requests.*.ua',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'requests.*.ua_hints',
                    reasoning: 'obvious property name',
                },
            ],

            consentState: {
                context: 'body',
                // https://github.com/id5io/id5-api.js/blob/874ace5d11a667b992650df198d53775fdb60709/packages/multiplexing/src/fetch.js#L197
                path: 'requests.*.gdpr_consent',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'bounce',
        // See: https://wiki.id5.io/en/identitycloud/cookie-sync-with-id5/inititiate-cookie-sync-to-id5
        name: 'ID5 bounce',
        tracker,

        endpointUrls: ['https://id5-sync.com/bounce'],

        decodingSteps: [
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: id5CommonCookieAndHeaderPaths,
    },
];
