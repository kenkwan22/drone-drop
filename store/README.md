# Store assets

| Folder / file | Use |
|---|---|
| `apple-6.9in-1320x2868/` | App Store screenshots, iPhone 6.9-inch (exactly 1320 x 2868, no alpha) |
| `google-phone-1080x2160/` | Google Play phone screenshots (1080 x 2160, within Google's 2:1 limit) |
| `google-feature-graphic-1024x500.png` | Google Play feature graphic (1024 x 500, no alpha) |

The screenshots are real frames from the game (levels 3, 10, 20, 25, 30, 36 and 45, plus title, paywall and garage), captured with headless Chrome at the exact pixel sizes. To refresh them after a visual change, serve the repo on `localhost` (the capture needs the dev hook `window.__dd`, which only exists on localhost) and drive the game with the Chrome DevTools protocol.
