import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidServerSetuidDataPaths } from './common/prebid-server';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'magnite',
    // See: https://www.bizjournals.com/losangeles/news/2020/06/30/rubicon-rebrands-as-magnite-after-telaria-merger.html
    name: 'Magnite, Inc. (formerly The Rubicon Project)',
    datenanfragenSlug: 'rubiconproject',
    exodusId: 145,
};

const rubiconCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning:
                'https://www.magnite.com/legal/advertising-platform-privacy-policy/#information-we-collect-use-disclose-and-the-purposes-for-such-disclosure',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning:
                'https://www.magnite.com/legal/advertising-platform-privacy-policy/#information-we-collect-use-disclose-and-the-purposes-for-such-disclosure',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning:
                'https://www.magnite.com/legal/advertising-platform-privacy-policy/#information-we-collect-use-disclose-and-the-purposes-for-such-disclosure',
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

    browserId: {
        context: 'cookie',
        path: 'khaos',
        reasoning: 'https://www.magnite.com/legal/user-choice-portal/#digital-identifiers',
    },
};

export const adapters: Adapter[] = [
    {
        slug: 'rubicon-pbs-openrtb2-auction',
        name: 'Rubicon Project Prebid Server OpenRTB Auction',
        tracker,

        // Implements: https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html
        endpointUrls: ['https://prebid-server.rubiconproject.com/openrtb2/auction'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
            { function: 'decodeBase64', input: 'res.cookie.uids', output: 'uidsDecoded' },
            { function: 'parseJson', input: 'uidsDecoded', output: 'res.cookie.uidsParsed' },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths(),
            prebidjsOpenRtbDataPaths(),
            rubiconCommonHeaderAndCookiePaths,
            {
                userId: {
                    context: 'cookie',
                    path: 'uidsParsed.tempUIDs.*.uid',
                    notIf: 'OPTOUT',
                    reasoning: 'https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html#motivation',
                },
            }
        ),
    },

    {
        slug: 'rubicon-fastlane-json',
        // FastLane is Rubicon's header bidding solution, cf.:
        // https://investor.rubiconproject.com/news-releases/news-release-details/rubicon-project-expands-leading-header-bidding-solution-first
        // and
        // https://www.businesswire.com/news/home/20160328005067/en/Rubicon-Project-Launches-First-Header-Bidding-Solution-Compliant-with-Google-AMP
        name: 'Rubicon Project FastLane',
        tracker,

        endpointUrls: ['https://fastlane.rubiconproject.com/a/api/fastlane.json'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, {
            propertyId: {
                context: 'query',
                path: 'site_id',
                reasoning: 'obvious property name',
            },

            viewedPageKeywords: {
                context: 'query',
                path: 'kw',
                reasoning: 'obvious property name',
            },

            userId: [
                {
                    context: 'query',
                    path: '$["eid_pubcid.org"]',
                    reasoning: 'https://docs.prebid.org/dev-docs/modules/pubCommonId.html',
                },
                {
                    context: 'query',
                    path: 'ppuid',
                    reasoning: 'https://docs.prebid.org/dev-docs/modules/userid-submodules/pubprovided.html',
                },
                {
                    context: 'query',
                    path: '$["eid_id5-sync.com"]',
                    notIf: '0^1^',
                    reasoning:
                        'https://github.com/id5io/id5-api.js/blob/1cf1ed3d0baeaedc5511aacb2ad5cf3295da4362/README.md#id5-id',
                },
            ],

            userAgent: [
                {
                    context: 'query',
                    path: 'm_ch_ua',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'm_ch_full_ver',
                    reasoning: 'obvious observed values',
                },
            ],

            isMobileDevice: {
                context: 'query',
                path: 'm_ch_mobile',
                reasoning: 'obvious property name',
            },

            osName: {
                context: 'query',
                path: 'm_ch_platform',
                reasoning: 'obvious property name',
            },

            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'tg_v.consent',
                    reasoning: 'obvious property name',
                },
            ],

            appId: [
                {
                    context: 'header',
                    path: 'X-Requested-With',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'header',
                    path: 'x-requested-with',
                    reasoning: 'obvious observed values',
                },
            ],
        }),
    },

    {
        slug: 'rubicon-pixel-exchange-sync-php',
        // See: https://github.com/prebid/prebid-server/issues/272
        name: 'Rubicon Project cookie sync pixel',
        tracker,

        endpointUrls: [
            'https://pixel.rubiconproject.com/exchange/sync.php',
            'https://pixel-eu.rubiconproject.com/exchange/sync.php',
            'https://pixel-us-east.rubiconproject.com/exchange/sync.php',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, {
            propertyId: {
                context: 'query',
                path: 'p',
                reasoning: 'https://github.com/prebid/prebid-server/issues/1405#issuecomment-661045724',
            },

            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    reasoning: 'obvious property name',
                },
            ],

            userId: [
                {
                    context: 'query',
                    path: 'google_gid',
                    reasoning:
                        'https://developers.google.com/authorized-buyers/rtb/cookie-guide#step-2:-google-responds-with-redirect-including-match-data',
                },
                {
                    context: 'query',
                    path: 'obUid',
                    reasoning: 'https://www.outbrain.com/privacy/cookies/',
                },
            ],

            browserId: {
                context: 'query',
                path: 'khaos',
                reasoning: 'https://www.magnite.com/legal/user-choice-portal/#digital-identifiers',
            },

            appId: {
                context: 'header',
                path: 'X-Requested-With',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'rubicon-eus-usync-html',
        name: 'Rubicon Project cookie sync (usync.html)',
        tracker,

        endpointUrls: ['https://eus.rubiconproject.com/usync.html'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, {
            propertyId: {
                context: 'query',
                path: 'p',
                reasoning: 'https://github.com/prebid/prebid-server/issues/1405#issuecomment-661045724',
            },

            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    reasoning: 'obvious property name',
                },
            ],

            appId: {
                context: 'header',
                path: 'X-Requested-With',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'rubicon-token-khaos-json',
        name: 'Rubicon Project (token/khaos.json)',
        tracker,

        endpointUrls: ['https://token.rubiconproject.com/khaos.json'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious property name',
            },

            browserId: {
                context: 'query',
                path: 'khaos',
                reasoning: 'https://www.magnite.com/legal/user-choice-portal/#digital-identifiers',
            },
        }),
    },

    {
        slug: 'rubicon-token-token',
        name: 'Rubicon Project (token/token)',
        tracker,

        endpointUrls: ['https://token.rubiconproject.com/token'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'header',
                path: 'X-Requested-With',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'rubicon-pixel-tap-php',
        name: 'Rubicon Project (pixel/tap.php)',
        tracker,

        endpointUrls: ['https://pixel.rubiconproject.com/tap.php'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious property name',
            },

            appId: {
                context: 'header',
                path: 'X-Requested-With',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'rubicon-pixel-token',
        name: 'Rubicon Project (pixel/token)',
        tracker,

        endpointUrls: ['https://pixel.rubiconproject.com/token'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    notIf: '["",""]',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    reasoning: 'obvious property name',
                },
            ],

            appId: {
                context: 'header',
                path: 'X-Requested-With',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'rubicon-xapi-multi-sync-html',
        name: 'Rubicon Project (utils/xapi/multi-sync.html)',
        tracker,

        endpointUrls: ['https://secure-assets.rubiconproject.com/utils/xapi/multi-sync.html'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, {
            propertyId: {
                context: 'query',
                path: 'p',
                reasoning: 'https://github.com/prebid/prebid-server/issues/1405#issuecomment-661045724',
            },

            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    reasoning: 'obvious property name',
                },
            ],

            appId: [
                {
                    context: 'header',
                    path: 'X-Requested-With',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'header',
                    path: 'x-requested-with',
                    reasoning: 'obvious observed values',
                },
            ],
        }),
    },

    {
        slug: 'rubicon-pbs-setuid',
        // Implements: https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-setuid.html
        name: 'Rubicon Project Prebid Server cookie sync (setuid)',
        tracker,

        endpointUrls: ['https://prebid-server.rubiconproject.com/setuid'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(rubiconCommonHeaderAndCookiePaths, prebidServerSetuidDataPaths, {
            consentState: {
                context: 'query',
                path: 'gpp',
                reasoning: 'obvious property name',
            },
        }),
    },
];
