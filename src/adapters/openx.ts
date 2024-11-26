import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'openx',
    name: 'OpenX Poland sp. z o.o.',
    datenanfragenSlug: 'openx',
    exodusId: 210,
};

const openxCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://www.openx.com/en-gb/privacy-center/ad-exchange-privacy-policy/#section-2',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://www.openx.com/en-gb/privacy-center/ad-exchange-privacy-policy/#section-2',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://www.openx.com/en-gb/privacy-center/ad-exchange-privacy-policy/#section-2',
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

    deviceId: {
        context: 'cookie',
        path: 'i',
        reasoning: 'https://www.openx.com/en-gb/privacy-center/ad-exchange-privacy-policy/#section-6',
    },
};
export const adapters: Adapter[] = [
    {
        slug: 'openrtbb-prebidjs',
        name: 'OpenX Prebid.js OpenRTB integration',
        tracker,

        endpointUrls: ['https://rtb.openx.net/openrtbb/prebidjs'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths(),
            prebidjsOpenRtbDataPaths(),
            openxCommonHeaderAndCookiePaths
        ),
    },

    {
        slug: 'w-1-0-cm',
        name: 'OpenX (w/1.0/cm)',
        tracker,

        endpointUrls: [/^https:\/\/.+\.openx\.net\/w\/1\.0\/cm$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(openxCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'https://docs.openx.com/publishers/adtagguide-parameters/',
            },
        }),
    },

    {
        slug: 'w-1-0-sd',
        // See: https://knowledgebase.zetaglobal.com/pug/implementing-pixels#ImplementingPixels-CookieMatching
        name: 'OpenX cookie matching pixel (w/1.0/sd)',
        tracker,

        endpointUrls: [/^https:\/\/.+\.openx\.net\/w\/1\.0\/sd$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(openxCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'https://docs.openx.com/publishers/adtagguide-parameters/',
            },

            userId: [
                {
                    context: 'query',
                    path: 'val',
                    reasoning:
                        'https://knowledgebase.zetaglobal.com/pug/implementing-pixels#ImplementingPixels-CookieMatching',
                },
                {
                    context: 'query',
                    path: 'ttd_puid',
                    reasoning: 'https://partner.thetradedesk.com/v3/portal/ssp/doc/CookieMapping#initiation',
                },
            ],
        }),
    },

    {
        slug: 'w-1-0-pd',
        name: 'OpenX (w/1.0/pd)',
        tracker,

        endpointUrls: [/^https:\/\/.+\.openx\.net\/w\/1\.0\/pd$/],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(openxCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'https://docs.openx.com/publishers/adtagguide-parameters/',
            },
        }),
    },

    {
        slug: 'rtb-sync-prebid',
        name: 'OpenX (rtb/sync/prebid)',
        tracker,

        endpointUrls: ['https://rtb.openx.net/sync/prebid'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(openxCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'https://docs.openx.com/publishers/adtagguide-parameters/',
            },
        }),
    },
];
