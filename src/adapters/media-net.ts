import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'media-net',
    name: 'Media.Net Advertising FZ-LLC',
    datenanfragenSlug: 'media-net',
};

export const adapters: Adapter[] = [
    {
        slug: 'rtb-prebid',
        name: 'Media.Net Prebid.js OpenRTB integration (rtb/prebid)',
        tracker,

        endpointUrls: ['https://prebid.media.net/rtb/prebid'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(openrtbDataPaths('ortb2.'), prebidjsOpenRtbDataPaths('ortb2.'), {
            websiteUrl: {
                context: 'body',
                path: 'site.domain',
                reasoning: 'obvious property name',
            },

            viewedPage: {
                context: 'body',
                path: 'site.page',
                reasoning: 'obvious property name',
            },

            propertyId: {
                context: 'body',
                path: 'ext.customer_id',
                reasoning: 'obvious property name',
            },

            screenHeight: {
                context: 'body',
                path: 'device.screen.h',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'device.screen.w',
                reasoning: 'obvious property name',
            },

            userId: [
                {
                    context: 'body',
                    path: 'ext.user_id.hadronId',
                    notIf: '0',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'ext.user_id.criteoId',
                    notIf: '0',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'ext.user_id.pubcid',
                    notIf: '0',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'ext.user_id.id5id.uid',
                    notIf: '0',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'cookie',
                    path: 'visitor-id',
                    reasoning: 'obvious property name',
                },
            ],

            consentState: {
                context: 'body',
                path: 'ext.gdpr_consent_string',
                reasoning: 'obvious property name',
            },

            userAgent: [
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'https://www.media.net/privacy-policy/#privacy-practices-for-end-users',
                },
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'https://www.media.net/privacy-policy/#privacy-practices-for-end-users',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning: 'https://www.media.net/privacy-policy/#privacy-practices-for-end-users',
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
        }),
    },
];
