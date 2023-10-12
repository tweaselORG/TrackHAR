The `custom_user_id` property in the query string can be used by the developer to transmit their own first-party ID for the user to Singular. This is already self-evident from the name, but explicitly confirmed in section 2.5 of Singular's own [Android SDK integration guide](https://support.singular.net/hc/en-us/articles/360037581952--UPDATED-Android-SDK-Integration-Guide#25_Sending_the_User_ID_to_Singular_Optional) ([archived](https://archive.ph/QAIFE)):

> The Singular SDK can send a user ID from your app to Singular. This can be a username, email address, randomly generated string, or whichever identifier you use as a user ID. Singular uses the user ID in user-level data exports as well as internal BI postbacks (if you configure such postbacks).

Singular further confirm themselves that the `custom_user_id` is persistent unless explicitly unset by the developer:

> The user ID persists until you unset it using unsetCustomUserId or until the app is uninstalled. Closing/restarting the app does not unset the user ID.
>
> In many cases, you will want to call setCustomUserId when the user logs in to your service and unsetCustomUserId if the user logs out.

Similarly, in their [website SDK guide](https://support.singular.net/hc/en-us/articles/360039991491--NEW-Singular-Website-SDK-Native-Integration#Optional_Setting_the_User_ID) ([archived](https://archive.ph/zQBym)), they say:

> The Singular SDK can send a user ID from your website to Singular. This can be a username, email address, randomly generated string, or whichever identifier you use as a user ID.
> […]
> The user ID persists until you unset it using the logout method or until the user deletes their local storage.

For reference, these are the values for this property we have observed (remember that we never signed in with an account or similar, so it is to be expected that there are no email addresses, usernames, etc.):

* `7cc2559a46fbdf60a0bb797096e97e1c`
* `Lud5SxajkQaLP2Lo1ehqZkZsZGi1`
* `00d9a9ad-5e2b-4ee0-bf1f-369d12acb689`
* `52c5c185-2c46-4a22-890d-0269b2c280f1`
* `AyQxxvxkJOWKpAlj2WFSZVh9G3I3`
* `pfpf9dvXCRgor5n58CqhhwaGcOF3`
* `00000000-0000-0000-0000-000000000000`
* `7a9f124e-2d87-4da7-b79c-7994c00ce861`
* `ae98da52-9541-2df2-b8e0-f80a32991a0a`
* `239280c3eea60a8582bd59fc55b84bab32986722`
* `OyZVCfu5fxZ3ULs6PKX5Yg0zzUp1`
* `d18b4f8cbdd06e72`
* `d924c2359dbae610373b79ba446a59da`
* `zaV6x11WTTd9CSmN1L9bovjLf5R2`
* `22054985`
* `bc2bc664-0aaf-4c7b-a1c5-a9dd01595925`
* `6965c61c-c2cd-482d-9a3c-08b72e2ff89a`
* `4npdDiNUv4RlLQQIdjM70IeKxs13`
* `e05e1b0b-b652-4dde-9c87-33dcd6abcb88`
* `62affb39c7b7c230`
