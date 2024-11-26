import type { Adapter } from '../../index';

const openrtbSpecUrl = (fragment: string) =>
    `https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/f26fdab655ebd7302dffde9fb635ac54c69ff960/2.6.md#${fragment}` as const;

// These are just the fields directly from the OpenRTB spec (https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/f26fdab655ebd7302dffde9fb635ac54c69ff960/2.6.md).
export const openrtbDataPaths = (prefix = ''): Adapter['containedDataPaths'] => ({
    userAgent: [
        {
            context: 'body',
            path: prefix + 'device.sua.browsers',
            reasoning: openrtbSpecUrl('3218---object-device-'),
        },
        {
            context: 'body',
            path: prefix + 'device.ua',
            reasoning: openrtbSpecUrl('3218---object-device-'),
        },
    ],

    referer: [
        {
            context: 'body',
            path: prefix + 'site.ref',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
    ],

    viewedPage: [
        {
            context: 'body',
            path: prefix + 'site.page',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
        {
            context: 'body',
            path: prefix + 'site.content.title',
            reasoning: openrtbSpecUrl('3216---object-content-'),
        },
        {
            context: 'body',
            path: prefix + 'site.content.url',
            reasoning: openrtbSpecUrl('3216---object-content-'),
        },
    ],

    viewedPageCategory: [
        {
            context: 'body',
            path: prefix + 'site.cat',
            notIf: '[]',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
        {
            context: 'body',
            path: prefix + 'site.sectioncat',
            notIf: '[]',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
        {
            context: 'body',
            path: prefix + 'site.content.genre',
            reasoning: openrtbSpecUrl('3216---object-content-'),
        },
    ],

    viewedPageKeywords: {
        context: 'body',
        path: prefix + 'site.keywords',
        reasoning: openrtbSpecUrl('3213---object-site-'),
    },

    propertyId: [
        {
            context: 'body',
            path: prefix + 'app.publisher.id',
            reasoning: openrtbSpecUrl('3215---object-publisher-'),
        },
        {
            context: 'body',
            path: prefix + 'site.publisher.id',
            reasoning: openrtbSpecUrl('3215---object-publisher-'),
        },
    ],

    websiteName: [
        {
            context: 'body',
            path: prefix + 'site.name',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
        {
            context: 'body',
            path: prefix + 'site.domain',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
    ],

    websiteUrl: {
        context: 'body',
        path: prefix + 'site.publisher.domain',
        reasoning: openrtbSpecUrl('3215---object-publisher-'),
    },

    language: {
        context: 'body',
        path: prefix + 'device.language',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    viewedPageLanguage: {
        context: 'body',
        path: prefix + 'site.content.language',
        reasoning: openrtbSpecUrl('3216---object-content-'),
    },

    screenHeight: {
        context: 'body',
        path: prefix + 'device.h',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    screenWidth: {
        context: 'body',
        path: prefix + 'device.w',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    consentState: [
        // TCF consent string
        {
            context: 'body',
            path: prefix + 'user.consent',
            reasoning: openrtbSpecUrl('3220---object-user-'),
        },

        // GPP consent string
        {
            context: 'body',
            path: prefix + 'regs.gpp',
            notIf: 'DBAA',
            reasoning: openrtbSpecUrl('323---object-regs-'),
        },
    ],

    userId: [
        {
            context: 'body',
            path: prefix + 'eids.*.uids.*.id',
            notIf: '0',
            reasoning: openrtbSpecUrl('3228---object-uid-'),
        },
        {
            context: 'body',
            path: prefix + 'user.eids.*.uids.*.id',
            notIf: '0',
            reasoning: openrtbSpecUrl('3228---object-uid-'),
        },
    ],

    isMobileDevice: {
        context: 'body',
        path: prefix + 'device.sua.mobile',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    isDntEnabled: {
        context: 'body',
        path: prefix + 'device.dnt',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    isJsEnabled: {
        context: 'body',
        path: prefix + 'device.js',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    country: {
        context: 'body',
        path: prefix + 'device.geo.country',
        reasoning: openrtbSpecUrl('3219---object-geo-'),
    },

    latitude: {
        context: 'body',
        path: prefix + 'device.geo.lat',
        reasoning: openrtbSpecUrl('3219---object-geo-'),
    },

    longitude: {
        context: 'body',
        path: prefix + 'device.geo.lon',
        reasoning: openrtbSpecUrl('3219---object-geo-'),
    },

    userGender: {
        context: 'body',
        path: prefix + 'user.gender',
        reasoning: openrtbSpecUrl('3220---object-user-'),
    },

    appName: {
        context: 'body',
        path: prefix + 'app.name',
        reasoning: openrtbSpecUrl('3214---object-app-'),
    },

    appId: [
        {
            context: 'body',
            path: prefix + 'app.bundle',
            reasoning: openrtbSpecUrl('3214---object-app-'),
        },
        {
            context: 'body',
            path: prefix + 'app.storeurl',
            reasoning: openrtbSpecUrl('3214---object-app-'),
        },
    ],

    appVersion: {
        context: 'body',
        path: prefix + 'app.ver',
        reasoning: openrtbSpecUrl('3214---object-app-'),
    },

    manufacturer: {
        context: 'body',
        path: prefix + 'device.make',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    model: {
        context: 'body',
        path: prefix + 'device.model',
        reasoning: openrtbSpecUrl('3218---object-model-'),
    },

    osName: {
        context: 'body',
        path: prefix + 'device.os',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    osVersion: {
        context: 'body',
        path: prefix + 'device.osv',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    carrier: [
        {
            context: 'body',
            path: prefix + 'device.carrier',
            reasoning: openrtbSpecUrl('3218---object-device-'),
        },
        {
            context: 'body',
            path: prefix + 'device.mccmnc',
            reasoning: openrtbSpecUrl('3218---object-device-'),
        },
    ],

    advertisingId: {
        context: 'body',
        path: prefix + 'device.ifa',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    networkConnectionType: {
        context: 'body',
        path: prefix + 'device.connectiontype',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    userInterests: {
        context: 'body',
        path: prefix + 'user.keywords',
        reasoning: openrtbSpecUrl('3220---object-user-'),
    },

    publicIp: {
        context: 'body',
        path: prefix + 'device.ip',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    timezone: {
        context: 'body',
        path: prefix + 'device.geo.utcoffset',
        reasoning: openrtbSpecUrl('3219---object-geo-'),
    },
});
