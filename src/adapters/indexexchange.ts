import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'indexexchange',
    // See: https://mediaincanada.com/2015/01/28/casale-media-rebrands-as-index-exchange/
    name: 'Index Exchange (formerly Casale Media)',
    datenanfragenSlug: 'indexexchange',
};

const indexexchangeCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://www.indexexchange.com/privacy/exchange-platform-privacy-policy/#section-2',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://www.indexexchange.com/privacy/exchange-platform-privacy-policy/#section-2',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://www.indexexchange.com/privacy/exchange-platform-privacy-policy/#section-2',
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
        path: 'CMID',
        reasoning: 'https://www.indexexchange.com/privacy/index-exchange-platform-cookie-notice/',
    },
};

export const adapters: Adapter[] = [
    {
        slug: 'htlb-openrtb-pbjs',
        name: 'Casale Media Prebid.js OpenRTB integration',
        tracker,

        endpointUrls: ['https://htlb.casalemedia.com/openrtb/pbjs'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths,
            prebidjsOpenRtbDataPaths,
            indexexchangeCommonHeaderAndCookiePaths
        ),
    },

    {
        slug: 'ssum-usermatch',
        // See: https://docs.prebid.org/dev-docs/bidders/ix-server.html#hosting-instance
        name: 'Casale Media User Sync (ssum/usermatch)',
        tracker,

        endpointUrls: [
            'https://ssum-sec.casalemedia.com/usermatchredir',
            'https://ssum-sec.casalemedia.com/usermatch',
            'https://ssum.casalemedia.com/usermatchredir',
            'https://ssum.casalemedia.com/usermatch',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'parseQueryString', input: 'res.query.cb', output: 'res.query.cb_parsed' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(indexexchangeCommonHeaderAndCookiePaths, {
            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            propertyId: {
                context: 'query',
                path: 's',
                reasoning: 'https://docs.prebid.org/dev-docs/bidders/ix-server.html#hosting-instance',
            },

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
                {
                    context: 'query',
                    path: 'cb_parsed.gdpr_consent',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'cb_parsed.gpp',
                    onlyIf: /^DBAB/,
                    reasoning: 'obvious observed values',
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
                    path: 'cb_parsed.obUid',
                    reasoning: 'https://www.outbrain.com/privacy/cookies/',
                },
            ],
        }),
    },

    {
        slug: 'dsum-rum',
        name: 'Casale Media (dsum/rum)',
        tracker,

        endpointUrls: [
            'https://dsum-sec.casalemedia.com/rum',
            'https://dsum-sec.casalemedia.com/crum',
            'https://r.casalemedia.com/rum',
            'https://dsum.casalemedia.com/rum',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(indexexchangeCommonHeaderAndCookiePaths, {
            appId: {
                context: 'header',
                path: 'X-Requested-With',
                reasoning: 'obvious observed values',
            },

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

            userId: [
                {
                    context: 'query',
                    path: 'external_user_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'user_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'query',
                    path: 'userId',
                    reasoning: 'obvious property name',
                },
            ],
        }),
    },
];
