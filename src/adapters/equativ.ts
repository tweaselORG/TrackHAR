import type { Adapter, Tracker } from '../index';

const tracker: Tracker = {
    slug: 'equativ',
    // See: https://equativ.com/blog/press-release/smart-adserver-rebrands-as-equativ/
    name: 'Equativ (formerly Smart AdServer)',
    datenanfragenSlug: 'smartadserver',
    exodusId: 7,
};

export const adapters: Adapter[] = [
    {
        slug: 'smartadserver-prebid-v1',
        name: 'Smart AdServer Prebid v1',
        tracker,

        endpointUrls: ['https://prg.smartadserver.com/prebid/v1'],

        decodingSteps: [
            { function: 'parseJson', input: 'body', output: 'res.body' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            propertyId: {
                context: 'body',
                path: 'siteid',
                reasoning: 'https://help.smartadserver.com/s/article/Ad-API-GET-method-legacy#general-parameters',
            },

            viewedPage: {
                context: 'body',
                path: 'pageid',
                reasoning: 'https://help.smartadserver.com/s/article/Ad-API-GET-method-legacy#general-parameters',
            },

            userId: [
                {
                    context: 'body',
                    path: 'ckid',
                    notIf: '0',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API-GET-method-legacy#general-parameters',
                },
                {
                    context: 'body',
                    path: 'eids.*.uids.*.id',
                    notIf: '0',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API-GET-method-legacy#general-parameters',
                },
                {
                    context: 'cookie',
                    path: 'pid',
                    reasoning: 'https://equativ.com/end-users-privacy-policy/',
                },
                {
                    context: 'cookie',
                    path: 'csync',
                    reasoning: 'https://equativ.com/end-users-privacy-policy/',
                },
            ],

            websiteUrl: {
                context: 'body',
                path: 'pageDomain',
                reasoning: 'obvious property name',
            },

            consentState: [
                {
                    context: 'body',
                    path: 'gdpr_consent',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API-GET-method-legacy#general-parameters',
                },
                {
                    context: 'body',
                    path: 'gpp',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API-GET-method-legacy#general-parameters',
                },
            ],

            userAgent: [
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API#headers',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API#headers',
                },
            ],

            referer: {
                context: 'header',
                path: 'Referer',
                reasoning: 'obvious property name',
            },

            browserId: {
                context: 'cookie',
                path: 'pbw',
                reasoning: 'https://equativ.com/end-users-privacy-policy/',
            },
        },
    },

    {
        slug: 'smartadserver-rtb-csync-redir',
        name: 'Smart AdServer RTB Cookie Sync redirect',
        tracker,

        endpointUrls: ['https://rtb-csync.smartadserver.com/redir/'],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            userId: [
                {
                    context: 'query',
                    path: 'partneruserid',
                    notIf: /^GOOGLE_HOSTED_PI|OB_OK|1|0|TAM_OK|OPTOUT$/,
                    reasoning: 'obvious property name',
                },
                {
                    context: 'cookie',
                    path: 'pid',
                    reasoning: 'https://equativ.com/end-users-privacy-policy/',
                },
                {
                    context: 'cookie',
                    path: 'csync',
                    reasoning: 'https://equativ.com/end-users-privacy-policy/',
                },
            ],

            consentState: [
                {
                    context: 'query',
                    path: 'gdpr_consent',
                    notIf: '[GDPR_CONSENT]',
                    reasoning: 'obvious observed values',
                },
                // https://support.google.com/admanager/answer/9681920?hl=en
                {
                    context: 'query',
                    path: 'addtl_consent',
                    reasoning: 'obvious observed values',
                },
            ],

            userAgent: [
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API#headers',
                },
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API#headers',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API#headers',
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

            browserId: {
                context: 'cookie',
                path: 'pbw',
                reasoning: 'https://equativ.com/end-users-privacy-policy/',
            },

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
        slug: 'smartadserver-ssbsync-api-sync',
        name: 'Smart AdServer (ssbsync/api/sync)',
        tracker,

        endpointUrls: [
            'https://ssbsync.smartadserver.com/api/sync',
            'https://ssbsync-global.smartadserver.com/api/sync',
        ],

        decodingSteps: [
            { function: 'parseQueryString', input: 'query', output: 'res.query' },
            { function: 'getProperty', input: 'header', output: 'res.header', options: { path: '$' } },
            { function: 'getProperty', input: 'cookie', output: 'res.cookie', options: { path: '$' } },
        ],
        containedDataPaths: {
            userId: [
                {
                    context: 'query',
                    path: 'publisher_user_id',
                    reasoning: 'obvious property name',
                },
                {
                    context: 'cookie',
                    path: 'pid',
                    reasoning: 'https://equativ.com/end-users-privacy-policy/',
                },
                {
                    context: 'cookie',
                    path: 'csync',
                    reasoning: 'https://equativ.com/end-users-privacy-policy/',
                },
            ],

            consentState: {
                context: 'query',
                path: 'gdpr_consent',
                notIf: /^{GDPRCS}}|{consent_string}|\[USER_CONSENT]|\${GDPR_CONSENT}$/,
                reasoning: 'obvious observed values',
            },

            userAgent: [
                {
                    context: 'header',
                    path: 'User-Agent',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API#headers',
                },
                {
                    context: 'header',
                    path: 'user-agent',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API#headers',
                },
                {
                    context: 'header',
                    path: 'sec-ch-ua',
                    reasoning: 'https://help.smartadserver.com/s/article/Ad-API#headers',
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

            browserId: {
                context: 'cookie',
                path: 'pbw',
                reasoning: 'https://equativ.com/end-users-privacy-policy/',
            },
        },
    },
];
