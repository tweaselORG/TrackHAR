import { fetch } from 'cross-fetch';
import pRetry, { AbortError } from 'p-retry';

/**
 * Typescript implementation of the Save Page Now 2 API of the Internet Archive's Wayback Machine.
 *
 * @see https://archive.org/details/spn-2-public-api-page-docs-2023-01-22
 */

/**
 * The authentication credentials for the Archive.org S3 API. You can get those by creating an archive.org account and
 * going to https://archive.org/account/s3.php. ´
 */
export type ArchiveOrgAuth = {
    s3AccessKey: string;
    s3SecretKey: string;
};

/**
 * The options to provide to the Save Page Now 2 API. Descriptions are taken from
 * https://archive.org/details/spn-2-public-api-page-docs-2023-01-22/page/2/mode/2up.
 */
export type CaptureRequestOptions = Partial<{
    /** Capture a web page with errors (HTTP status=4xx or 5xx). By default SPN2 captures only status=200 URLs. */
    captureAll: boolean;
    /** Capture web page outlinks automatically. This also applies to PDF, JSON, RSS and MRSS feeds. */
    captureOutlinks: boolean;
    /** Capture full page screenshot in PNG format. This is also stored in the Wayback Machine as a different capture. */
    captureScreenshot: boolean;
    /**
     * The capture becomes available in the Wayback Machine after ~12 hours instead of immediately. This option helps
     * reduce the load on our systems. All API responses remain exactly the same when using this option.
     */
    delayWaybackAvailability: boolean;
    /**
     * Force the use of a simple HTTP GET request to capture the target URL. By default SPN2 does a HTTP HEAD on the
     * target URL to decide whether to use a headless browser or a simple HTTP GET request. forceGet overrides this
     * behavior.
     */
    forceGet: boolean;
    /** Skip checking if a capture is a first if you don’t need this information. This will make captures run faster. */
    skipFirstArchive: boolean;
    /**
     * Capture web page only if the latest existing capture at the Archive is older than the limit in seconds. If there
     * is a capture within the defined time period, SPN2 returns that as a recent capture.
     *
     * When providing an array with two entries, the first one applies to the main capture and the second one applies to
     * outlinks.
     *
     * @defaultValue 30 minutes
     */
    ifNotArchivedWithin: number | [number, number];
    /** Return the timestamp of the last capture for all outlinks. */
    outlinksAvailability: boolean;
    /** Send an email report of the captured URLs to the user’s email. */
    emailResult: boolean;
    /**
     * Number of seconds (max. 30) to run JS code after page load to trigger target page functionality like image
     * loading on mouse over, scroll down to load more content, etc. More details on the JS code we execute:
     * https://github.com/internetarchive/brozzler/blob/master/brozzler/behaviors.yaml.
     *
     * NOTE: If the target page doesn’t have any JS you need to run, you can use set this to 0 to speed up the capture.
     *
     * @defaultValue 5 seconds
     */
    jsBehaviorTimeout: number;
    /** Use extra HTTP Cookie value when capturing the target page. */
    captureCookies: string;
    /** Use custom HTTP User-Agent value when capturing the target page. */
    useUserAgent: string;
    /** Use your own username and password in the target page’s login forms. */
    targetUserName: string;
    targetPassword: string;
}>;

/** The result of a capture request to the SPN2 API of The Internet Archive. */
export type CaptureResult = {
    /** The URL the request was made for. */
    url: string;
    /** The ID of the capture job. */
    job_id: string;
    /** An optional message from the API, e.g. telling you your capture will be delayed for some reason. */
    message?: string;
};

/**
 * Send a capture request to the SPN2 API of The Internet Archive.
 *
 * @param url The URL to capture.
 * @param auth The authentication credentials for the Archive.org S3 API.
 * @param options The options to provide to the Save Page Now 2 API.
 *
 * @returns The verbatim result of the API request.
 */
