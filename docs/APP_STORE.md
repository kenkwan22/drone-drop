# Taking Drone Drop to the App Store and Google Play

The repo is already wrapped with [Capacitor](https://capacitorjs.com): `android/` and `ios/` projects exist, the web game is copied into them by `npm run sync`, and the A$6 World Tour purchase uses the stores' own in-app purchase through [RevenueCat](https://www.revenuecat.com) (free until you earn real revenue). What is left is accounts, store listings, keys and builds, all of which need you.

## 0. Test it on your phone right now (no store needed)

1. Open https://kenkwan22.github.io/drone-drop/ on the phone.
2. **iPhone (Safari):** Share button, then *Add to Home Screen*. **Android (Chrome):** menu, then *Install app* or *Add to Home screen*.
3. It launches full screen like an app. Levels 1-8 are playable; levels 9-60 need the store purchase (below).
4. To try the later levels on the phone before the stores are ready, run the game on your PC (`npx serve .`), open it on the phone with the PC's address on your home Wi-Fi (e.g. `http://192.168.1.20:3000`), and a *Test unlock* button appears on the paywall. It only appears on localhost and home-network addresses, never on the public site.

## 1. Accounts and costs

| What | Cost | Why |
|---|---|---|
| Apple Developer Program | US$99 / year | needed for iOS, TestFlight and in-app purchases |
| Google Play Console | US$25 once | needed for Android |
| RevenueCat | free tier | checks purchases for you, so nobody can fake an unlock |
| A Mac with Xcode (or a cloud Mac such as Codemagic) | - | iOS apps can only be built with Xcode |

## 2. The app ID (a name you choose, not your email)

Your **account email** is only what you sign in to Apple Developer, Google Play and RevenueCat with. The **app ID** is a different thing: a reverse-domain name that identifies the app, such as `com.kenkwan22.dronedrop`. It is not an email and nobody issues it to you: you invent it, and both stores just check that nobody else has already used it. You do not need to own a domain.

`capacitor.config.json` is set to **`com.kenkwan22.dronedrop`** and the `android/` and `ios/` projects were generated with it. It becomes permanent once you create the store listings, so change it first if you want a different one: edit `appId`, delete the `android/` and `ios/` folders, and run `npm run build:web && npx cap add android && npx cap add ios` again. (Later the stores also show their own numbers for your app, such as Apple's numeric *Apple ID* in App Store Connect. Those are labels the store gives you, and you never type them into the project.)

## 3. Create the purchase

The store sells **one non-consumable (one-time) product** that unlocks levels 9-60. Set the base price to **A$6 (AUD)**. Google Play lets you type any price, so A$6.00 works there. Apple uses fixed price points, so pick the closest one it offers (A$5.99 matches best) (the app shows each player's local price automatically).

1. **App Store Connect:** create the app, then *Monetization, In-App Purchases*: type *Non-Consumable*, product ID `drone_drop_world_tour`, price A$6 (AUD), name "World Tour", description "Unlock levels 9 to 60", add a review screenshot of the paywall.
2. **Play Console:** create the app, then *Monetize, In-app products*: product ID `drone_drop_world_tour`, price A$6 (AUD), active.
3. **RevenueCat dashboard:** create a project, add an iOS app and an Android app, import the two products, create an **entitlement named `world_tour`** and attach both products, create an **offering** `default` with a *Lifetime* package containing the product.
4. Copy the two **public SDK keys** (one for iOS, one for Android) into `CONFIG.billing.revenueCat` near the top of `index.html`:

   ```js
   revenueCat: { iosKey: 'appl_...', androidKey: 'goog_...', entitlement: 'world_tour' }
   ```

   These keys are meant to be public. Until they are filled in, the apps fail closed: nothing unlocks.

## 4. Build

```bash
npm install
npm run sync            # copies index.html, manifest and icons into www/ and into both native projects
npm run assets          # optional: generates every icon and splash size from assets/icon.png and assets/splash.png
```

**Android** (Windows is fine): install Android Studio, then `npm run android`. In Studio: *Build, Generate Signed App Bundle*, create a keystore and **back it up** (losing it means you can never update the app). Upload the `.aab` to Play Console *Internal testing*, add yourself under *License testers*, and install from the testing link to try real (free for testers) purchases.

**iOS** (needs a Mac): `npm run ios` opens Xcode. Select the *App* target, *Signing & Capabilities*: pick your team, and add the **In-App Purchase** capability. *Product, Archive, Distribute* to TestFlight. Create a *Sandbox tester* in App Store Connect to test the purchase without paying.

## 5. Store listing checklist

- App name, subtitle, description, keywords (description draft: "Catch every parcel. Outsmart the pelican. 60 levels from sunny harbours to a neon cyberpunk city, with storms, seagulls, a giant ape and a drone champion's trophy at the end.")
- **Icon:** `assets/icon-1024.png` is ready (opaque, no transparency, as Apple requires).
- **Screenshots:** iPhone 6.7" and 5.5", plus Android phone. Take them from the running game (levels 1, 15 storm, 20 ape, 40 neon, and the champion finale).
- **Privacy policy URL** (required by both stores). The game stores progress only on the device; RevenueCat records an anonymous ID for purchases. Declare that in Apple's *App Privacy* and Google's *Data safety* forms.
- **Age rating:** cartoon slapstick only (bombs, a gorilla, lightning); no gambling, chat or ads.
- **Support URL and contact email.**
- Make sure **Restore Purchases** is visible on the paywall (it is) because Apple rejects apps without it.

## 6. Rules to keep in mind

- Inside the iOS and Android apps, the unlock **must** use the store's in-app purchase (Apple rule 3.1.1, Google's Payments policy). The code already does this: in the apps `Billing.buy()` never uses the web checkout link.
- The stores take a cut (15% under the small-business programs for both Apple and Google if you earn under US$1M a year; 30% otherwise). Apply for those programs.
- The free website (GitHub Pages) can stay as a free demo of levels 1-8 with a "get the full game in the app" message.
- Refunds work automatically: RevenueCat reports the entitlement as gone and the app locks levels 9-60 again on the next launch.

## 7. Releasing updates

Edit `index.html`, then `npm run sync`, bump the version/build number (Xcode and `android/app/build.gradle`), and upload a new build. Web-only fixes can be shipped instantly by pushing to GitHub, but the native apps contain a copy of the game and update only when you submit a new build.
