import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'criteo',
    name: 'Criteo',
    description: 'criteo',
    datenanfragenSlug: 'criteo',
    exodusId: 170,
};

const criteoCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    browserId: {
        context: 'cookie',
        path: 'uid',
        reasoning: 'https://www.criteo.com/privacy/how-we-use-your-data/',
    },

    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://www.criteo.com/privacy/how-we-use-your-data/',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://www.criteo.com/privacy/how-we-use-your-data/',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://www.criteo.com/privacy/how-we-use-your-data/',
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
        slug: 'gum-syncframe',
        // https://pep.gmu.edu/wp-content/uploads/sites/28/2024/04/Johnson-Neumann.pdf mentions that this is related to
        // the Google Topics API, which I was able to confirm by looking at the returned HTML. It calls
        // `document.browsingTopics()` for example.
        name: 'Criteo Google Topics API integration (gum/syncframe)',
        tracker,

        endpointUrls: ['https://gum.criteo.com/syncframe'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            ...criteoCommonHeaderAndCookiePaths,

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            viewedPage: {
                context: 'query',
                path: 'topUrl',
                reasoning: 'obvious observed values',
            },

            consentState: [
                // TCF consent string
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious property name',
                },
                // GPP consent string
                {
                    context: 'query',
                    path: 'gpp',
                    reasoning: 'obvious property name',
                },
            ],
        },
    },

    {
        slug: 'bidder-cdb',
        // Previously "Criteo Direct Bidder" (cdb, see:
        // https://archive.ph/2018.04.03-064004/http://demo.criteo.com/support/publisher/cdb/), later rolled into
        // Commerce Grid (see:
        // https://www.criteo.com/wp-content/uploads/2023/06/Criteo-Launches-First-ever-Supply-side-Platform-Built-for-Commerce.pdf).
        name: 'Criteo Commerce Grid Prebid.js OpenRTB integration',
        description: 'criteo-commerce-grid-prebidjs',
        tracker,

        endpointUrls: ['https://bidder.criteo.com/cdb'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            criteoCommonHeaderAndCookiePaths,
            openrtbDataPaths,
            prebidjsOpenRtbDataPaths,
            {
                trackerSdkVersion: {
                    context: 'query',
                    path: 'ptv',
                    reasoning:
                        'https://archive.ph/2018.04.03-064004/http://demo.criteo.com/support/publisher/cdb/#selection-639.27-639.40',
                },
            }
        ),
    },

    {
        slug: 'bidder-csm-events',
        name: 'Criteo (bidder/csm/events)',
        tracker,

        endpointUrls: ['https://bidder.criteo.com/csm/events'],

        decodingSteps: [
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: criteoCommonHeaderAndCookiePaths,
    },

    {
        slug: 'mug-sid',
        name: 'Criteo (mug/sid)',
        tracker,

        endpointUrls: ['https://mug.criteo.com/sid'],

        decodingSteps: [
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: criteoCommonHeaderAndCookiePaths,
    },

    {
        slug: 'gum-sid-json',
        name: 'Criteo (gum/sid/json)',
        tracker,

        endpointUrls: ['https://gum.criteo.com/sid/json'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            ...criteoCommonHeaderAndCookiePaths,

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            viewedPage: {
                context: 'query',
                path: 'topUrl',
                reasoning: 'obvious observed values',
            },

            consentState: {
                context: 'query',
                path: 'gdprString',
                reasoning: 'obvious observed values',
            },
        },
    },

    {
        slug: 'dis-usersync',
        name: 'Criteo (dis/usersync)',
        tracker,

        endpointUrls: ['https://dis.criteo.com/dis/usersync.aspx'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
            { function: 'parseQueryString', input: 'res.query.url', output: 'res.query.url_query' },
        ],
        containedDataPaths: mergeContainedDataPaths(criteoCommonHeaderAndCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'url_query.gdpr_consent',
                    reasoning: 'obvious observed values',
                },
            ],

            otherIdentifiers: [
                {
                    context: 'query',
                    path: 'uid',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'url_query.uid',
                    notIf: '@@CRITEO_USERID@@',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'url_query.obUid',
                    reasoning: 'obvious property name',
                },
            ],

            userId: {
                context: 'query',
                path: 'publisher_user_id',
                reasoning: 'obvious property name',
            },
        }),
    },

    {
        slug: 'bidder-inapp-v2',
        name: 'Criteo (bidder/inapp/v2)',
        tracker,

        endpointUrls: ['https://bidder.criteo.com/inapp/v2'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: {
            userAgent: [
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'https://www.criteo.com/privacy/how-we-use-your-data/',
                },
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'https://www.criteo.com/privacy/how-we-use-your-data/',
                },
                {
                    context: 'body',
                    path: 'user.userAgent',
                    reasoning: 'obvious property name',
                },
            ],

            appId: {
                context: 'body',
                path: 'publisher.bundleId',
                reasoning: 'obvious property name',
            },

            advertisingId: {
                context: 'body',
                path: 'user.deviceId',
                reasoning: 'observed values match known device parameters',
            },

            osName: {
                context: 'body',
                path: 'user.deviceOs',
                reasoning: 'obvious property name',
            },

            country: {
                context: 'body',
                path: 'user.ext.user.geo.country',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'user.ext.device.w',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'user.ext.device.h',
                reasoning: 'obvious property name',
            },

            model: [
                {
                    context: 'body',
                    path: 'user.ext.device.model',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'user.deviceModel',
                    reasoning: 'obvious property name',
                },
            ],

            manufacturer: {
                context: 'body',
                path: 'user.ext.device.make',
                reasoning: 'obvious property name',
            },

            language: {
                context: 'body',
                path: 'user.ext.data.inputLanguage',
                reasoning: 'obvious property name',
            },

            sessionDuration: {
                context: 'body',
                path: 'user.ext.data.sessionDuration',
                reasoning: 'obvious property name',
            },

            orientation: {
                context: 'body',
                path: 'user.ext.data.orientation',
                reasoning: 'obvious property name',
            },

            trackerSdkVersion: {
                context: 'body',
                path: 'sdkVersion',
                reasoning: 'obvious property name',
            },

            consentState: {
                context: 'body',
                path: 'gdprConsent.consentData',
                reasoning: 'obvious property name',
            },
        },
    },

    {
        slug: 'gum-sync',
        name: 'Criteo (gum/sync)',
        tracker,

        endpointUrls: ['https://gum.criteo.com/sync'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            ...criteoCommonHeaderAndCookiePaths,

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious observed values',
            },
        },
    },

    {
        slug: 'sslwidget-event',
        name: 'Criteo (sslwidget/event)',
        tracker,

        endpointUrls: ['https://sslwidget.criteo.com/event'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'parseJson', input: 'res.query.sc', output: 'res.query.sc' },
            { function: 'parseJson', input: 'res.query.external_advids', output: 'res.query.external_advids' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(criteoCommonHeaderAndCookiePaths, {
            propertyId: {
                context: 'query',
                path: 'tld',
                reasoning: 'obvious observed values',
            },

            viewedPage: {
                context: 'query',
                path: 'fu',
                reasoning: 'obvious observed values',
            },

            browserId: [
                {
                    context: 'query',
                    path: 'sc.fbp',
                    reasoning:
                        'https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc#fbp',
                },
                {
                    context: 'query',
                    path: 'sc.ttp',
                    reasoning: 'https://business-api.tiktok.com/portal/docs?id=1739584860883969',
                },
            ],

            userId: {
                context: 'query',
                path: "external_advids[?(@.type === 'Id5')].value",
                reasoning:
                    'https://github.com/id5io/id5-api.js/blob/1cf1ed3d0baeaedc5511aacb2ad5cf3295da4362/README.md#id5-id',
            },
        }),
    },

    {
        slug: 'ld-js',
        name: 'Criteo (ld.js)',
        tracker,

        endpointUrls: ['https://dynamic.criteo.com/js/ld/ld.js'],

        decodingSteps: [
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            ...criteoCommonHeaderAndCookiePaths,

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },
        },
    },

    {
        slug: 'grid-bidder-prebidjs',
        name: 'Criteo Prebid.js OpenRTB integration',
        description: 'criteo-grid-bidder-prebidjs',
        tracker,

        endpointUrls: ['https://grid-bidder.criteo.com/openrtb_2_5/pbjs/auction/request'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            criteoCommonHeaderAndCookiePaths,
            openrtbDataPaths,
            prebidjsOpenRtbDataPaths
        ),
    },
];