export const capture = async (
    url: string,
    auth: ArchiveOrgAuth,
    options?: CaptureRequestOptions
): Promise<CaptureResult> => {
    if (!auth?.s3SecretKey)
        throw new Error(
            'Missing authentication credentials for the Archive.org S3 API. You can get those by creating an archive.org account and going to https://archive.org/account/s3.php.'
        );

    const body = new URLSearchParams();
    Object.entries(options || {}).forEach((option) => {
        if (option[0] === 'ifNotArchivedWithin')
            body.append(
                camelToSnakeCase(option[0]),
                Array.isArray(option[1]) ? option[1].join(',') : (option[1] as number).toFixed(0)
            );
        else
            body.append(
                camelToSnakeCase(option[0]),
                typeof option[1] === 'boolean'
                    ? option[1]
                        ? '1'
                        : '0'
                    : typeof option[1] === 'number'
                    ? option[1].toFixed(0)
                    : (option[1] as string)
            );
    });

    body.append('url', url);

    return await fetch('https://web.archive.org/save', {
        method: 'POST',
        body: body,
        headers: {
            Authorization: `LOW ${auth.s3AccessKey}:${auth.s3SecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
    }).then((res) => res.json());
};

/** The result of a status request to the SPN2 API of The Internet Archive. */
export type CaptureStatus =
    | {
          /** Status emitted if the capture was successful. */
          status: 'success';
          /** Job ID the status was requested for. */
          job_id: string;
          /**
           * The original URL that was captured (after redirects). This is the URL to use to get the URL of the capture
           * together with the timestamp: `https://web.archive.org/web/<timestamp>/<original_url>`
           */
          original_url: string;
          /**
           * If the capture was started with the `capture_screenshot` flag set and the screenshot capture was
           * successful, a URL to the screenshot is provided here.
           */
          screenshot?: string;
          /** UNIX timestamp of the time of the capture, need for the capture URL. */
          timestamp: string;
          /** Duration of the capture in seconds. */
          duration_sec: number;
          /** List of URLs that were captured as part of the capture. */
          resources: string[];
          /**
           * Contains the job IDs of the capture jobs for the outlinks (if the `outlinks` flag was set), or if the
           * `outlinks_availability` flag was set as well, timestamps of the last captures of the outlinks (or `null` if
           * they are unavailable).
           */
          outlinks?: Record<string, string> | Record<string, { timestamp: string | null }>;
      }
    | {
          /** Status, if the capture is still ongoing. */
          status: 'pending';
          /** Job ID the status was requested for. */
          job_id: string;
          /** List of URLs that were captured as part of the capture. */
          resources: string[];
      }
    | CaptureStatusError;

export type CaptureStatusError = {
    /** The capture encountered an error. */
    status: 'error';
    /** Exception that was internally thrown. */
    exception: string;
    /** A string code of what type of error was encountered. */
    status_ext:
        | 'error:bad-gateway' /** Bad Gateway for URL (HTTP status=502). */
        | 'error:bad-request' /** The server could not understand the request due to invalid syntax. (HTTP status=401) */
        | 'error:bandwidth-limit-exceeded' /** The target server has exceeded the bandwidth specified by the server administrator. (HTTP status=509). */
        | 'error:blocked' /** The target site is blocking us (HTTP status=999). */
        | 'error:blocked-client-ip'
        /**
         * Anonymous clients which are listed in https://www.spamhaus.org/xbl/ or https://www.spamhaus.org/sbl/ lists
         * (spams & exploits) are blocked. Tor exit nodes are excluded from this filter.
         */
        | 'error:blocked-url' /** We use a URL block list based on Mozilla web tracker lists to avoid unwanted captures. */
        | 'error:browsing-timeout' /** SPN2 back-end headless browser timeout. */
        | 'error:capture-location-error' /** SPN2 back-end cannot find the created capture location. (system error). */
        | 'error:cannot-fetch' /** Cannot fetch the target URL due to system overload. */
        | 'error:celery' /** Cannot start capture task. */
        | 'error:filesize-limit' /** Cannot capture web resources over 2GB. */
        | 'error:ftp-access-denied' /** Tried to capture an FTP resource but access was denied. */
        | 'error:gateway-timeout' /** The target server didn't respond in time. (HTTP status=504). */
        | 'error:http-version-not-supported' /** The target server does not support the HTTP protocol version used in the request for URL (HTTP status=505). */
        | 'error:internal-server-error' /** SPN internal server error. */
        | 'error:invalid-url-syntax' /** Target URL syntax is not valid. */
        | 'error:invalid-server-response' /** The target server response was invalid. (e.g. invalid headers, invalid content encoding, etc). */
        | 'error:invalid-host-resolution' /** Couldn’t resolve the target host. */
        | 'error:job-failed' /** Capture failed due to system error. */
        | 'error:method-not-allowed' /** The request method is known by the server but has been disabled and cannot be used (HTTP status=405). */
        | 'error:not-implemented' /** The request method is not supported by the server and cannot be handled (HTTP status=501). */
        | 'error:no-browsers-available' /** SPN2 back-end headless browser cannot run. */
        | 'error:network-authentication-required' /** The client needs to authenticate to gain network access to the URL (HTTP status=511). */
        | 'error:no-access' /** Target URL could not be accessed (status=403). */
        | 'error:not-found' /** Target URL not found (status=404). */
        | 'error:proxy-error' /** SPN2 back-end proxy error. */
        | 'error:protocol-error' /** HTTP connection broken. (A possible cause of this error is “IncompleteRead”). */
        | 'error:read-timeout' /** HTTP connection read timeout. */
        | 'error:soft-time-limit-exceeded' /** Capture duration exceeded 45s time limit and was terminated. */
        | 'error:service-unavailable' /** Service unavailable for URL (HTTP status=503). */
        | 'error:too-many-daily-captures' /** This URL has been captured 10 times today. We cannot make any more captures. */
        | 'error:too-many-redirects' /** Too many redirects. SPN2 tries to follow 3 redirects automatically. */
        | 'error:too-many-requests'
        /**
         * The target host has received too many requests from SPN and it is blocking it. (HTTP status=429). Note that
         * captures to the same host will be delayed for 10-20s after receiving this response to remedy the situation.
         */
        | 'error:user-session-limit' /** User has reached the limit of concurrent active capture sessions. */
        | 'error:unauthorized' /** The server requires authentication (HTTP status=40. */;
    /** The job ID of the erroneous capture. */
    job_id: string;
    /** A human-readable description of the error. */
    message: string;
    /** List of URLs that were captured as part of the capture. */
    ressources: string[];
};

/**
 * Send a status request to the SPN2 API of The Internet Archive.
 *
 * @param jobId The ID of the capture job to get the status for.
 * @param auth The authentication credentials for the Archive.org S3 API.
 *
 * @returns The verbatim result of the API request.
 */
export const status = async (jobId: string, auth: ArchiveOrgAuth): Promise<CaptureStatus> =>
    await fetch(`https://web.archive.org/save/status/${jobId}`, {
        method: 'GET',
        headers: {
            Authorization: `LOW ${auth.s3AccessKey}:${auth.s3SecretKey}`,
            Accept: 'application/json',
        },
    }).then((res) => res.json());

/**
 * Exception to be thrown in case of a failed capture to abort waiting for the capture to complete. It contains context
 * of why the capture failed from the status API.
 */
export class CaptureFailedException extends Error {
    type: string;
    jobId: string;
    exception: string;

    constructor(status: CaptureStatusError) {
        super(status.message);
        this.name = 'CaptureFailedException';
        this.type = status.status_ext;
        this.jobId = status.job_id;
        this.exception = status.exception;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            type: this.type,
            jobId: this.jobId,
            exception: this.exception,
        };
    }
}

/** Control-flow exception to throw if the capture is not done, yet, in order to retry the status request. */
export class CapturePendingException extends Error {
    jobId: string;

    constructor(jobId: string) {
        super('The capture is pending or timed out.');
        this.name = 'CapturePendingException';
        this.jobId = jobId;
    }
}

export const isCaptureFailedException = (error: Error): error is CaptureFailedException =>
    error.name === 'CaptureFailedException';

export const isCapturePendingException = (error: Error): error is CapturePendingException =>
    error.name === 'CapturePendingException';

/**
 * Send a capture Request and wait for the capture to complete, i.e. the status API to return `success`.
 *
 * @param url The URL to capture.
 * @param auth The authentication credentials for the Archive.org S3 API.
 * @param options The options to provide to the Save Page Now 2 API.
 *
 * @returns The capture status and the URL of the capture in the Wayback Machine.
 */
export const captureAndWait = async (url: string, auth: ArchiveOrgAuth, options?: CaptureRequestOptions) => {
    const captureResult = await capture(url, auth, options);

    const captureStatus = await pRetry(
        async () => {
            const statusResult = await status(captureResult.job_id, auth);
            if (statusResult.status === 'pending') throw new CapturePendingException(statusResult.job_id);
            if (statusResult.status === 'error') throw new AbortError(new CaptureFailedException(statusResult));
            return statusResult;
        },
        { retries: 10, minTimeout: 2000, maxTimeout: 10000 }
    );

    return {
        captureStatus,
        captureUrl: `https://web.archive.org/web/${captureStatus.timestamp}/${captureStatus.original_url}`,
    };
};

const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
