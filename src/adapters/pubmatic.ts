import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'pubmatic',
    name: 'PubMatic, Inc.',
    datenanfragenSlug: 'pubmatic',
    exodusId: 236,
};

const pubmaticCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    deviceId: {
        context: 'cookie',
        path: 'KADUSERCOOKIE',
        reasoning: 'https://pubmatic.com/legal/platform-cookie-policy/',
    },

    userId: {
        context: 'cookie',
        path: '$[?(@property.startsWith("KRTBCOOKIE_"))]',
        reasoning: 'https://pubmatic.com/legal/platform-cookie-policy/',
    },

    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://pubmatic.com/legal/privacy-policy/#userinfowecollect',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://pubmatic.com/legal/privacy-policy/#userinfowecollect',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://pubmatic.com/legal/privacy-policy/#userinfowecollect',
        },
    ],

    referer: [
        {
            context: 'header',
            path: 'referer',
            reasoning: 'obvious property name',
        },
        {
            context: 'header',
            path: 'Referer',
            reasoning: 'obvious property name',
        },
    ],
};

export const adapters: Adapter[] = [
    {
        slug: 'hbopenbid-translator',
        name: 'Pubmatic (hbopenbid/translator)',
        tracker,

        endpointUrls: ['https://hbopenbid.pubmatic.com/translator'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths(),
            prebidjsOpenRtbDataPaths(),
            pubmaticCommonHeaderAndCookiePaths,
            {
                appId: {
                    context: 'header',
                    path: 'x-requested-with',
                    reasoning: 'obvious observed values',
                },
            }
        ),
    },

    {
        slug: 'adserver-pug',
        // I have not found a source for this, but:
        // - If you access the endpoint (with parameters), it returns a 1x1 image, so it is clearly a tracking pixel.
        // - The `rd` parameter in the query string is clearly a redirect URL for cookie syncing.
        name: 'Pubmatic cookie sync pixel (AdServer/Pug)',
        tracker,

        endpointUrls: [/^https:\/\/s?image\d\.pubmatic\.com\/AdServer\/Pug$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(pubmaticCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious property name',
            },
        }),
    },

    {
        slug: 'adserver-pugmaster',
        name: 'Pubmatic (AdServer/PugMaster)',
        tracker,

        endpointUrls: [/^https:\/\/s?image\d\.pubmatic\.com\/AdServer\/PugMaster$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(pubmaticCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'adserver-spug',
        name: 'Pubmatic cookie sync pixel (AdServer/SPug)',
        tracker,

        endpointUrls: [/^https:\/\/s?image\d\.pubmatic\.com\/AdServer\/SPug$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(pubmaticCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious property name',
            },

            propertyId: {
                context: 'query',
                path: 'partnerID',
                notIf: '0',
                reasoning: 'obvious property name',
            },
        }),
    },

    {
        slug: 'adserver-ucookiesetpug',
        // Same justification for the name as in `adserver-pug`.
        name: 'Pubmatic cookie sync pixel (AdServer/UCookieSetPug)',
        tracker,

        endpointUrls: [/^https:\/\/image\d\.pubmatic\.com\/AdServer\/UCookieSetPug$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(pubmaticCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'adserver-js-user-sync-html',
        name: 'Pubmatic cookie sync (AdServer/js/user_sync.html)',
        tracker,

        endpointUrls: ['https://ads.pubmatic.com/AdServer/js/user_sync.html'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(pubmaticCommonHeaderAndCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'gdprConsent',
                    reasoning: 'obvious property name',
                },
            ],

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'adserver-imgsync',
        name: 'Pubmatic (AdServer/ImgSync)',
        tracker,

        endpointUrls: ['https://image8.pubmatic.com/AdServer/ImgSync'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(pubmaticCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                notIf: '{consent}',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'ow-openrtb-2-5',
        name: 'Pubmatic OpenRTB 2.5 integration (ow/openrtb/2.5)',
        tracker,

        endpointUrls: ['https://ow.pubmatic.com/openrtb/2.5'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(openrtbDataPaths(), prebidjsOpenRtbDataPaths(), {
            userAgent: [
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'https://pubmatic.com/legal/privacy-policy/#userinfowecollect',
                },
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'https://pubmatic.com/legal/privacy-policy/#userinfowecollect',
                },
            ],
        }),
    },
];
