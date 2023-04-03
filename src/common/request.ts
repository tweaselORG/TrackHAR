import type { Har } from 'har-format';

export type Request = {
    startTime: Date;
    method: string;
    host: string;
    path: string;
    /** The endpoint URL is the URL without the query string. This is useful for matching in the adapters. */
    endpointUrl: string;
    content?: string;
    port: string;
    scheme: 'http' | 'https';
    httpVersion: string;
    headers?: { name: string; value: string }[];
    cookies?: { name: string; value: string }[];
};

export const unhar = (har: Har): Request[] =>
    har.log.entries.map((e) => {
        const url = new URL(e.request.url);
        const endpointUrl = `${url.protocol}//${url.host}${url.pathname}`;

        return {
            startTime: new Date(e.startedDateTime),
            method: e.request.method,
            host: url.hostname,
            path: url.pathname,
            endpointUrl,
            content: e.request.postData?.text,
            port: url.port,
            scheme: url.protocol.replace(':', '') as 'http' | 'https',
            httpVersion: e.request.httpVersion,
            headers: e.request.headers,
            cookies: e.request.cookies,
        };
    });
