import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'yoc',
    name: 'YOC AG',
    datenanfragenSlug: 'yoc-ag',
    exodusId: 364,
};

const yocCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    referer: {
        context: 'header',
        path: 'Referer',
        reasoning: 'obvious property name',
    },

    userId: {
        context: 'cookie',
        path: 'tuuid',
        reasoning:
            'https://www.ccm19.de/plugin.php?menuid=253&template=mv/templates/mv_show_front.html&mv_id=1&extern_meta=x&mv_content_id=183&getlang=en',
    },
};

export const adapters: Adapter[] = [
    {
        // See: https://docs.prebid.org/dev-docs/bidders/visx.html, https://yoc.com/visx-platform
        slug: 't-hb-post',
        name: 'YOC VIS.X Prebid.js OpenRTB integration',
        tracker,

        endpointUrls: ['https://t.visx.net/hb_post'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths(),
            prebidjsOpenRtbDataPaths(),
            yocCommonHeaderAndCookiePaths
        ),
    },

    {
        slug: 't-sync',
        name: 'YOC VIS.X (sync)',
        tracker,

        endpointUrls: ['https://t.visx.net/sync', 'https://t.visx.net/push_sync', 'https://t.visx.net/sync_proxy'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(yocCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious observed values',
            },
        }),
    },
];
