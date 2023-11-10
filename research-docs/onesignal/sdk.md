The `sdk` property is the SDK version. This can be verified by looking at the source code of the Android and iOS SDKs.

In the [OneSignal Android Push Notification Plugin](https://github.com/OneSignal/OneSignal-Android-SDK) ([archived](https://web.archive.org/web/20231110171825/https://github.com/OneSignal/OneSignal-Android-SDK)), the `sdk` property is set to the static value `VERSION` ([source](https://github.com/OneSignal/OneSignal-Android-SDK/blob/2cbb251031a26ef61984b9cb7d728ef9c5277e92/OneSignalSDK/onesignal/src/main/java/com/onesignal/OneSignal.java#L1515), [archived](https://archive.ph/E4YVp)):

```java
deviceInfo.put("sdk", VERSION);
```

That value holds the SDK version ([source](https://github.com/OneSignal/OneSignal-Android-SDK/blob/main/OneSignalSDK/onesignal/src/main/java/com/onesignal/OneSignal.java#L434-L437), [archived](https://archive.li/zcGM2)):

```java
private static final String VERSION = "040806";
public static String getSdkVersionRaw() {
  return VERSION;
}
```

---

In the [OneSignal iOS SDK](https://github.com/OneSignal/OneSignal-iOS-SDK) ([archived](https://archive.ph/7QimQ)), the `sdk` property is set to the property `sdk` of the `OSUserState` class ([source](https://github.com/OneSignal/OneSignal-iOS-SDK/blob/dce17e8667a29c4ac64bbee4280391d50c3af89f/iOS_SDK/OneSignalSDK/Source/OSUserState.m#L35-L41),[archived](https://archive.ph/Nqg0X)):

```objc
NSMutableDictionary *dataDic = [NSMutableDictionary dictionaryWithObjectsAndKeys:
               // […]
               _sdk, @"sdk",
               nil];
```

This `sdk` property is set to the `ONESIGNAL_VERSION` constant ([source](https://github.com/OneSignal/OneSignal-iOS-SDK/blob/dce17e8667a29c4ac64bbee4280391d50c3af89f/iOS_SDK/OneSignalSDK/Source/OneSignal.m#L1813), [archived](https://archive.ph/5sfg6)):

```objc
userState.sdk = ONESIGNAL_VERSION;
```

The `ONESIGNAL_VERSION` constant holds the SDK version ([source](https://github.com/OneSignal/OneSignal-iOS-SDK/blob/dce17e8667a29c4ac64bbee4280391d50c3af89f/iOS_SDK/OneSignalSDK/OneSignalCore/Source/OneSignalCommonDefines.h#L49), [archived](https://archive.ph/cKSlX)):

```objc
#define ONESIGNAL_VERSION                                                   @"031207"
```
