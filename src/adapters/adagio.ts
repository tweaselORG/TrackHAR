import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidServerSetuidDataPaths } from './common/prebid-server';

const tracker: Tracker = {
    slug: 'adagio',
    name: 'Adagio (Onfocus SAS)',
    datenanfragenSlug: 'adagio',
};

const adagioCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning: 'https://adagio.io/privacy',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning: 'https://adagio.io/privacy',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning: 'https://adagio.io/privacy',
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

    userId: {
        context: 'cookie',
        path: 'uidsParsed.uids.*.uid',
        reasoning: 'https://adagio.io/privacy',
    },
};

export const adapters: Adapter[] = [
    {
        slug: '4dex-mp-prebid',
        name: 'Adagio Prebid integration',
        tracker,

        endpointUrls: ['https://mp.4dex.io/prebid'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
            { function: 'decodeBase64', input: 'res.cookie.uids', output: 'uidsDecoded' },
            { function: 'parseJson', input: 'uidsDecoded', output: 'res.cookie.uidsParsed' },
        ],
        containedDataPaths: mergeContainedDataPaths(openrtbDataPaths, adagioCommonHeaderAndCookiePaths, {
            propertyId: {
                context: 'body',
                path: 'organizationId',
                reasoning: 'https://docs.prebid.org/dev-docs/bidders/adagio.html#bid-params',
            },

            userAgent: {
                context: 'body',
                path: 'device.userAgent',
                reasoning: 'obvious property name',
            },

            sessionId: {
                context: 'body',
                path: 'data.session.id',
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
        slug: '4dex-u-setuid',
        // Implements: https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-setuid.html
        name: 'Adagio Prebid server cookie sync (setuid)',
        tracker,

        endpointUrls: ['https://u.4dex.io/setuid'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(prebidServerSetuidDataPaths, adagioCommonHeaderAndCookiePaths),
    },
];
