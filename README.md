# Drone Drop

A one-button-at-a-time catch game in the spirit of Game & Watch *Parachute*. A drone drops parcels, you slide a delivery van to catch them, and a pelican on the right edge causes trouble. 86 levels across 17 worlds.

Single self-contained `index.html` (HTML5 canvas, no build step, no dependencies besides Google Fonts). Portrait phone first (390 x 844 logical scene, scaled to fit), playable on desktop.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Controls: on-screen left/right buttons, drag, arrow keys or A/D. Esc or P pauses.

## Worlds and levels

| Levels | World | Levels | World |
|---|---|---|---|
| 1-4 | Harbor Town | 40-44 | **Neon City 2099** (cyberpunk) |
| 5-8 | New York | 45-49 | **Chrome Harbor** (futuristic) |
| 9-13 | London | 50-54 | Saudi Arabia |
| 14-18 | Paris | 55-59 | Tokyo |
| 19-23 | Sydney | 60-64 | Mount Fuji |
| 24-28 | Los Angeles | 65-69 | China |
| 29-33 | Egypt | 70-74 | Hawaii |
| 34-39 | Dubai | 75-80 | Tropical Paradise |
| | | 81-86 | Sky City |

Each level cycles through five times of day (dusk, night, sunrise, day, golden hour; the cyberpunk worlds stay mostly dusk and night) and mirrors alternate levels, so every one of the 86 backdrops is different. From level 40 the look turns futuristic: Neon City has a giant holographic AI head, a monorail, flying cars and neon signs in the rain, and Chrome Harbor has a glowing ring gate, a maglev, a space elevator and hover boats. The art gets richer as you go: a harbour with a lighthouse, then landmarks (Statue of Liberty, Big Ben, Eiffel Tower, the Hollywood sign and Santa Monica pier, the Giza pyramids and Sphinx, Burj Khalifa, Kingdom Centre, Opera House, Tokyo Tower, Mount Fuji, pagodas, Diamond Head, a volcano island) and finally a floating sky city under an aurora.

## Difficulty

Everything lives in `levelCfg()` and `CONFIG` at the top of `index.html`.

- Levels 1-3: gentle. One to two parcels in flight, slow fall. Level 4 brings the pelican, seagulls and your water cannon.
- Level 6 onward: it bites. Wind gusts, then mixed fall speeds (7), bombs (10), rapid double drops (18), a slippery deck (25) and flickering stealth parcels (35).
- The drone never plans an impossible drop: it checks that the van can reach each parcel in time (`violation()`).
- Delivery target per level: `14 + floor(level * 0.8)` (14 at level 1, 48 at most), so a level takes roughly a minute. Difficulty peaks around level 45-50, then eases off: level 55 onward plays about like level 30, and bosses after level 50 are milder and rarer (60, 70, 75). A heart drops about every 12 deliveries while you are down a life. Stars: 3 for no lives lost, 2 for one, 1 otherwise.

The pelican strikes every 14-22 s early on and every 4-16 s late (`pelGap`), and from level 10 both the pelican and the seagulls come about 25-40% more often (`birdGap()`), easing off again after level 50. From level 4 about half its events are parcel snatches (rising to 75%), and from level 15 a snatch can chain into a second parcel. Fish runs drop one fish, then two from level 8 and three from level 20. A parcel already over the van when the pelican reaches it is saved.

Hazards, all tunable in `levelCfg()` and `hzGap()`: seagulls that knock parcels sideways or steal them (level 4), tide surges that shove the van (5), oil slicks that make it skid (6), a rogue drone that drops junk crates you must not catch (8), lightning with a glowing warning zone that stuns the van (9) and fog banks that hide parcels (12). From level 7 every hazard comes round faster.

**Water cannon.** From level 4 a SPRAY button (Space, W or Up on a keyboard) fires a 3-shot tank that refills every 5 s. It auto-aims at the pelican, a seagull near a parcel, the rogue drone or the ape. During TURBO it fires automatically with no limit.

**Boss ape.** On every fifth level from 20 to 50 (then 60, 70, 80 and 86, gentler) a giant ape wades in from the sea, roars, leaps up and grabs the drone's skid. He hangs there swinging like a pendulum with random lurches, dragging the drone from side to side, and parcels leave with the drone's sideways speed, so their angle is hard to predict. Spraying him makes him let go sooner.

Extras: golden parcels (+50), heart (+1 life), slow-mo and magnet bubbles.

## Garage

Six cosmetic vehicles, unlocked by total stars (see `VEHICLES` in `index.html`): Delivery Van (0), City Taxi (8), Ice-Cream Van (20), Fire Truck (40), Food Truck (70), Golden Van (110). They share one size, catch bin and catch width, so choosing one never changes difficulty. Open the Garage from the title screen, or from the "new ride unlocked" banner on the level-clear screen.

## Paywall

Levels 1-8 are free. Levels 9-86 are the **World Tour**, a one-time $15 purchase (`CONFIG.billing`).

A static page cannot safely confirm a payment by itself, so the build ships fail-closed:

- `Billing.buy()` sends the player to `CONFIG.billing.checkoutUrl` (for example a Stripe Payment Link) with their `client_reference_id`.
- `Billing.restore()` asks `CONFIG.billing.verifyUrl?client_id=...`, which must answer `{"paid": true}`. Wire it to a small server or function that records the Stripe webhook.
- With both URLs empty nothing unlocks, except the "Test unlock" button, which only appears on `localhost`.
- The unlock flag is stored in `localStorage`, so it can be edited by a determined player. For a store release, move to Apple/Google in-app purchase (required for digital goods in app stores) via Capacitor plus RevenueCat, and keep the same `Billing` interface.

## Layout of the code

`index.html` is split into labelled sections: config, utils, save (try/catch localStorage), billing, audio (simple beeps), worlds and levels, background art (cached off-screen per level, cross-faded on level-up), sprites, game logic (fixed 60 Hz step, dt clamped to 50 ms), render, screens/UI, input, boot. Game logic and rendering are separate so a Classic LCD renderer can be added as a second renderer over the same state.

## Status against the build brief

Done: modern game, all five states plus level select, level clear, paywall and victory screens, free-moving van, combo and the TURBO bonus (8 s: van 65% faster, double score, and a water cannon that sprays the pelican and rogue drone; replaces the brief's BIG VAN), pelican snatch and fish, pause, best score persistence, reduced-motion handling.

Not yet: the retro Classic LCD skin (brief step 8, marked optional).

Brief: `docs/Drone Drop build brief.docx`.
