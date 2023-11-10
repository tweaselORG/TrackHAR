On iOS, the `ios_bundle` property is the app ID. This can be verified by looking at the source code of the [OneSignal iOS SDK](https://github.com/OneSignal/OneSignal-iOS-SDK) ([archived](https://archive.ph/7QimQ)).

Here, the `ios_bundle` property is set to the property `iOSBundle` of the `OSUserState` class ([source](https://github.com/OneSignal/OneSignal-iOS-SDK/blob/dce17e8667a29c4ac64bbee4280391d50c3af89f/iOS_SDK/OneSignalSDK/Source/OSUserState.m#L58-L59), [archived](https://archive.ph/zDx7a)):

```objc
if (_iOSBundle)
    dataDic[@"ios_bundle"] = _iOSBundle;
```

The `iOSBundle` property is set to the return value of the function call `[[NSBundle mainBundle] bundleIdentifier]` ([source](https://github.com/OneSignal/OneSignal-iOS-SDK/blob/dce17e8667a29c4ac64bbee4280391d50c3af89f/iOS_SDK/OneSignalSDK/Source/OneSignal.m#L1842), [archived](https://archive.li/Eoenp)):

```objc
userState.iOSBundle = [[NSBundle mainBundle] bundleIdentifier];
```

`[NSBundle mainBundle]` is an accessor for getting the current app's bundle ([source](https://developer.apple.com/documentation/foundation/nsbundle/1410786-mainbundle), [archived](https://web.archive.org/web/20231110174624/https://developer.apple.com/documentation/foundation/nsbundle/1410786-mainbundle)). And the `bundleIdentifier` function returns the app ID ([source](https://developer.apple.com/documentation/foundation/nsbundle/1418023-bundleidentifier), [archived](https://archive.ph/2dcmD)).
