import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'outbrain',
    name: 'Outbrain Inc.',
    datenanfragenSlug: 'outbrain',
    exodusId: 11,
};

const zemantaCommonCookieAndHeaderPaths: Adapter['containedDataPaths'] = {
    userId: {
        context: 'cookie',
        path: 'obuid',
        reasoning: 'https://www.outbrain.com/privacy/cookies/',
    },

    deviceId: {
        context: 'cookie',
        path: 'zuid',
        reasoning: 'https://www.outbrain.com/privacy/privacy-policy-outbrain-dsp/',
    },

    userAgent: [
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://www.outbrain.com/privacy/privacy-policy-outbrain-dsp/',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://www.outbrain.com/privacy/privacy-policy-outbrain-dsp/',
        },
    ],

    referer: {
        context: 'header',
        path: 'Referer',
        reasoning: 'obvious property name',
    },
};

export const adapters: Adapter[] = [
    {
        slug: 'zemanta-prebid-bid',
        name: 'Outbrain DSP (formerly Zemanta) Prebid integration',
        tracker,

        endpointUrls: ['https://b1h-euc1.zemanta.com/api/bidder/prebid/bid/'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths(),
            prebidjsOpenRtbDataPaths(),
            zemantaCommonCookieAndHeaderPaths
        ),
    },

    {
        slug: 'zemanta-usersync',
        name: 'Outbrain DSP (formerly Zemanta) user sync',
        tracker,

        endpointUrls: [
            /^https:\/\/b1sync\.zemanta\.com\/usersync\/.+$/,
            /^https:\/\/b1h-euc1\.zemanta\.com\/usersync\/.+$/,
            /^https:\/\/b1h\.zemanta\.com\/usersync\/.+$/,
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(zemantaCommonCookieAndHeaderPaths, {
            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'gpp',
                    reasoning: 'obvious observed values',
                },
            ],
        }),
    },
];
