import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'sharethrough',
    name: 'Sharethrough, Inc.',
    datenanfragenSlug: 'sharethrough',
};

const sharethroughCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://privacy-center.sharethrough.com/en/consumer-privacy-notice/#3',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://privacy-center.sharethrough.com/en/consumer-privacy-notice/#3',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://privacy-center.sharethrough.com/en/consumer-privacy-notice/#3',
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

    userId: {
        context: 'cookie',
        path: 'stx_user_id',
        reasoning: 'obvious property name',
    },
};

export const adapters: Adapter[] = [
    {
        slug: 'btlr-universal-v1',
        // Ref: https://sharethrough.atlassian.net/wiki/spaces/SPK/pages/26159087627/PrebidJS#Adapter-Details
        name: 'Sharethrough Prebid.js OpenRTB integration',
        tracker,

        endpointUrls: ['https://btlr.sharethrough.com/universal/v1'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths(),
            prebidjsOpenRtbDataPaths(),

            sharethroughCommonHeaderAndCookiePaths,
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
        slug: 'match-universal-v1',
        name: 'Sharethrough (match/universal/v1)',
        tracker,

        endpointUrls: ['https://match.sharethrough.com/universal/v1'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            sharethroughCommonHeaderAndCookiePaths,

            {
                userId: {
                    context: 'query',
                    path: 'source_user_id',
                    reasoning: 'obvious property name',
                },

                consentState: {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
            }
        ),
    },

    {
        slug: 'match-sync-v1',
        // See: https://support.sharethrough.com/hc/en-us/articles/206239846-User-ID-Syncing
        name: 'Sharethrough DSP-initiated User ID Syncing',
        tracker,

        endpointUrls: ['https://match.sharethrough.com/sync/v1'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            sharethroughCommonHeaderAndCookiePaths,

            {
                propertyId: {
                    context: 'query',
                    path: 'source_id',
                    reasoning: 'https://support.sharethrough.com/hc/en-us/articles/206239846-User-ID-Syncing',
                },

                userId: {
                    context: 'query',
                    path: 'source_user_id',
                    notIf: 'OPTOUT',
                    reasoning: 'https://support.sharethrough.com/hc/en-us/articles/206239846-User-ID-Syncing',
                },

                consentState: {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
            }
        ),
    },
];
