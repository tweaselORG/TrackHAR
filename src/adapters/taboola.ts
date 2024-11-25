import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'taboola',
    name: 'Taboola, Inc.',
    datenanfragenSlug: 'taboola',
    exodusId: 173,
};

const taboolaCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    userId: [
        {
            context: 'cookie',
            path: 't_gid',
            reasoning: 'https://www.taboola.com/policies/cookie-policy#what-cookies-do-we-use-and-why',
        },
        {
            context: 'cookie',
            path: 't_pt_gid',
            reasoning: 'https://www.taboola.com/policies/cookie-policy#what-cookies-do-we-use-and-why',
        },
        {
            context: 'cookie',
            path: 'taboola_fp_td_user_id',
            reasoning: 'https://www.taboola.com/policies/cookie-policy#what-cookies-do-we-use-and-why',
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
        slug: 'openrtb-taboolahb-auction',
        name: 'TaboolaHB OpenRTB Auction',
        tracker,

        endpointUrls: ['https://display.bidder.taboola.com/OpenRTB/TaboolaHB/auction'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths,
            prebidjsOpenRtbDataPaths,

            {
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
            }
        ),
    },

    {
        slug: 'beacon',
        name: 'Taboola beacon',
        tracker,

        endpointUrls: ['https://beacon.taboola.com'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            propertyId: {
                context: 'query',
                path: 'pub',
                reasoning: 'obvious observed values',
            },

            ...taboolaCommonHeaderAndCookiePaths,
        },
    },

    {
        slug: 'videobidrequesthandlerservlet',
        name: 'Taboola VideoBidRequestHandlerServlet',
        tracker,

        endpointUrls: [
            'https://am-wf.taboola.com/VideoBidRequestHandlerServlet',
            'https://wf.taboola.com/VideoBidRequestHandlerServlet',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            propertyId: {
                context: 'query',
                path: 'pubid',
                reasoning: 'obvious property name',
            },

            websiteUrl: {
                context: 'query',
                path: 'cirf',
                reasoning: 'obvious observed values',
            },

            ...taboolaCommonHeaderAndCookiePaths,
        },
    },

    {
        slug: 'opportunityservlet',
        name: 'Taboola OpportunityServlet',
        tracker,

        endpointUrls: ['https://am-vid-events.taboola.com/OpportunityServlet'],

        decodingSteps: [
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: taboolaCommonHeaderAndCookiePaths,
    },

    {
        slug: 'vidanalytics-putes-mbox',
        name: 'Taboola video analytics (putes/mbox)',
        tracker,

        endpointUrls: ['https://vidanalytics.taboola.com/putes/mbox'],

        decodingSteps: [
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: taboolaCommonHeaderAndCookiePaths,
    },

    {
        slug: 'st',
        name: 'Taboola (st)',
        tracker,

        endpointUrls: ['https://am-vid-events.taboola.com/st', 'https://am-vid-events.taboola.com/st'],

        decodingSteps: [
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: taboolaCommonHeaderAndCookiePaths,
    },
];
