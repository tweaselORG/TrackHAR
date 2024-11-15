import type { Adapter } from '../../index';

// These fields may not necessarily be among the Prebid.js defaults but can also come from adapters, as such we may not
// have good references for them.
export const prebidjsOpenRtbDataPaths: Adapter['containedDataPaths'] = {
    userAgent: {
        context: 'body',
        path: 'user.ext.sua.browsers',
        reasoning: 'https://docs.prebid.org/features/firstPartyData.html#user-agent-client-hints',
    },

    websiteUrl: [
        {
            context: 'body',
            path: 'publisher.url',
            reasoning: 'obvious observed values',
        },
    ],

    viewedPage: [
        {
            context: 'body',
            path: 'publisher.ext.page',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'site.ext.page',
            reasoning: 'obvious property name',
        },
    ],

    viewedPageCategory: [
        {
            context: 'body',
            path: 'publisher.ext.cat',
            reasoning: 'obvious observed values',
        },
        {
            context: 'body',
            path: 'publisher.ext.sectioncat',
            reasoning: 'obvious observed values',
        },
        {
            context: 'body',
            path: 'site.ext.cat',
            reasoning: 'obvious observed values',
        },
        {
            context: 'body',
            path: 'site.ext.sectioncat',
            reasoning: 'obvious observed values',
        },
    ],

    viewedPageKeywords: [
        {
            context: 'body',
            path: 'publisher.ext.keywords',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'site.ext.keywords',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            // "content tags"
            path: 'site.ext.data.cnt_tags',
            reasoning: 'obvious property name',
        },
    ],

    propertyId: {
        context: 'body',
        path: 'publisher.networkid',
        reasoning: 'obvious property name',
    },

    websiteName: [
        {
            context: 'body',
            path: 'publisher.ext.name',
            reasoning: 'obvious observed values',
        },
        {
            context: 'body',
            path: 'site.ext.name',
            reasoning: 'obvious observed values',
        },
    ],

    language: {
        context: 'body',
        path: 'user.ext.data.navigatorLanguage',
        reasoning: 'obvious property name',
    },

    browserWindowHeight: [
        {
            context: 'body',
            path: 'user.ext.data.windowInnerHeight',
            notIf: '0',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'viewport.height',
            notIf: '0',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'device.ext.vph',
            notIf: '0',
            reasoning: 'https://docs.prebid.org/features/firstPartyData.html#automatically-collected-first-party-data',
        },
        {
            context: 'body',
            path: 'site.ext.data.adg_rtd.features.viewport_dimensions',
            reasoning: 'obvious property name',
        },
    ],

    browserWindowWidth: [
        {
            context: 'body',
            path: 'user.ext.data.windowInnerWidth',
            notIf: '0',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'viewport.width',
            notIf: '0',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'device.ext.vpw',
            notIf: '0',
            reasoning: 'https://docs.prebid.org/features/firstPartyData.html#automatically-collected-first-party-data',
        },
        {
            context: 'body',
            path: 'site.ext.data.adg_rtd.features.viewport_dimensions',
            reasoning: 'obvious property name',
        },
    ],

    pageHeight: [
        {
            context: 'body',
            path: 'user.ext.data.pageHeight',
            notIf: '0',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'site.ext.data.adg_rtd.features.page_dimensions',
            reasoning: 'obvious property name',
        },
    ],

    pageWidth: [
        {
            context: 'body',
            path: 'user.ext.data.pageWidth',
            notIf: '0',
            reasoning: 'obvious property name',
        },
        {
            context: 'body',
            path: 'site.ext.data.adg_rtd.features.page_dimensions',
            reasoning: 'obvious property name',
        },
    ],

    sessionDuration: {
        context: 'body',
        path: 'user.ext.data.sessionDuration',
        reasoning: 'obvious property name',
    },

    viewedPageLanguage: {
        context: 'body',
        path: 'user.ext.data.contentLanguage',
        reasoning: 'obvious property name',
    },

    orientation: {
        context: 'body',
        path: 'user.ext.data.orientation',
        reasoning: 'obvious property name',
    },

    screenHeight: {
        context: 'body',
        path: 'user.ext.device.h',
        reasoning: 'obvious property name',
    },

    screenWidth: {
        context: 'body',
        path: 'user.ext.device.w',
        reasoning: 'obvious property name',
    },

    consentState: [
        // TCF consent string
        {
            context: 'body',
            path: 'user.ext.consent',
            reasoning: 'https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#gdpr',
        },
        {
            context: 'body',
            path: 'gdprConsent.consentData',
            reasoning: 'https://docs.prebid.org/dev-docs/modules/consentManagementTcf.html#page-integration',
        },
    ],

    userId: {
        context: 'body',
        path: 'user.ext.eids.*.uids.*.id',
        notIf: '0',
        reasoning: 'obvious observed values',
    },

    isMobileDevice: {
        context: 'body',
        path: 'user.ext.sua.mobile',
        reasoning: 'obvious property name',
    },

    scrollPositionX: {
        context: 'body',
        path: 'viewport.scrollTop',
        reasoning: 'obvious property name',
    },

    scrollPositionY: {
        context: 'body',
        path: 'viewport.scrollLeft',
        reasoning: 'obvious property name',
    },

    isAutomated: {
        context: 'body',
        path: 'device.ext.webdriver',
        reasoning: 'https://docs.prebid.org/features/firstPartyData.html#automatically-collected-first-party-data',
    },

    sessionId: {
        context: 'body',
        path: 'site.ext.data.adg_rtd.session.id',
        reasoning:
            'https://github.com/prebid/Prebid.js/blob/bb586b85fb59424d366808d1dad82b2602ee0fc8/modules/adagioRtdProvider.js#L99',
    },

    lastActivityTime: {
        context: 'body',
        path: 'site.ext.data.adg_rtd.session.lastActivityTime',
        reasoning: 'obvious property name',
    },
};
