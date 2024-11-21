import type { Adapter } from '../../index';

export const prebidServerSetuidDataPaths: Adapter['containedDataPaths'] = {
    propertyId: {
        context: 'query',
        path: 'bidder',
        reasoning: 'https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-setuid.html#query-params',
    },

    userId: {
        context: 'query',
        path: 'uid',
        notIf: 'OPTOUT',
        reasoning: 'https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-setuid.html#query-params',
    },

    consentState: {
        context: 'query',
        path: 'gdpr_consent',
        reasoning: 'https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-setuid.html#query-params',
    },
};
