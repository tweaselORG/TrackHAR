import { mergeContainedDataPaths } from '../common/adapter-util';
import type { Adapter, Tracker } from '../index';
import { openrtbDataPaths } from './common/openrtb';
import { prebidServerSetuidDataPaths } from './common/prebid-server';
import { prebidjsOpenRtbDataPaths } from './common/prebidjs';

const tracker: Tracker = {
    slug: 'microsoft',
    name: 'Microsoft Ireland Operations Ltd.',
    datenanfragenSlug: 'microsoft',
    exodusId: 243,
};

export const adapters: Adapter[] = [
    {
        slug: 'appcenter-logs',
        // See: https://learn.microsoft.com/en-us/appcenter/
        name: 'Visual Studio App Center',
        description: 'microsoft-appcenter',
        tracker,

        endpointUrls: ['https://in.appcenter.ms/logs'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            {
                function: 'getProperty',
                input: 'header',
                output: 'res.header.Install-ID',
                options: { path: 'Install-ID' },
            },
        ],
        containedDataPaths: {
            appId: {
                context: 'body',
                path: 'logs.*.device.appNamespace',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            appVersion: [
                {
                    context: 'body',
                    path: 'logs.*.device.appVersion',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
                {
                    context: 'body',
                    path: 'logs.*.device.appBuild',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
            ],

            trackerSdkVersion: {
                context: 'body',
                path: 'logs.*.device.sdkVersion',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            installationId: {
                context: 'header',
                path: 'Install-ID',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            sessionId: {
                context: 'body',
                path: 'logs.*.sid',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            userId: [
                {
                    context: 'body',
                    path: 'logs.*.userId',
                    notIf: '-1',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
            ],

            manufacturer: {
                context: 'body',
                path: 'logs.*.device.oemName',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            model: {
                context: 'body',
                path: 'logs.*.device.model',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            osName: {
                context: 'body',
                path: 'logs.*.device.osName',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            osVersion: [
                {
                    context: 'body',
                    path: 'logs.*.device.osVersion',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
                {
                    context: 'body',
                    path: 'logs.*.device.osBuild',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
                {
                    context: 'body',
                    path: 'logs.*.device.osApiLevel',
                    reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
                },
            ],

            language: {
                context: 'body',
                path: 'logs.*.device.locale',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            timezone: {
                context: 'body',
                path: 'logs.*.device.timeZoneOffset',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            screenWidth: {
                context: 'body',
                path: 'logs.*.device.screenSize',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            screenHeight: {
                context: 'body',
                path: 'logs.*.device.screenSize',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },

            carrier: {
                context: 'body',
                path: 'logs.*.device.carrierName',
                reasoning: 'https://learn.microsoft.com/en-us/appcenter/sdk/data-collected',
            },
        },
    },

    {
        slug: 'adnxs-ib-ut-v3-prebid',
        // See: https://learn.microsoft.com/en-us/xandr/monetize/integrate-web-mobile-web-with-psp#implementation
        name: 'Microsoft Monetize (AppNexus) Prebid integration (send top bid)',
        tracker,

        endpointUrls: ['https://ib.adnxs.com/ut/v3/prebid'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            userId: [
                {
                    context: 'body',
                    path: 'user.external_uid',
                    reasoning: 'https://docs.prebid.org/dev-docs/bidders/appnexus.html#user-object',
                },
                {
                    context: 'body',
                    path: 'eids.*.id',
                    notIf: '0',
                    reasoning:
                        'https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/f26fdab655ebd7302dffde9fb635ac54c69ff960/2.6.md#3228---object-uid-',
                },
            ],

            trackerSdkVersion: {
                context: 'body',
                path: 'sdk.version',
                reasoning: 'obvious property name',
            },

            referer: [
                {
                    context: 'body',
                    path: 'referrer_detection.rd_ref',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'body',
                    path: 'referrer_detection.rd_stk',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'body',
                    path: 'referrer_detection.rd_can',
                    reasoning: 'obvious observed values',
                },
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

            consentState: [
                {
                    context: 'body',
                    path: 'gdpr_consent.consent_string',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'gdpr_consent.addtl_consent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'body',
                    path: 'privacy.gpp',
                    reasoning: 'obvious property name',
                },
            ],

            viewedPageKeywords: {
                context: 'body',
                path: 'keywords.*.key',
                reasoning: 'obvious property name',
            },

            userAgent: [
                {
                    context: 'body',
                    path: 'device.useragent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
            ],

            screenHeight: {
                context: 'body',
                path: 'device.h',
                reasoning: 'obvious property name',
            },

            screenWidth: {
                context: 'body',
                path: 'device.w',
                reasoning: 'obvious property name',
            },

            deviceId: [
                {
                    context: 'cookie',
                    path: 'uuid2',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
                {
                    context: 'cookie',
                    path: 'uids',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
                {
                    context: 'cookie',
                    path: 'XANDR_PANID',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
            ],

            appId: [
                {
                    context: 'header',
                    path: 'X-Requested-With',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'header',
                    path: 'x-requested-with',
                    reasoning: 'obvious observed values',
                },
            ],
        },
    },

    {
        slug: 'adnxs-ib-openrtb2-prebid',
        // See: https://learn.microsoft.com/en-us/xandr/monetize/integrate-web-mobile-web-with-psp#implementation-1
        name: 'Microsoft Monetize (AppNexus) Prebid integration (send all bids)',
        tracker,

        endpointUrls: ['https://ib.adnxs.com/openrtb2/prebid'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(
            // Vendor-specific spec: https://learn.microsoft.com/en-us/xandr/supply-partners/integration-with-openrtb-2-6
            openrtbDataPaths(),
            prebidjsOpenRtbDataPaths(),
            {
                userAgent: [
                    {
                        context: 'header',
                        path: 'User-Agent',
                        reasoning:
                            'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                    },
                    {
                        context: 'header',
                        path: 'user-agent',
                        reasoning:
                            'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                    },
                ],
            }
        ),
    },

    {
        slug: 'adnxs-ib-getuid',
        // See:
        // https://learn.microsoft.com/en-us/xandr/bidders/synchronize-your-user-ids#bidderdata-provider-stored-mapping
        // and https://learn.microsoft.com/en-us/xandr/bidders/user-data---faq#how-can-i-sync-user-ids-with-xandr
        name: 'Xandr cookie matching pixel (mapping stored by bidder/data provider)',
        tracker,

        endpointUrls: [
            'https://ib.adnxs.com/getuid',
            'https://secure.adnxs.com/getuid',
            'https://secure.adnxs.com/getuidnb',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            userAgent: [
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
            ],

            referer: [
                {
                    context: 'query',
                    path: 'referrer',
                    reasoning: 'obvious property name',
                },
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

            appId: [
                {
                    context: 'header',
                    path: 'X-Requested-With',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'header',
                    path: 'x-requested-with',
                    reasoning: 'obvious observed values',
                },
            ],

            deviceId: [
                {
                    context: 'cookie',
                    path: 'uuid2',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
                {
                    context: 'cookie',
                    path: 'uids',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
                {
                    context: 'cookie',
                    path: 'XANDR_PANID',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
            ],

            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                reasoning:
                    'https://learn.microsoft.com/en-us/xandr/bidders/synchronize-your-user-ids#bidderdata-provider-stored-mapping',
            },
        },
    },

    {
        slug: 'adnxs-ib-setuid',
        // See:
        // https://learn.microsoft.com/en-us/xandr/bidders/synchronize-your-user-ids#storing-the-mapping-with-xandr
        // This implements https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-setuid.html plus
        // Microsoft-specific extensions.
        name: 'Xandr cookie matching pixel (mapping stored by Xandr)',
        tracker,

        endpointUrls: ['https://ib.adnxs.com/setuid', 'https://ib.adnxs.com/prebid/setuid'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: mergeContainedDataPaths(prebidServerSetuidDataPaths, {
            userAgent: [
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning:
                        'https://about.ads.microsoft.com/en/resources/policies/platform-privacy-policy#infoxandr',
                },
            ],

            referer: [
                {
                    context: 'query',
                    path: 'referrer',
                    reasoning: 'obvious property name',
                },
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

            appId: [
                {
                    context: 'header',
                    path: 'X-Requested-With',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'header',
                    path: 'x-requested-with',
                    reasoning: 'obvious observed values',
                },
            ],

            deviceId: [
                {
                    context: 'cookie',
                    path: 'uuid2',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
                {
                    context: 'cookie',
                    path: 'uids',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
                {
                    context: 'cookie',
                    path: 'XANDR_PANID',
                    reasoning: 'https://about.ads.microsoft.com/en/resources/policies/digital-platform-cookie-policy',
                },
            ],

            propertyId: {
                context: 'query',
                path: 'entity',
                reasoning:
                    'https://learn.microsoft.com/en-us/xandr/bidders/synchronize-your-user-ids#storing-the-mapping-with-xandr',
            },

            userId: {
                context: 'query',
                path: 'code',
                reasoning:
                    'https://learn.microsoft.com/en-us/xandr/bidders/synchronize-your-user-ids#storing-the-mapping-with-xandr',
            },
        }),
    },

    {
        slug: 'bing-bat-action-0',
        // See:
        // https://answers.microsoft.com/en-us/msadvs/forum/all/does-batbing-track-your-browser-searches-and-sites/0a402f00-60c2-4d54-bd7d-81b67ccc7f13
        // and https://bingadsuet.azurewebsites.net/GoogleTagManager.html
        name: 'Bing Ads conversion tracking (Universal Event Tracking — UET)',
        tracker,

        endpointUrls: ['https://bat.bing.com/action/0', 'https://bat.bing.com/actionp/0'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],

        containedDataPaths: {
            language: {
                context: 'query',
                path: 'lg',
                reasoning: 'obvious observed values',
            },

            screenWidth: {
                context: 'query',
                path: 'sw',
                reasoning: 'obvious observed values',
            },

            screenHeight: {
                context: 'query',
                path: 'sh',
                reasoning: 'obvious observed values',
            },

            viewedPage: [
                {
                    context: 'query',
                    path: 'tl',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'p',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'page_path',
                    reasoning: 'obvious property name',
                },
            ],

            viewedPageKeywords: {
                context: 'query',
                path: 'kw',
                reasoning: 'obvious observed values',
            },

            currency: {
                context: 'query',
                path: 'gc',
                reasoning: 'obvious observed values',
            },

            userId: {
                context: 'cookie',
                path: 'MUID',
                reasoning: 'https://learn.microsoft.com/en-us/clarity/setup-and-installation/glossary-of-terms#muid',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            userAgent: [
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning: 'obvious property name',
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
        },
    },

    {
        slug: 'bing-bat-js',
        // See: https://bingadsuet.azurewebsites.net/GoogleTagManager.html
        name: 'Bing Ads Universal Event Tracking (UET) bat.js script',
        tracker,

        endpointUrls: ['https://bat.bing.com/bat.js'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],

        containedDataPaths: {
            userAgent: [
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning: 'obvious property name',
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
        },
    },

    {
        slug: 'bing-c-gif',
        name: 'Bing Ads pixel (c.gif)',
        tracker,

        endpointUrls: ['https://c.bing.com/c.gif'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],

        containedDataPaths: {
            viewedPage: [
                {
                    context: 'query',
                    path: '$["pg.n"]',
                    reasoning: 'obvious observed values',
                },
                {
                    context: 'query',
                    path: 'tp',
                    reasoning: 'obvious observed values',
                },
            ],

            userId: {
                context: 'cookie',
                path: 'MUID',
                reasoning: 'https://learn.microsoft.com/en-us/clarity/setup-and-installation/glossary-of-terms#muid',
            },

            appId: {
                context: 'header',
                path: 'x-requested-with',
                reasoning: 'obvious observed values',
            },

            userAgent: [
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning: 'obvious property name',
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
        },
    },
];
