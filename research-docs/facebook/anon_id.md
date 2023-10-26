The `anon_id` is a unique ID for the device that Facebook generates and persists on the device. This can be verified by reading the source code of the Facebook SDKs.

For iOS, that is the [Facebook SDK for iOS](https://github.com/facebook/facebook-ios-sdk):

Here, a property with the key `FBSDK_APPEVENTSUTILITY_ANONYMOUSID_KEY` is set to the return value of the function call `[FBSDKBasicUtility anonymousID]` ([source](https://github.com/facebook/facebook-ios-sdk/blob/41044df838ef3fefe600fb96b6560dc8a2b2a18a/FBSDKCoreKit/FBSDKCoreKit/AppEvents/Internal/FBSDKAppEventsUtility.m#L81)):

```objc
[FBSDKTypeUtility dictionary:parameters setObject:[FBSDKBasicUtility anonymousID] forKey:FBSDK_APPEVENTSUTILITY_ANONYMOUSID_KEY];
```

The value of the `FBSDK_APPEVENTSUTILITY_ANONYMOUSID_KEY` constant is `anon_id` ([source](https://github.com/facebook/facebook-ios-sdk/blob/41044df838ef3fefe600fb96b6560dc8a2b2a18a/FBSDKCoreKit/FBSDKCoreKit/AppEvents/Internal/FBSDKAppEventsUtility.m#L20)):

```objc
#define FBSDK_APPEVENTSUTILITY_ANONYMOUSID_KEY @"anon_id"
```

The `[FBSDKBasicUtility anonymousID]` function tries to retrieve a previously saved ID using the `retrievePersistedAnonymousID` function. If that fails, it generates a UUID using `[NSUUID UUID].UUIDString` ([documentation](https://developer.apple.com/documentation/foundation/nsuuid)), prepends the string `XZ`, and saves that using the `persistAnonymousID` function. ([source](https://github.com/facebook/facebook-ios-sdk/blob/41044df838ef3fefe600fb96b6560dc8a2b2a18a/FBSDKCoreKit_Basics/FBSDKCoreKit_Basics/FBSDKBasicUtility.m#L306))

```objc
+ (NSString *)anonymousID
{
  // Grab previously written anonymous ID and, if none have been generated, create and
  // persist a new one which will remain associated with this app.
  NSString *result = [self.class retrievePersistedAnonymousID];
  if (!result) {
    // Generate a new anonymous ID.  Create as a UUID, but then prepend the fairly
    // arbitrary 'XZ' to the front so it's easily distinguishable from IDFA's which
    // will only contain hex.
    result = [NSString stringWithFormat:@"XZ%@", [NSUUID UUID].UUIDString];

    [self persistAnonymousID:result];
  }
  return result;
}
```

In the [Facebook SDK for Android](https://github.com/facebook/facebook-android-sdk/), the `anon_id` is set to the value of the `anonymousAppDeviceGUID` parameter in the `Utility.setAppEventAttributionParameters` function ([source](https://github.com/facebook/facebook-android-sdk/blob/ed8afd48df9e347191ac7fe0c6c3a34c30d89429/facebook-core/src/main/java/com/facebook/internal/Utility.kt#L579)):

```kt
params.put("anon_id", anonymousAppDeviceGUID)
```

The return value of a call to the `AppEventsLogger.getAnonymousAppDeviceGUID()` function is passed as that parameter, e.g. ([source](https://github.com/facebook/facebook-android-sdk/blob/ed8afd48df9e347191ac7fe0c6c3a34c30d89429/facebook-applinks/src/main/java/com/facebook/applinks/AppLinkData.java#L143-L148)):

```kt
Utility.setAppEventAttributionParameters(
    deferredApplinkParams,
    AttributionIdentifiers.getAttributionIdentifiers(context),
    AppEventsLogger.getAnonymousAppDeviceGUID(context),
    FacebookSdk.getLimitEventAndDataUsage(context),
    context);
```

The `AppEventsLogger.getAnonymousAppDeviceGUID()` function just forwards to `AppEventsLoggerImpl.getAnonymousAppDeviceGUID` ([source](https://github.com/facebook/facebook-android-sdk/blob/ed8afd48df9e347191ac7fe0c6c3a34c30d89429/facebook-core/src/main/java/com/facebook/appevents/AppEventsLogger.kt#L542-L552)):

```kt
/**
 * Each app/device pair gets an GUID that is sent back with App Events and persisted with this
 * app/device pair.
 *
 * @param context The application context.
 * @return The GUID for this app/device pair.
 */
@JvmStatic
fun getAnonymousAppDeviceGUID(context: Context): String {
  return AppEventsLoggerImpl.getAnonymousAppDeviceGUID(context)
}
```

`AppEventsLoggerImpl.getAnonymousAppDeviceGUID()` finally implements the actual logic. Similarly to iOS, it first tries to read an existing ID from the `SharedPreferences`. If that fails, it generates a version 4 UUID using the `UUID.randomUUID().toString()` function from the `java.util.UUID` package ([documentation](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html#randomUUID--)), prepends the string `XZ`, and saves that to the `SharedPreferences`. ([source](https://github.com/facebook/facebook-android-sdk/blob/ed8afd48df9e347191ac7fe0c6c3a34c30d89429/facebook-core/src/main/java/com/facebook/appevents/AppEventsLoggerImpl.kt#L607-L628))

```kt
@JvmStatic
fun getAnonymousAppDeviceGUID(context: Context): String {
  if (anonymousAppDeviceGUID == null) {
    synchronized(staticLock) {
      if (anonymousAppDeviceGUID == null) {
        val preferences =
            context.getSharedPreferences(APP_EVENT_PREFERENCES, Context.MODE_PRIVATE)
        anonymousAppDeviceGUID = preferences.getString("anonymousAppDeviceGUID", null)
        if (anonymousAppDeviceGUID == null) {
          // Arbitrarily prepend XZ to distinguish from device supplied identifiers.
          anonymousAppDeviceGUID = "XZ" + UUID.randomUUID().toString()
          context
              .getSharedPreferences(APP_EVENT_PREFERENCES, Context.MODE_PRIVATE)
              .edit()
              .putString("anonymousAppDeviceGUID", anonymousAppDeviceGUID)
              .apply()
        }
      }
    }
  }
  return checkNotNull(anonymousAppDeviceGUID)
}
```

---

The [Facebook Graph API documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/application/activities) ([archived](https://archive.ph/ORVgn)) describes the `anon_id` property as "The ID of a person who has installed the app anonymously". As we have shown above, the "anonymous" here very much does not mean that the ID is not personal data under the GDPR. Presumably, Facebook means users that have not logged in with a Facebook account.
