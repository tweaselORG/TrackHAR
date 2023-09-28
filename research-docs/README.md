# Tracker research documentation

This folder contains the documentation for the trackers, documenting the research done to determine the data paths in the adapters. It is then used to generate the [research documentation at trackers.tweasel.org](https://trackers.tweasel.org/research).

## Structure of a research page

Each page in the research documentation is added as a [Hugo leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles), which is just a folder containing Markdown and media files. It needs an `index.md` containing a title (which can use Markdown) and some kind of content. If you don’t want to write anything, you still need to add something like a `&nbsp;`, otherwise, the page won’t be rendered.

Sections, e.g. on specific properties, are added as separate Markdown files in the same folder. The name of the file will be used as an URL fragment to the section on the page. You can specify a title in the frontmatter. If you don’t, it defaults to: »*`<file basename>` property*«

The typical folder structure should look like this:

```
research-docs
└── tracker-1
│   └── index.md
│   └── gssid.md
│   └── location-properties.md
│   └── screenshot-1.png
└── adapter-with-specific-research
    └── index.md
    └── section-1.md
```

You can reference your research in the adapter’s `reasoning` field by specifying a folder and Markdown file relative to the `research-docs/` folder: `tracker-1/gssid.md`.

## Archived links

To ensure the information we refer to in our documentation isn’t lost, we archive these links to public web archives. This can be done manually or automatically. External URLs in you mention in the reasoning for an adapter must be archived and the URL (without fragments) needs to be added to the `research-docs/archived-urls.csv` file. A line in that file looks like this:

```csv
"<your original URL>","<URL where the archived website can be accessed>","<ISO 8601 timestamp of the capture>","<list of properties, separated by semicolons>"
```

The properties must be a string in the format `<tracker slug>/<adapter slug>#<property name>`, e.g. `mopub/ads#screenHeight`. The individual properties must not be wrapped in `"` characters. A full list of properties could look like this: `,"mopub/ads#appVersion;mopub/ads#trackerSdkVersion"`

If you want URLs you add to an adapter’s `reasoning` to be archived automatically, you can run `yarn auto-archive` and keep it running while you edit the files. You’ll need to create an `archive-config.json` in the project root containing the API credentials for the S3 API of the Internet Archive. The script will look for URLs in the `reasoning` and automatically try to archive them to the Internet Archive. If this fails, the script will report an error and log it to `research-docs/archive-errors.json`. Some of these errors will be retried after a while, e.g. errors due to rate limiting. If an error persists or is not recoverable, you need to archive the URL manually and add it to the CSV. You may need to use another public archive then. We usually use [archive.today](https://archive.today/) as a fallback.
