import type { Adapter } from '../../index';

const openrtbSpecUrl = (fragment: string) =>
    `https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/f26fdab655ebd7302dffde9fb635ac54c69ff960/2.6.md#${fragment}` as const;

// These are just the fields directly from the OpenRTB spec (https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/f26fdab655ebd7302dffde9fb635ac54c69ff960/2.6.md).
export const openrtbDataPaths: Adapter['containedDataPaths'] = {
    userAgent: [
        {
            context: 'body',
            path: 'device.sua.browsers',
            reasoning: openrtbSpecUrl('3218---object-device-'),
        },
        {
            context: 'body',
            path: 'device.ua',
            reasoning: openrtbSpecUrl('3218---object-device-'),
        },
    ],

    referer: [
        {
            context: 'body',
            path: 'site.ref',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
    ],

    viewedPage: [
        {
            context: 'body',
            path: 'site.page',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
        {
            context: 'body',
            path: 'site.content.title',
            reasoning: openrtbSpecUrl('3216---object-content-'),
        },
        {
            context: 'body',
            path: 'site.content.url',
            reasoning: openrtbSpecUrl('3216---object-content-'),
        },
    ],

    viewedPageCategory: [
        {
            context: 'body',
            path: 'site.cat',
            notIf: '[]',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
        {
            context: 'body',
            path: 'site.sectioncat',
            notIf: '[]',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
        {
            context: 'body',
            path: 'site.content.genre',
            reasoning: openrtbSpecUrl('3216---object-content-'),
        },
    ],

    viewedPageKeywords: {
        context: 'body',
        path: 'site.keywords',
        reasoning: openrtbSpecUrl('3213---object-site-'),
    },

    propertyId: [
        {
            context: 'body',
            path: 'app.publisher.id',
            reasoning: openrtbSpecUrl('3215---object-publisher-'),
        },
        {
            context: 'body',
            path: 'site.publisher.id',
            reasoning: openrtbSpecUrl('3215---object-publisher-'),
        },
    ],

    websiteName: [
        {
            context: 'body',
            path: 'site.name',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
        {
            context: 'body',
            path: 'site.domain',
            reasoning: openrtbSpecUrl('3213---object-site-'),
        },
    ],

    websiteUrl: {
        context: 'body',
        path: 'site.publisher.domain',
        reasoning: openrtbSpecUrl('3215---object-publisher-'),
    },

    language: {
        context: 'body',
        path: 'device.language',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    viewedPageLanguage: {
        context: 'body',
        path: 'site.content.language',
        reasoning: openrtbSpecUrl('3216---object-content-'),
    },

    screenHeight: {
        context: 'body',
        path: 'device.h',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    screenWidth: {
        context: 'body',
        path: 'device.w',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    consentState: [
        // TCF consent string
        {
            context: 'body',
            path: 'user.consent',
            reasoning: openrtbSpecUrl('3220---object-user-'),
        },

        // GPP consent string
        {
            context: 'body',
            path: 'regs.gpp',
            reasoning: openrtbSpecUrl('323---object-regs-'),
        },
    ],

    userId: [
        {
            context: 'body',
            path: 'eids.*.uids.*.id',
            notIf: '0',
            reasoning: openrtbSpecUrl('3228---object-uid-'),
        },
        {
            context: 'body',
            path: 'user.eids.*.uids.*.id',
            notIf: '0',
            reasoning: openrtbSpecUrl('3228---object-uid-'),
        },
    ],

    isMobileDevice: {
        context: 'body',
        path: 'device.sua.mobile',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    isDntEnabled: {
        context: 'body',
        path: 'device.dnt',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    isJsEnabled: {
        context: 'body',
        path: 'device.js',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    country: {
        context: 'body',
        path: 'device.geo.country',
        reasoning: openrtbSpecUrl('3219---object-geo-'),
    },

    latitude: {
        context: 'body',
        path: 'device.geo.lat',
        reasoning: openrtbSpecUrl('3219---object-geo-'),
    },

    longitude: {
        context: 'body',
        path: 'device.geo.lon',
        reasoning: openrtbSpecUrl('3219---object-geo-'),
    },

    userGender: {
        context: 'body',
        path: 'user.gender',
        reasoning: openrtbSpecUrl('3220---object-user-'),
    },

    appName: {
        context: 'body',
        path: 'app.name',
        reasoning: openrtbSpecUrl('3214---object-app-'),
    },

    appId: [
        {
            context: 'body',
            path: 'app.bundle',
            reasoning: openrtbSpecUrl('3214---object-app-'),
        },
        {
            context: 'body',
            path: 'app.storeurl',
            reasoning: openrtbSpecUrl('3214---object-app-'),
        },
    ],

    appVersion: {
        context: 'body',
        path: 'app.ver',
        reasoning: openrtbSpecUrl('3214---object-app-'),
    },

    manufacturer: {
        context: 'body',
        path: 'device.make',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    model: {
        context: 'body',
        path: 'device.model',
        reasoning: openrtbSpecUrl('3218---object-model-'),
    },

    osName: {
        context: 'body',
        path: 'device.os',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    osVersion: {
        context: 'body',
        path: 'device.osv',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    carrier: [
        {
            context: 'body',
            path: 'device.carrier',
            reasoning: openrtbSpecUrl('3218---object-device-'),
        },
        {
            context: 'body',
            path: 'device.mccmnc',
            reasoning: openrtbSpecUrl('3218---object-device-'),
        },
    ],

    advertisingId: {
        context: 'body',
        path: 'device.ifa',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    networkConnectionType: {
        context: 'body',
        path: 'device.connectiontype',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },

    userInterests: {
        context: 'body',
        path: 'user.keywords',
        reasoning: openrtbSpecUrl('3220---object-user-'),
    },

    publicIp: {
        context: 'body',
        path: 'device.ip',
        reasoning: openrtbSpecUrl('3218---object-device-'),
    },
};
