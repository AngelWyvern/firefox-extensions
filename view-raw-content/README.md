# <p align=center>View Raw Content</p>

A basic browser extension that allows you to inspect an HTTP response from a URL as raw content.

I first made this as a [Chrome extension](https://github.com/AngelWyvern/view-raw-ext) since some websites would force downloads rather than display the raw file in the browser, requiring extra steps just to view it. I've now ported this over to Firefox as I'm switching browsers, and decided to add support for more than just text files.

### Supported MIME types

|      Kind       |           Match           |
|-----------------|---------------------------|
| All text files  | `text/*`, `application/*` |
| All image files | `image/*`                 |
| All audio files | `audio/*`                 |
| All video files | `video/*`                 |

Any unrecognized filetypes will fall back to being read as a text file.