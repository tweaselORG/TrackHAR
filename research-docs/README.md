# Tracker research documentation

This folder contains the documentation for the trackers, documenting the research done to determine the data paths in the adapters. It is then used to generate the [research documentation at trackers.tweasel.org](https://trackers.tweasel.org/research).

## Structure of a research page

Each page in the research documentation is added as a [hugo leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles), which is just a folder containing markdown and media files. It needs an `index.md` containing a title (which can use markdown) and some kind of content. If you don‘t want to write anything, you still need to add something like a `&nbsp;`, otherwise, the page won‘t be rendered.

Sections, e.g. on specific properties, are added as separate markdown files in the same folder. The name of the file will be used as an URL fragment to the section on the page. You can specify a title in the frontmatter. If you don‘t, it defaults to: »*`<file basename>` Property*«

The typical folder structure should look like this:

```
research-docs
└── tracker-1
│   └── index.md
│   └── gssid.md
│   └── location_properties.md
│   └── screenshot-1.png
└── adapter-with-specific-research
    └── index.md
    └── section-1.md
```

You can reference your research in the adapter’s `reasoning` field by specifying a folder and markdown file relative to the `research-docs/` folder: `tracker-1/gssid.md`.
