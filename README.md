# Drone Drop

A one-button-at-a-time catch game in the spirit of Game & Watch *Parachute*. A drone drops parcels, you slide a delivery van to catch them, and a pelican on the right edge causes trouble. From level 30 you fly a plane through the sky. 60 levels across 17 worlds.

Single self-contained `index.html` (HTML5 canvas, no build step, no dependencies besides Google Fonts). Portrait phone first (390 x 844 logical scene, scaled to fit), playable on desktop.

## Run it

Play it online: https://kenkwan22.github.io/drone-drop/ (GitHub Pages, served from the `main` branch).

Teaser page for the game (screenshots, live gameplay, store buttons): https://kenkwan22.github.io/drone-drop/teaser/ . The App Store and Google Play buttons say "Coming soon" until you paste the store links into `STORES` at the bottom of `teaser/index.html`. Made by Mont Saba Works.

Or open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Controls: on-screen left/right buttons, drag, arrow keys or A/D. Esc or P pauses.

## Worlds and levels

| Levels | World |
|---|---|
| 1-3 | Harbor Town |
| 4-6 | New York |
| 7 / 8 | London / Paris |
| 9-18 | Sydney, Los Angeles, Egypt, Dubai, Saudi Arabia, Tokyo, Mount Fuji, China, Hawaii, Tropical Paradise (one level each) |
| **19-24** | **Volcano Island** (erupting volcano, lava rivers, ash column, embers) |
| **25-27** | **Neon City 2099** (cyberpunk) |
| 28-29 | Chrome Harbor (futuristic port) |
| **30-34** | **Cloud Highway** (flying begins) |
| 35-39 | Sky City |
| 40-44 | Stratosphere |
| 45-49 | Thunder Alley |
| 50-54 | Earth Orbit |
| 55-60 | Deep Space |

Each level cycles through times of day and mirrors alternate levels, so every one of the 60 backdrops is different. The first eight levels (the free ones) show four worlds.

## Flying levels (30-60)

From level 30 the game moves into the sky. There is no sea or deck: the drone drops parcels in open air and **your vehicle is now a plane** that catches them in a hopper on top, with exactly the same catch size and height as the van. The plane changes every ten levels: **biplane (30-39), jet (40-49), space plane (50-60)**, painted in the colours of whichever vehicle you chose in the Garage. The sea hazards are gone (no tides, no oil), and **other aircraft take over from the pelican and seagulls**: a ! appears at the screen edge, then a jet tears across at a parcel's height and knocks it sideways, helicopters and prop planes cross the sky, and decoy balloons replace the fish. Storms, lightning, the rogue drone and the water cannon all still work.

**Boss alien (levels 30, 36, 42, 48, 54, 60).** A flying saucer hovers in the distance, flashes a warning, then lands an alien in a bubble helmet on top of the drone. A green tractor ring and a STEALING! meter fill up while the drone lurches around unpredictably. If the meter fills, the drone is stolen (you lose a life, and it flies back in a moment later). Spray him three times to blast him off.

**Boss ape (levels 10, 16, 22, 28).** A giant ape wades in from the sea, roars, leaps up, grabs the drone's skid and swings from it like a pendulum, so parcels leave at unpredictable angles. Spraying him makes him let go sooner.

**Clouds (level 25+).** Big puffy clouds drift across and hide the parcels inside them; they come more often once you are flying.

## The ending

Clear level 60 and the **Drone Champion** finale plays: fireworks (rockets that burst into spheres and perfect rings), confetti, a rotating sunburst, a golden trophy with a crowned champion drone on top, the tamed ape cheering on one side and the pelican in a party hat on the other. The panel shows your final score, total stars out of 180 and a rank (Rookie Pilot, Ace Courier, Sky Captain, Grand Ace, Legend of the Skies). You can share your score, roll the credits, replay any level, and you unlock the **Champion Van** (purple with a gold trophy on the roof) in the Garage. The title screen shows a trophy badge from then on.

## Difficulty

Everything lives in `levelCfg()` and `CONFIG` at the top of `index.html`.

