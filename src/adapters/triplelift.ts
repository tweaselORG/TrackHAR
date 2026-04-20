import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'triplelift',
    name: 'Triple Lift, Inc.',
    datenanfragenSlug: 'triplelift',
    exodusId: 123456,
};

const tripleliftCommonHeaderPaths: Adapter['containedDataPaths'] = {
    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://triplelift.com/platform-privacy-policy/#whatinformationprocess',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://triplelift.com/platform-privacy-policy/#whatinformationprocess',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://triplelift.com/platform-privacy-policy/#whatinformationprocess',
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

    appId: {
        context: 'header',
        path: 'x-requested-with',
        reasoning: 'obvious observed values',
    },
};

const tripleliftCommonCookiePaths: Adapter['containedDataPaths'] = {
    browserId: [
        {
            context: 'cookie',
            path: 'tluid',
            reasoning: 'https://triplelift.com/advertising-technology-platform-cookie-notice/',
        },
        {
            context: 'cookie',
            path: 'tluidp',
            reasoning: 'https://triplelift.com/advertising-technology-platform-cookie-notice/',
        },
    ],
};

export const adapters: Adapter[] = [
    {
        slug: 'tlx-header-auction',
        // Ref: https://github.com/triplelift/documentation/blob/9277c14a356f7d15ec93f1911a48468b839b8532/wrapper.md
        name: 'TripleLift Prebid OpenRTB integration',
        tracker,

        endpointUrls: ['https://tlx.3lift.com/header/auction'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths('ext.ortb2.'),
            prebidjsOpenRtbDataPaths('ext.ortb2.'),

            tripleliftCommonHeaderPaths,
            {
                websiteName: {
                    context: 'body',
                    path: 'ext.fpd.context.name',
                    reasoning: 'obvious observed values',
                },

                websiteUrl: [
                    {
                        context: 'body',
                        path: 'ext.fpd.context.domain',
                        reasoning: 'obvious observed values',
                    },
                    {
                        context: 'body',
                        path: 'ext.fpd.context.publisher.domain',
                        reasoning: 'obvious property name',
                    },
                ],

                referer: {
                    context: 'body',
                    path: 'ext.fpd.context.ref',
                    reasoning: 'obvious property name',
                },

                browserWindowHeight: {
                    context: 'body',
                    path: 'ext.fpd.context.ext.data.adg_rtd.features.viewport_dimensions',
                    reasoning: 'obvious property name',
                },

                browserWindowWidth: {
                    context: 'body',
                    path: 'ext.fpd.context.ext.data.adg_rtd.features.viewport_dimensions',
                    reasoning: 'obvious property name',
                },

                sessionId: {
                    context: 'body',
                    path: 'ext.fpd.context.ext.data.adg_rtd.session.id',
                    reasoning:
                        'https://github.com/prebid/Prebid.js/blob/bb586b85fb59424d366808d1dad82b2602ee0fc8/modules/adagioRtdProvider.js#L99',
                },
            }
        ),
    },

    {
        slug: 'ebd2-xuid',
        // See: https://docs.triplelift.com/docs/user-sync
        name: 'TripleLift User Sync (store demand partner’s user ID)',
        tracker,

        endpointUrls: ['https://eb2.3lift.com/xuid'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(tripleliftCommonHeaderPaths, tripleliftCommonCookiePaths, {
            propertyId: [
                {
                    context: 'query',
                    path: 'mid',
                    reasoning: 'https://docs.triplelift.com/docs/user-sync#demand-partners',
                },
                {
                    context: 'query',
                    path: 'dongle',
                    reasoning: 'https://docs.triplelift.com/docs/user-sync#demand-partners',
                },
            ],

            userId: {
                context: 'query',
                path: 'xuid',
                reasoning: 'https://docs.triplelift.com/docs/user-sync#demand-partners',
            },

            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'https://docs.triplelift.com/docs/user-sync#privacy-parameters',
            },
        }),
    },

    {
        slug: 'ebd2-getuid',
        // See: https://docs.triplelift.com/docs/user-sync
        name: 'TripleLift User Sync (get user ID)',
        tracker,

        endpointUrls: ['https://eb2.3lift.com/getuid'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(tripleliftCommonHeaderPaths, tripleliftCommonCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'https://docs.triplelift.com/docs/user-sync#privacy-parameters',
            },
        }),
    },

    {
        slug: 'ebd2-sync',
        // See: https://docs.triplelift.com/docs/user-sync
        name: 'TripleLift User Sync (get user ID and initiate partner sync)',
        tracker,

        endpointUrls: ['https://eb2.3lift.com/sync'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(tripleliftCommonHeaderPaths, tripleliftCommonCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'https://docs.triplelift.com/docs/user-sync#privacy-parameters',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    notIf: 'DBAA',
                    reasoning: 'https://docs.triplelift.com/docs/user-sync#privacy-parameters',
                },
            ],
        }),
    },

    {
        slug: 'ebd2-ebda',
        name: 'TripleLift (eb2/ebda)',
        tracker,

        endpointUrls: ['https://eb2.3lift.com/ebda'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(tripleliftCommonHeaderPaths, tripleliftCommonCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
            ],
        }),
    },

    {
        slug: 'ebd2-sync-google-demand',
        name: 'TripleLift (sync/google/demand)',
        tracker,

        endpointUrls: ['https://eb2.3lift.com/sync/google/demand'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(tripleliftCommonHeaderPaths, tripleliftCommonCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
            ],
        }),
    },
];
