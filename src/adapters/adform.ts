import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'adform',
    name: 'Adform A/S',
    datenanfragenSlug: 'adform',
    exodusId: 157,
};

const adformCommonHeaderAndCookiePaths: Adapter['containedDataPaths'] = {
    userAgent: [
        {
            context: 'header',
            path: 'user-agent',
            reasoning:
                'https://site.adform.com/privacy-center/platform-privacy/product-and-services-privacy-policy/#WhatInformationDoWeCollectandUse',
        },
        {
            context: 'header',
            path: 'User-Agent',
            reasoning:
                'https://site.adform.com/privacy-center/platform-privacy/product-and-services-privacy-policy/#WhatInformationDoWeCollectandUse',
        },
        {
            context: 'header',
            path: 'sec-ch-ua',
            reasoning:
                'https://site.adform.com/privacy-center/platform-privacy/product-and-services-privacy-policy/#WhatInformationDoWeCollectandUse',
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
        path: 'uid',
        reasoning: 'https://site.adform.com/privacy-center/adform-cookies/',
    },
};

export const adapters: Adapter[] = [
    {
        slug: 'adx-openrtb',
        name: 'Adform OpenRTB integration',
        tracker,

        endpointUrls: ['https://adx.adform.net/adx/openrtb', 'https://adx2.adform.net/adx/openrtb'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            openrtbDataPaths,
            prebidjsOpenRtbDataPaths,
            adformCommonHeaderAndCookiePaths,
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
        slug: 'cookie-match',
        name: 'Adform cookie match',
        tracker,

        endpointUrls: [
            'https://c1.adform.net/serving/cookie/match',
            'https://track.adform.net/serving/cookie/match',
            'https://dmp.adform.net/serving/cookie/match',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(adformCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gpp',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'cm-cookie',
        name: 'Adform (cm/cookie)',
        tracker,

        endpointUrls: ['https://cm.adform.net/cookie'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(adformCommonHeaderAndCookiePaths, {
            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious observed values',
            },
        }),
    },

    {
        slug: 'serving-trackpoint',
        // See: https://www.adformhelp.com/hc/en-us/articles/9740584592273-Unique-Naming-Javascript and https://www.simoahava.com/custom-templates/adform-tracking-point/
        name: 'Adform Tracking Point',
        tracker,

        endpointUrls: ['https://track.adform.net/Serving/TrackPoint'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(adformCommonHeaderAndCookiePaths, {
            propertyId: {
                context: 'query',
                path: 'pm',
                reasoning: 'https://www.adformhelp.com/hc/en-us/articles/9740584592273-Unique-Naming-Javascript',
            },

            viewedPage: [
                {
                    context: 'query',
                    path: 'ADFPageName',
                    reasoning: 'https://www.adformhelp.com/hc/en-us/articles/9740584592273-Unique-Naming-Javascript',
                },
                {
                    context: 'query',
                    path: 'loc',
                    reasoning: 'obvious observed values',
                },
            ],

            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning: 'obvious observed values',
            },

            browserId: {
                context: 'query',
                path: '$[?(@property.match(/^eid_.*_1$/i))]',
                notIf: '0',
                reasoning:
                    'https://www.adformhelp.com/hc/en-us/articles/9740584592273-Unique-Naming-Javascript#UUID-803b0388-0c41-dfbd-6cdb-a646d650b2a2_bridgehead-idm4544500177347233314505181547',
            },

            deviceId: {
                context: 'query',
                path: '$[?(@property.match(/^eid_.*_2$/i))]',
                reasoning:
                    'https://www.adformhelp.com/hc/en-us/articles/9740584592273-Unique-Naming-Javascript#UUID-803b0388-0c41-dfbd-6cdb-a646d650b2a2_bridgehead-idm4544500177347233314505181547',
            },

            userId: {
                context: 'query',
                path: '$[?(@property.match(/^eid_.*_3$/i))]',
                reasoning:
                    'https://www.adformhelp.com/hc/en-us/articles/9740584592273-Unique-Naming-Javascript#UUID-803b0388-0c41-dfbd-6cdb-a646d650b2a2_bridgehead-idm4544500177347233314505181547',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },
        }),
    },
];