- Levels 1-3: gentle. Levels 1 and 2 start a little quicker (faster drops and drone) so they do not drag. One parcel at a time on level 1, two from level 2. Level 4 brings the pelican, seagulls and your water cannon.
- Level 6 onward: it bites. Wind gusts, then mixed fall speeds (7), bombs (10), rapid double drops (18), a slippery deck (25) and flickering stealth parcels (35).
- The drone never plans an impossible drop: it checks that the van can reach each parcel in time (`violation()`).
- Delivery target per level: `14 + floor(level * 0.8)` (14 at level 1, 48 at most), so a level takes roughly a minute. Difficulty peaks around level 45-50, then eases off: level 55 onward plays about like level 30, and bosses after level 50 are milder and rarer (60). A heart drops about every 12 deliveries while you are down a life. Stars: 3 for no lives lost, 2 for one, 1 otherwise.

The pelican strikes every 14-22 s early on and every 4-16 s late (`pelGap`), and from level 10 both the pelican and the seagulls come about 25-40% more often (`birdGap()`), easing off again after level 50. From level 4 about half its events are parcel snatches (rising to 75%), and from level 15 a snatch can chain into a second parcel. Fish runs drop one fish, then two from level 8 and three from level 20. A parcel already over the van when the pelican reaches it is saved.

Hazards, all tunable in `levelCfg()` and `hzGap()`: seagulls that knock parcels sideways or steal them (level 4), tide surges that shove the van (5), oil slicks that make it skid (6), a rogue drone that drops junk crates you must not catch (8), lightning with a glowing warning zone that stuns the van (9) and fog banks that hide parcels (12). From level 7 every hazard comes round faster.

**Storms (level 15+).** A storm rolls in with a "STORM INCOMING" warning and big chevrons showing the direction, then a gale blows parcels sideways across the screen (up to 120-200 px/s) instead of straight down. The drone aims upwind so it is always winnable. From level 20 storms come roughly twice as often, last 7-10 s and can swing round mid-storm ("WIND TURNS!"). They ease off after level 50.

**Water cannon.** From level 4 a SPRAY button (Space, W or Up on a keyboard) fires a 3-shot tank that refills every 5 s. It auto-aims at the pelican, a seagull near a parcel, the rogue drone or the ape. During TURBO it fires automatically with no limit.

Extras: golden parcels (+50), heart (+1 life), slow-mo and magnet bubbles.

## Garage

Six cosmetic vehicles, unlocked by total stars (see `VEHICLES` in `index.html`): Delivery Van (0), City Taxi (8), Ice-Cream Van (20), Fire Truck (40), Food Truck (70), Golden Van (110). They share one size, catch bin and catch width, so choosing one never changes difficulty. Open the Garage from the title screen, or from the "new ride unlocked" banner on the level-clear screen.

## Paywall

Levels 1-8 are free. Levels 9-60 are the **World Tour**, a one-time purchase of A$6 (Australian dollars) (`CONFIG.billing`).

**The plan is the app stores.** The repo is wrapped with Capacitor (`android/`, `ios/`), and in the apps the purchase goes through Apple / Google in-app purchase via RevenueCat, which is the source of truth for the unlock (refunds re-lock, Restore Purchases works, the price shown is localised). Full steps, accounts and checklists are in [`docs/APP_STORE.md`](docs/APP_STORE.md).

The website (GitHub Pages) is a free demo: levels 1-8, and the paywall says the full game is coming to the apps. A web checkout path still exists (`CONFIG.billing.checkoutUrl` and `verifyUrl`, e.g. Stripe), but a static page cannot safely confirm a payment by itself, so it is off by default and the build is fail-closed. The "Test unlock" button only appears on `localhost` and home-network addresses.

## Layout of the code

`index.html` is split into labelled sections: config, utils, save (try/catch localStorage), billing, audio (simple beeps), worlds and levels, background art (cached off-screen per level, cross-faded on level-up), sprites, game logic (fixed 60 Hz step, dt clamped to 50 ms), render, screens/UI, input, boot. Game logic and rendering are separate so a Classic LCD renderer can be added as a second renderer over the same state.

## Status against the build brief

Done: modern game, all five states plus level select, level clear, paywall and victory screens, free-moving van, combo and the TURBO bonus (8 s: van 65% faster, double score, and a water cannon that sprays the pelican and rogue drone; replaces the brief's BIG VAN), pelican snatch and fish, pause, best score persistence, reduced-motion handling.

Not yet: the retro Classic LCD skin (brief step 8, marked optional).

Brief: `docs/Drone Drop build brief.docx`.
