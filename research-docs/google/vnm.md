The `vnm` property in the query string always matches the app's version for the requests in our database.

On iOS, it holds the human-readable version. A few samples:

* [`vnm=2.17.0`](https://data.tweasel.org/data/requests/informed-consent,428853) comes from `com.elecont.EWClock@2.17`
* [`vnm=22.7.2`](https://data.tweasel.org/data/requests/monkey-july-2023,22973) comes from `com.picsart.studio@22.7.2`
* [`vnm=5.85.2`](https://data.tweasel.org/data/requests/monkey-july-2023,9490) comes from `com.cyberlink.youperfect@5.85.2`
* [`vnm=1.4.8`](https://data.tweasel.org/data/requests/monkey-july-2023,8708) comes from `com.crazymaplestudio.aurora@1.4.08`
* [`vnm=1.0.2`](https://data.tweasel.org/data/requests/informed-consent,120876) comes from `com.smmservice.videoforairplay@1.0.2`

On Android, it holds the version code. A few samples:

* [`vnm=140`](https://data.tweasel.org/data/requests/worrying-confessions,32750) comes from `com.translate.talkingtranslator@2.3.9`:

  ```sh
  ❯ aapt dump badging com.translate.talkingtranslator.apk
  package: name='com.translate.talkingtranslator' versionCode='140' versionName='2.3.9' compileSdkVersion='31' compileSdkVersionCodename='12'
  ```
* [`vnm=43`](https://data.tweasel.org/data/requests/worrying-confessions,44179) comes from `com.bravo.booster@1.3.0.1001`:

  ```sh
  ❯ aapt dump badging com.bravo.booster.apk
  package: name='com.bravo.booster' versionCode='43' versionName='1.3.0.1001' compileSdkVersion='31' compileSdkVersionCodename='12'
  ```
* [`vnm=40`](https://data.tweasel.org/data/requests/informed-consent,185851) comes from `com.paradyme.citysmash@1.40`:

  ```sh
  ❯ aapt dump badging com.paradyme.citysmash.apk
  package: name='com.paradyme.citysmash' versionCode='40' versionName='1.40' compileSdkVersion='30' compileSdkVersionCodename='11'
  ```
* [`vnm=2736704`](https://data.tweasel.org/data/requests/informed-consent,358831) comes from `com.outdooractive.Outdooractive@3.9.0`:

  ```sh
  ❯ aapt dump badging com.outdooractive.Outdooractive.apk
  package: name='com.outdooractive.Outdooractive' versionCode='2736704' versionName='3.9.0' compileSdkVersion='31' compileSdkVersionCodename='12'
  ```
* [`vnm=2070010`](https://data.tweasel.org/data/requests/informed-consent,571951) comes from `com.easybrain.block.puzzle.games@2.7.0`:

  ```sh
  ❯ aapt dump badging com.easybrain.block.puzzle.games/com.easybrain.block.puzzle.games.apk
  package: name='com.easybrain.block.puzzle.games' versionCode='2070010' versionName='2.7.0' compileSdkVersion='31' compileSdkVersionCodename='12'
  ```


It's also likely that "vnm" is an acronym for "version number".
