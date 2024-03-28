# YTSCR

YTSCR (YouTube Scraper) is a versatile tool designed for scraping YouTube channels' videos, streams, shorts, and video information.

## Features

- **Efficiency**: YTSCR offers fast scraping capabilities, allowing for quick retrieval of desired data.
- **User-Friendly**: With its intuitive interface, YTSCR is easy to use, catering to both novice and experienced users.
- **Minimal Dependencies**: YTSCR is built with minimal dependencies, ensuring a streamlined experience for integration into various projects.

## Usage

Below is a straightforward example demonstrating how to utilize YTSCR to retrieve videos from a YouTube channel using TypeScript:

```typescript
import { getVideos } from 'ytscr';

async function main() {
  console.log(await getVideos('@MrBeast'));
}

main();
```

While YTSCR primarily supports ESM/ModernJS, it can also be used with JavaScript. However, please note that JavaScript usage is limited to environments supporting ESM/ModernJS.

```javascript
import { getVideos } from 'ytscr';

async function main() {
  console.log(await getVideos('@MrBeast'));
}

main();
```
