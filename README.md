# Zen Thumbnails

A lightweight Firefox/Zen Browser extension designed to de-clutter the YouTube experience. It replaces every thumbnail on the site with a deterministic, muted color palette, effectively neutralizing clickbait and engagement-bait tactics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Why?
Recommendation algorithms are optimized for time spent on-site. This has created an environment where thumbnails are designed to be as eye-catching and distracting as possible. 

## Features
- **Deterministic Hashing:** The color for a video is calculated from its URL. If you refresh the page, the color stays the same for that specific video.
- **CSS-First Injection:** Original thumbnails are hidden via CSS before the page even finishes loading to prevent "flickering."

## Installation

### For Users
1. Download the extension from [Mozilla Add-ons](YOUR_LINK_HERE).
2. Click "Add to Firefox/Zen".

### For Developers
1. Clone this repository.
2. Open Zen/Firefox and go to `about:debugging`.
3. Click "This Firefox" -> "Load Temporary Add-on".
4. Select the `manifest.json` file in this folder.

## Technical Details
The extension uses a simple 16-color palette of low-saturation hues. The hashing function converts the video URL into an integer, which then selects a color from the array. This ensures that the replacement is instantaneous and requires zero external data.

## Privacy
This extension does not collect, store, or transmit any user data. It operates entirely within your browser.

## License
MIT
