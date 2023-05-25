trackhar

# trackhar

## Table of contents

### Type Aliases

- [Adapter](README.md#adapter)
- [AnnotatedResult](README.md#annotatedresult)
- [ArrayOrSingle](README.md#arrayorsingle)
- [Context](README.md#context)
- [DataPath](README.md#datapath)
- [DecodingStep](README.md#decodingstep)
- [Identifier](README.md#identifier)
- [IndicatorValues](README.md#indicatorvalues)
- [JsonPath](README.md#jsonpath)
- [Path](README.md#path)
- [Property](README.md#property)
- [Request](README.md#request)
- [Result](README.md#result)
- [Tracker](README.md#tracker)
- [TrackingDataValue](README.md#trackingdatavalue)
- [Variable](README.md#variable)

### Variables

- [adapters](README.md#adapters)

### Functions

- [process](README.md#process)
- [processRequest](README.md#processrequest)

## Type Aliases

### Adapter

Ƭ **Adapter**: `Object`

An adapter that contains instructions on how to extract the tracking data included in a request to certain endpoints.

Handling for one endpoint might be split across multiple adapters if the endpoint accepts different request formats.

The first adapter that matches a request will be used to decode it.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `containedDataPaths` | `Partial`<`Record`<[`Property`](README.md#property), [`ArrayOrSingle`](README.md#arrayorsingle)<[`DataPath`](README.md#datapath)\>\>\> | A description of how to extract the transmitted tracking data from the decoded object. |
| `decodingSteps` | [`DecodingStep`](README.md#decodingstep)[] | An array of the steps (in order) used to decode the request into an object format. |
| `endpointUrls` | (`string` \| `RegExp`)[] | The endpoints that this adapter can handle. Each entry can either be a string (which will have to be equal to the full endpoint URL in the request) or a regular expression that is matched against the endpoint URL. The endpoint URL in this context is the full URL, including protocol, host, and path, but excluding the query string. |
| `match?` | (`r`: [`Request`](README.md#request)) => `boolean` \| `undefined` | An optional function to further filter which requests can be handled by this adapter. This is useful if there are multiple adapters for one endpoint that handle different request formats. |
| `slug` | `string` | A slug to identify the adapter. These only need to be unique per tracker, not globally. |
| `tracker` | [`Tracker`](README.md#tracker) | The tracking company behind these endpoints. |

#### Defined in

[index.ts:167](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L167)

___

### AnnotatedResult

Ƭ **AnnotatedResult**: { `adapter`: `string` ; `property`: `LiteralUnion`<[`Property`](README.md#property), `string`\> ; `reasoning`: [`DataPath`](README.md#datapath)[``"reasoning"``] \| ``"indicator matching (plain text)"`` \| ``"indicator matching (base64)"`` \| ``"indicator matching (URL encoded)"`` ; `value`: [`TrackingDataValue`](README.md#trackingdatavalue)  } & `Omit`<[`DataPath`](README.md#datapath), ``"reasoning"``\>[]

Extended version of the [Result](README.md#result) type that includes additional metadata about the detected tracking. Each entry
in the array is one instance of a tracking data value that was found in a request, with the following properties:

- `adapter`: The adapter that detected the tracking data (`<tracker slug>/<adapter slug>`) or `indicators` if the entry
  was detected through indicator matching.
- `property`: The type of tracking data that was detected.
- `value`: The actual value of the tracking data that was transmitted.
- `context`: The part of the request in which the tracking data was found (e.g. `body`, `path`).
- `path`: A JSONPath expression indicating where this match was found. Note that while we try to keep this path as
  close as possible to the format used by the tracker, it refers to the decoded request, after our processing steps.
  This is unavoidable as the trackers don't transmit in a standardized format.

  If indicator matching was used to detect this entry, the path will point to the first character of the match in the
  respective part of the request.
- `reasoning`: An explanation of how we concluded that this is information is actually the type of data we labelled it
  as. This can either be a standardized description, or a URL to a more in-depth research report.

  If indicator matching was used to detect this entry, the reasoning will be `indicator matching` followed by the
  encoding that was used to match the indicator value in parentheses.

#### Defined in

[index.ts:366](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L366)

___

### ArrayOrSingle

Ƭ **ArrayOrSingle**<`T`\>: `T` \| `T`[]

Either a single instance or an array of `T`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[common/type-utils.ts:2](https://github.com/tweaselORG/TrackHAR/blob/main/src/common/type-utils.ts#L2)

___

### Context

Ƭ **Context**: ``"header"`` \| ``"path"`` \| ``"query"`` \| ``"body"``

A part of a request, to explain where some information was found.

#### Defined in

[index.ts:19](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L19)

___

### DataPath

Ƭ **DataPath**: `Object`

A description of where a certain piece of tracking data can be found in the decoded request.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`Context`](README.md#context) | The part of the original request that the data can be found in. |
| `path` | [`JsonPath`](README.md#jsonpath) | A JSONPath expression describing where in the decoded request object the data can be found. |
| `reasoning` | ``"obvious property name"`` \| ``"obvious observed values"`` \| \`https://${string}\` \| \`http://${string}\` | An explanation of how we concluded that this is information is actually the type of data we labelled it as. This can either be a standardized description, or a URL to a more in-depth research report. |

#### Defined in

[index.ts:149](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L149)

___

### DecodingStep

Ƭ **DecodingStep**: { `function`: ``"parseQueryString"`` \| ``"parseJson"`` \| ``"decodeBase64"`` \| ``"decodeUrl"`` \| ``"decodeProtobuf"`` \| ``"ensureArray"``  } \| { `function`: ``"getProperty"`` ; `options`: { `path`: [`JsonPath`](README.md#jsonpath)  }  } & { `input`: [`Path`](README.md#path)  } \| { `mapInput`: [`Path`](README.md#path)  } & { `output`: [`Identifier`](README.md#identifier)  }

A step in the process of decoding a tracking request. This is essentially a function call with some input and output,
and potentially additional options.

The `input` is a JSONPath expression which is evaluated against the global decoding state (initialized with the data
from each [Context](README.md#context) of the request, and a `res` object, where the result of the decoding is to be stored,
separated by [Context](README.md#context); new variables can be created by decoding steps).\
Alternatively, if a `mapInput` is specified instead, the function will be mapped over the array at the given path,
returning a result array.

The `output` is an identifier of where to store the return value of the function call in the same global decoding
state. Note that this doesn't support the full range of JSONPath expressions, but only nested property access through
`.`.

The following `function`s are available:

- `parseQueryString`: Parses a query string encoded value into an object.
- `parseJson`: Parses a JSON encoded string into an object.
- `decodeBase64`: Decodes a base64-encoded string.
- `decodeUrl`: Decodes a URL-encoded string.
- `decodeProtobuf`: Decodes a Protobuf blob. This doesn't use a schema, as such property names are not available in the
  result.
- `ensureArray`: Ensures that the given value is an array. If it is not, it is wrapped in an array.
- `getProperty`: Gets a property from an object. The property name is given in the `options.path` option. This is
  useful for either copying a nested property to a variable, or to extract a nested property from an array when used
  with a `mapInput`.

#### Defined in

[index.ts:140](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L140)

___

### Identifier

Ƭ **Identifier**: [`Variable`](README.md#variable) \| \`${Exclude<Variable, "res"\>}.${string}\` \| \`res.${Context}\` \| \`res.${Context}.${string}\`

An identifer for a variable or nested property on the global state in the decoding process of a request. This
**doesn't** have support for more complex JSONPath expressions.

#### Defined in

[index.ts:108](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L108)

___

### IndicatorValues

Ƭ **IndicatorValues**: `Partial`<`Record`<`LiteralUnion`<[`Property`](README.md#property), `string`\>, [`ArrayOrSingle`](README.md#arrayorsingle)<`string`\>\>\>

A mapping from properties (standardized names for certain types of tracking data) to indicator values (known honey
data strings that appear in the request if the property is present). Indicator values can be provided as arrays or
single strings. They are automatically matched against their encoded versions (e.g. base64 and URL encoded). Where
possible, they are matched case-insensitively.

**`Example`**

```ts
{
    "localIp": ["10.0.0.2", "fd31:4159::a2a1"],
    "idfa": "6a1c1487-a0af-4223-b142-a0f4621d0311"
}
```

This example means that if the string `10.0.0.2` or `fd31:4159::a2a1` is found in the request, it indicates that the
local IP is being transmitted. Similarly, if the string `6a1c1487-a0af-4223-b142-a0f4621d0311` is found in the
request, it indicates that the advertising ID is being transmitted.

#### Defined in

[index.ts:404](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L404)

___

### JsonPath

Ƭ **JsonPath**: `string`

A JSONPath expression to be parsed by https://github.com/JSONPath-Plus/JSONPath.

#### Defined in

[index.ts:12](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L12)

___

### Path

Ƭ **Path**: `LiteralUnion`<[`Variable`](README.md#variable), [`JsonPath`](README.md#jsonpath)\>

A JSONPath expression that can be used to access a variable or nested property on the global state in the decoding
process of a request.

#### Defined in

[index.ts:103](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L103)

___

### Property

Ƭ **Property**: ``"accelerometerX"`` \| ``"accelerometerY"`` \| ``"accelerometerZ"`` \| ``"appId"`` \| ``"appName"`` \| ``"appVersion"`` \| ``"architecture"`` \| ``"batteryLevel"`` \| ``"carrier"`` \| ``"country"`` \| ``"deviceName"`` \| ``"diskFree"`` \| ``"diskTotal"`` \| ``"diskUsed"`` \| ``"hashedIdfa"`` \| ``"idfa"`` \| ``"idfv"`` \| ``"isCharging"`` \| ``"isEmulator"`` \| ``"isInDarkMode"`` \| ``"isInForeground"`` \| ``"isRoaming"`` \| ``"isRooted"`` \| ``"language"`` \| ``"latitude"`` \| ``"localIp"`` \| ``"longitude"`` \| ``"macAddress"`` \| ``"manufacturer"`` \| ``"model"`` \| ``"networkConnectionType"`` \| ``"orientation"`` \| ``"osName"`` \| ``"osVersion"`` \| ``"otherIdentifiers"`` \| ``"publicIp"`` \| ``"ramFree"`` \| ``"ramTotal"`` \| ``"ramUsed"`` \| ``"rotationX"`` \| ``"rotationY"`` \| ``"rotationZ"`` \| ``"screenHeight"`` \| ``"screenWidth"`` \| ``"signalStrengthCellular"`` \| ``"signalStrengthWifi"`` \| ``"timezone"`` \| ``"trackerSdkVersion"`` \| ``"uptime"`` \| ``"userAgent"`` \| ``"viewedPage"`` \| ``"volume"``

A type of tracking data that we can detect in a request.

These are our standardized names for the data that we can detect. They are not necessarily the same as the names used
by the tracker.

#### Defined in

[index.ts:44](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L44)

___

### Request

Ƭ **Request**: `Object`

Our internal representation of an HTTP request.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `content?` | `string` | The request body, if any. |
| `cookies?` | { `name`: `string` ; `value`: `string`  }[] | The cookies set through request. |
| `endpointUrl` | `string` | The full URL, but without the query string. This is useful for matching in the adapters. |
| `headers?` | { `name`: `string` ; `value`: `string`  }[] | The headers included in the request. |
| `host` | `string` | The host name of the request. |
| `httpVersion` | `string` | The HTTP version of the request. |
| `method` | `string` | The HTTP method used. |
| `path` | `string` | The full path of the request, including the query string. |
| `port` | `string` | The port of the request. |
| `scheme` | ``"http"`` \| ``"https"`` | The scheme of the request. |
| `startTime` | `Date` | The time when the request was sent. |

#### Defined in

[common/request.ts:4](https://github.com/tweaselORG/TrackHAR/blob/main/src/common/request.ts#L4)

___

### Result

Ƭ **Result**: `Partial`<`Record`<`LiteralUnion`<[`Property`](README.md#property), `string`\>, [`TrackingDataValue`](README.md#trackingdatavalue)[]\>\>

A mapping from properties (standardized names for certain types of tracking data) to the actual instances of values
of that property found in a request.

If indicator matching is enabled, it is not possible to distinguish between instances detected through adapter and
indicator matching.

#### Defined in

[index.ts:383](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L383)

___

### Tracker

Ƭ **Tracker**: `Object`

A tracking company that we have adapters for.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `datenanfragenSlug?` | `string` | The slug of the tracking company in the [Datenanfragen.de company database](https://www.datarequests.org/company) (if available). |
| `exodusId?` | `number` | The numeric ID of the tracker in the [Exodus tracker database](https://reports.exodus-privacy.eu.org/en/trackers/) (if available). |
| `name` | `string` | The legal name of the tracking company. |
| `slug` | `string` | A slug to identify the tracker. |

#### Defined in

[index.ts:22](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L22)

___

### TrackingDataValue

Ƭ **TrackingDataValue**: `any`

Some value transmitted by a tracker. We don't have any type information about it.

#### Defined in

[index.ts:16](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L16)

___

### Variable

Ƭ **Variable**: `LiteralUnion`<[`Context`](README.md#context) \| ``"res"``, `string`\>

A variable on the global state used in the decoding process of a request. This doesn't allow nested property access.

#### Defined in

[index.ts:98](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L98)

## Variables

### adapters

• `Const` **adapters**: [`Adapter`](README.md#adapter)[] = `allAdapters`

An array of all available adapters.

**`Remarks`**

This is not needed for the main purposes of this library, but can be useful for more advanced use cases. We use it to
generate the information in [`tracker-wiki`](https://github.com/tweaselORG/tracker-wiki).

#### Defined in

[index.ts:455](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L455)

## Functions

### process

▸ **process**<`ValuesOnly`\>(`har`, `options?`): `Promise`<`ValuesOnly` extends ``true`` ? (`undefined` \| `Partial`<`Record`<`LiteralUnion`<[`Property`](README.md#property), `string`\>, `any`[]\>\>)[] : (`undefined` \| [`AnnotatedResult`](README.md#annotatedresult))[]\>

Parse the requests in a HAR traffic dump and extract tracking data.

This always tries to parse requests with the tracker-specific adapters first. If none of them can handle a request,
and `options.indicatorValues` is provided, it will fall back to indicator matching.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ValuesOnly` | extends `boolean` = ``false`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `har` | `Har` | A traffic dump in HAR format. |
| `options?` | `Object` | An optional object that can configure the following options: - `valuesOnly`: By default, the result contains not just the values but also various metadata (like the adapter that processed the request). If you only need the values, you can set this option to `true` to get a simpler result. - `indicatorValues`: An object that specifies known honey data values for certain properties. If no adapter could match the request but indicator values are provided, this function will fall back to indicator matching and try to find the indicator values in the request headers, path or body. See [IndicatorValues](README.md#indicatorvalues). |
| `options.indicatorValues?` | `Partial`<`Record`<`LiteralUnion`<[`Property`](README.md#property), `string`\>, [`ArrayOrSingle`](README.md#arrayorsingle)<`string`\>\>\> | - |
| `options.valuesOnly?` | `ValuesOnly` | - |

#### Returns

`Promise`<`ValuesOnly` extends ``true`` ? (`undefined` \| `Partial`<`Record`<`LiteralUnion`<[`Property`](README.md#property), `string`\>, `any`[]\>\>)[] : (`undefined` \| [`AnnotatedResult`](README.md#annotatedresult))[]\>

An array of results, corresponding to each request in the HAR file. If a request could not be processed
  (i.e. if no adapter was found that could handle it and indicator matching is disabled), the corresponding entry in
  the array will be `undefined`.

#### Defined in

[index.ts:426](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L426)

___

### processRequest

▸ **processRequest**(`request`, `options?`): `undefined` \| [`AnnotatedResult`](README.md#annotatedresult)

Parse a single request in our internal request representation and extract tracking data as an annotated result from
it.

**`Remarks`**

This is not needed for the main purposes of this library, but can be useful for more advanced use cases.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`Request`](README.md#request) | The request to process in our internal request format. |
| `options?` | `Object` | An optional object that can configure the following options: - `indicatorValues`: An object that specifies known honey data values for certain properties. If no adapter could match the request but indicator values are provided, this function will fall back to indicator matching and try to find the indicator values in the request headers, path or body. See [IndicatorValues](README.md#indicatorvalues). |
| `options.indicatorValues?` | `Partial`<`Record`<`LiteralUnion`<[`Property`](README.md#property), `string`\>, [`ArrayOrSingle`](README.md#arrayorsingle)<`string`\>\>\> | - |

#### Returns

`undefined` \| [`AnnotatedResult`](README.md#annotatedresult)

#### Defined in

[index.ts:267](https://github.com/tweaselORG/TrackHAR/blob/main/src/index.ts#L267)
