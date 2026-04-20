import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'sovrn',
    name: 'Sovrn, Inc.',
    datenanfragenSlug: 'sovrn',
};

const sovrnCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    userId: [
        {
            context: 'cookie',
            path: 'ljtrtb',
            reasoning: 'https://www.sovrn.com/about-our-cookies/',
        },
        {
            context: 'cookie',
            path: '$[?(@property.startsWith("_ljtrtb_"))]',
            notIf: 'OPTOUT',
            reasoning: 'https://www.sovrn.com/about-our-cookies/',
        },
    ],

    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://www.sovrn.com/privacy-policy/privacy-policy/#Information-We-Collect',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://www.sovrn.com/privacy-policy/privacy-policy/#Information-We-Collect',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://www.sovrn.com/privacy-policy/privacy-policy/#Information-We-Collect',
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
        path: 'X-Requested-With',
        reasoning: 'obvious observed values',
    },

    deviceId: {
        context: 'cookie',
        path: 'ljt_reader',
        reasoning: 'https://www.sovrn.com/about-our-cookies/',
    },
};

export const adapters: Adapter[] = [
    {
        slug: 'lijit-ap-rtb-bid',
        name: 'Sovrn Lijit Prebid.js OpenRTB integration',
        tracker,

        endpointUrls: ['https://ap.lijit.com/rtb/bid'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths(),
            prebidjsOpenRtbDataPaths(),
            sovrnCommonHeaderAndCookiePaths,
            {
                userId: {
                    context: 'body',
                    // Set by: https://github.com/prebid/Prebid.js/blob/15f7e93e25d356e78cdea11d5b94188516913874/modules/sovrnBidAdapter.js#L195
                    path: 'user.ext.prebid_criteoid',
                    reasoning: 'obvious property name',
                },
            }
        ),
    },

    {
        slug: 'lijit-ap-pixel',
        // See: https://knowledge.sovrn.com/kb/sovrn-ortb-cookie-sync-spec
        name: 'Sovrn Lijit OpenRTB cookie sync pixel',
        tracker,

        endpointUrls: ['https://ap.lijit.com/pixel'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(sovrnCommonHeaderAndCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning:
                        'https://knowledge.sovrn.com/kb/sovrn-ortb-cookie-sync-spec#SovrnoRTBCookieSyncSpec-gdpr_consent',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    reasoning: 'https://knowledge.sovrn.com/kb/sovrn-ortb-cookie-sync-spec#SovrnoRTBCookieSyncSpec-gpp',
                },
            ],
        }),
    },

    {
        slug: 'lijit-ce-merge',
        name: 'Sovrn Lijit (ce/merge)',
        tracker,

        endpointUrls: ['https://ce.lijit.com/merge'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(sovrnCommonHeaderAndCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    notIf: 'DBAA',
                    reasoning: 'obvious observed values',
                },
            ],
        }),
    },

    {
        slug: 'lijit-ce-merge',
        name: 'Sovrn Lijit (ce/merge)',
        tracker,

        endpointUrls: ['https://ce.lijit.com/merge'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(sovrnCommonHeaderAndCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    notIf: 'DBAA',
                    reasoning: 'obvious observed values',
                },
            ],
        }),
    },

    {
        slug: 'lijit-beacon-prebid-server',
        name: 'Sovrn Lijit (beacon/prebid-server)',
        tracker,

        endpointUrls: ['https://ce.lijit.com/beacon/prebid-server', 'https://ap.lijit.com/beacon/prebid-server'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(sovrnCommonHeaderAndCookiePaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    notIf: 'DBAA',
                    reasoning: 'obvious observed values',
                },
            ],
        }),
    },

    {
        slug: 'lijit-beacon-amazon',
        name: 'Sovrn Lijit (beacon/amazon)',
        tracker,

        endpointUrls: ['https://ce.lijit.com/beacon/amazon', 'https://ap.lijit.com/beacon/amazon'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(sovrnCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'lijit-dsp-google-cookiematch-dv',
        name: 'Sovrn Lijit (dsp/google/cookiematch/dv)',
        tracker,

        endpointUrls: ['https://ap.lijit.com/dsp/google/cookiematch/dv'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(sovrnCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious observed values',
            },
        }),
    },
];
