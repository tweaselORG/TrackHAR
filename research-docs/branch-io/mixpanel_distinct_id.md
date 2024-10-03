According to [Branch's documentation](https://help.branch.io/partners-portal/docs/mixpanel#3-pass-metadata-to-the-branch-sdk) ([archived](https://web.archive.org/web/20240923102331/https://help.branch.io/partners-portal/docs/mixpanel#3-pass-metadata-to-the-branch-sdk)), the `$mixpanel_distinct_id` property contains the Mixpanel Distinct ID. According to [Mixpanel's documentation](https://docs.mixpanel.com/docs/tracking-methods/id-management/identity-management#distinct-id) ([archived](https://archive.ph/ObGlg)):

> Distinct ID is Mixpanel's identifier used to uniquely track a user in the system. […]
> 
> The purpose of Distinct ID is to provide a single, unified identifier for a user across devices and sessions. When two events have the same value of `distinct_id`, they are considered as being performed by one unique user. If the Distinct ID on two events are two different values, they will be considered as coming from two separate users.
