# Lab Next Door Website

**Current version: v0.1.0**

> Still Figuring It Out

Static GitHub Pages website for Lab Next Door.

## Brand
- Midnight `#0D1B2A`
- Deep Blue `#1C3F6E`
- Electric Blue `#378ADD`
- Signal Orange `#F5800A`
- Slate Grey `#6B7280`
- Off White `#F2F4F7`
- Green is excluded from the identity.

## Interactive background
The circuit network is intentionally dim. Clicking/tapping near a trace activates that connected path, shows a travelling Signal Orange pulse, then fades it back down.

## GitHub Pages
Publish the `main` branch from `/ (root)` in **Settings → Pages → Build and deployment**.

## Future versions
Update `VERSION` and `CHANGELOG.md` with every website release. Keep the version visible in the footer so future updates can be tracked.

## GitHub Pages upload

**Important:** This ZIP is packaged with the website files at the ZIP root. After extracting it, upload the **contents of this folder** to the root of the `labnextdoor` repository. Do not upload the ZIP itself and do not flatten the `css/`, `js/`, or `assets/` folders.

The repository root should contain:

```text
index.html
css/style.css
js/site.js
js/circuit-background.js
assets/favicon.jpg
assets/logo/lnd-circle-3d.jpg
assets/logo/lnd-primary-3d.jpg
assets/icons/lnd-puzzle-3d.jpg
README.md
CHANGELOG.md
VERSION
sitemap.xml
robots.txt
```
