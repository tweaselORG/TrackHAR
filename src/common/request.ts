import type { Har } from 'har-format';

/** Our internal representation of an HTTP request. */
export type Request = {
    /** The time when the request was sent. */
    startTime: Date;
    /** The HTTP method used. */
    method: string;
    /** The host name of the request. */
    host: string;
    /** The full path of the request, including the query string. */
    path: string;
    /** The full URL, but without the query string. This is useful for matching in the adapters. */
    endpointUrl: string;
    /** The request body, if any. */
    content?: string;
    /** The port of the request. */
    port: string;
    /** The scheme of the request. */
    scheme: 'http' | 'https';
    /** The HTTP version of the request. */
    httpVersion: string;
    /** The headers included in the request. */
    headers?: { name: string; value: string }[];
    /** The cookies set through request. */
    cookies?: { name: string; value: string }[];
};

/**
 * Parse a traffic dump in HAR format into our internal request representation.
 *
 * @param har The HAR traffic dump.
 */
export const unhar = (har: Har): Request[] =>
    har.log.entries.map((e) => {
        const url = new URL(e.request.url);
        const endpointUrl = `${url.protocol}//${url.host}${url.pathname}`;

        return {
            startTime: new Date(e.startedDateTime),
            method: e.request.method,
            host: url.hostname,
            path: url.pathname + url.search,
            endpointUrl,
            content: e.request.postData?.text,
            port: url.port,
            scheme: url.protocol.replace(':', '') as 'http' | 'https',
            httpVersion: e.request.httpVersion,
            headers: e.request.headers,
            cookies: e.request.cookies,
        };
    });
