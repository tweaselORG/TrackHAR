The `carrier` property is the carrier of the SIM card inserted into the device. This can be verified by looking at the source code of the Android and iOS SDKs.

In the [OneSignal Android Push Notification Plugin](https://github.com/OneSignal/OneSignal-Android-SDK) ([archived](https://web.archive.org/web/20231110171825/https://github.com/OneSignal/OneSignal-Android-SDK)), the `carrier` property is set to the return value of the function call `osUtils.getCarrierName()` ([source](https://github.com/OneSignal/OneSignal-Android-SDK/blob/2cbb251031a26ef61984b9cb7d728ef9c5277e92/OneSignalSDK/onesignal/src/main/java/com/onesignal/OneSignal.java#L1525), [archived](https://archive.ph/J4vLX)):

```java
deviceInfo.put("carrier", osUtils.getCarrierName());
```

The static `osUtils` variable is an instance of the `TODO` class (source 1 and 2):

```java
@NonNull private static OSUtils osUtils = new OSUtils();
```

The `getCarrierName()` function in that class uses the `getNetworkOperatorName()` function of the `TelephonyManager` class ([documentation](https://developer.android.com/reference/android/telephony/TelephonyManager#getNetworkOperatorName()), [archived](https://archive.ph/Uz4Kk)) to get the carrier name ([source](https://github.com/OneSignal/OneSignal-Android-SDK/blob/2cbb251031a26ef61984b9cb7d728ef9c5277e92/OneSignalSDK/onesignal/src/main/java/com/onesignal/OSUtils.java#L396-L407), [archived](https://archive.ph/R1MnR)):

```java
String getCarrierName() {
  try {
     TelephonyManager manager = (TelephonyManager) OneSignal.appContext.getSystemService(Context.TELEPHONY_SERVICE);
     // May throw even though it's not in noted in the Android docs.
     // Issue #427
     String carrierName = manager.getNetworkOperatorName();
     return "".equals(carrierName) ? null : carrierName;
  } catch(Throwable t) {
     t.printStackTrace();
     return null;
  }
}
```

---

In the [OneSignal iOS SDK](https://github.com/OneSignal/OneSignal-iOS-SDK) ([archived](https://archive.ph/7QimQ)), the `carrier` property is set to the property `carrier` of the `OSUserState` class ([source](https://github.com/OneSignal/OneSignal-iOS-SDK/blob/dce17e8667a29c4ac64bbee4280391d50c3af89f/iOS_SDK/OneSignalSDK/Source/OSUserState.m#L65-L66), [archived](https://archive.ph/bQlA2)):

```objc
if (_carrier)
    dataDic[@"carrier"] = _carrier;
```

This `carrier` property is set to the `carrierName` variable ([source](https://github.com/OneSignal/OneSignal-iOS-SDK/blob/dce17e8667a29c4ac64bbee4280391d50c3af89f/iOS_SDK/OneSignalSDK/Source/OneSignal.m#L1856-L1857), [archived](https://archive.ph/i8YFT)):

```objc
if (carrierName)
    userState.carrier = carrierName;
```

The `carrierName` variable is set to the return value of `[[instance valueForKey:@"subscriberCellularProvider"] valueForKey:@"carrierName"]`, where `instance` is an instance of `CTTelephonyNetworkInfo` ([source](https://github.com/OneSignal/OneSignal-iOS-SDK/blob/dce17e8667a29c4ac64bbee4280391d50c3af89f/iOS_SDK/OneSignalSDK/Source/OneSignal.m#L1851-L1854), [archived](https://archive.ph/6zvBn)):

```objc
let CTTelephonyNetworkInfoClass = NSClassFromString(@"CTTelephonyNetworkInfo");
if (CTTelephonyNetworkInfoClass) {
    id instance = [[CTTelephonyNetworkInfoClass alloc] init];
    let carrierName = (NSString *)[[instance valueForKey:@"subscriberCellularProvider"] valueForKey:@"carrierName"];

 // […]
}
```

That function call returns the carrier name (documentation [1](https://developer.apple.com/documentation/coretelephony/cttelephonynetworkinfo/1616900-subscribercellularprovider) ([archived](https://archive.ph/RmNiX)) and [2](https://developer.apple.com/documentation/coretelephony/ctcarrier/1620313-carriername) ([archived](https://archive.ph/SpsjE))).
