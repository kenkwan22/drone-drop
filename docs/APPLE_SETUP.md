# Setting up Drone Drop in Apple's tools (step by step)

Do these in order. Each step says what to click and exactly what to type. Where something is a choice only you can make, it says so.

Already done in the repo for you: bundle ID `com.kenkwan22.dronedrop`, iPhone-only, portrait-only, no special encryption (so Apple will not ask export-compliance questions), app icon and splash artwork in `assets/`, and the in-app purchase code (RevenueCat).

---

## Step 1. Enrol in the Apple Developer Program

1. Go to **developer.apple.com/programs/enroll** and sign in with your Apple ID (use one you want to keep for business; turn on two-factor authentication).
2. Choose how to enrol:
   - **Individual / sole proprietor.** Approved quickly (often same day). Your own legal name appears as the seller on the App Store.
   - **Organization.** The seller shows as your business name (for example Mont Saba Works). You need a legal entity and a free **D-U-N-S number** (apply at developer.apple.com/enroll/duns-lookup); allow days to weeks.
3. Pay the annual fee (about A$149). Wait for the "Welcome to the Apple Developer Program" email.

## Step 2. Agreements, tax and banking (needed before you can sell anything)

1. Open **appstoreconnect.apple.com** and sign in.
2. Go to **Business** (older layout: *Agreements, Tax, and Banking*).
3. Accept the **Paid Apps Agreement**.
4. Add your **bank account** (Australian BSB and account number) and complete the **tax forms** (your ABN or TFN details).
5. Apply for the **App Store Small Business Program** (Apple takes 15% instead of 30% while you earn under US$1 million a year).
6. Under **Digital Services Act**, declare whether you are a **trader**. If you sell for business purposes, answer yes; Apple then shows your contact details on the EU store page.

Until the Paid Apps Agreement shows **Active**, the in-app purchase cannot be tested.

## Step 3. Register the app ID (developer portal)

1. Go to **developer.apple.com/account**, then *Certificates, Identifiers & Profiles*, then *Identifiers*, then the **+** button.
2. Choose **App IDs**, then **App**, then Continue.
3. Description: `Drone Drop`. Bundle ID: choose **Explicit** and type exactly `com.kenkwan22.dronedrop`.
4. In Capabilities, tick **In-App Purchase**. Continue, then Register.

(Xcode's automatic signing can also create this for you in step 8. Doing it here first makes the name match.)

## Step 4. Create the app in App Store Connect

1. appstoreconnect.apple.com, then **Apps**, then **+**, then **New App**.
2. Fill in:
   - **Platforms:** iOS
   - **Name:** `Drone Drop` (up to 30 characters, must be unique across the App Store; if taken, try `Drone Drop: Parcel Catch`)
   - **Primary Language:** English (Australia)
   - **Bundle ID:** pick `Drone Drop - com.kenkwan22.dronedrop`
   - **SKU:** `drone-drop-001` (any private reference, never shown to players)
   - **User Access:** Full Access
3. Create.

## Step 5. Create the paid unlock (in-app purchase)

1. In your app, left menu, **Monetization**, then **In-App Purchases**, then **+**.
2. Fill in:
   - **Type:** Non-Consumable
   - **Reference Name:** `World Tour`
   - **Product ID:** `drone_drop_world_tour` (must match exactly; it cannot be changed later)
3. **Price Schedule:** base country **Australia**. Apple's price points are fixed, so pick **A$5.99**. Apple converts it for other countries.
4. **Availability:** all countries.
5. **App Store Localization (English, Australia):**
   - Display name: `World Tour`
   - Description: `Unlock levels 9 to 60: every world, boss and plane.`
6. **Review Information:** upload a screenshot of the paywall (the screen with the "Unlock all levels" button) and add the note: `Shown after completing level 8, or by tapping any locked level in the Levels screen.`
7. Save. The status will read *Ready to Submit*. For the first release you attach it to the app version in step 12.

## Step 6. Connect RevenueCat

1. Create a free account at **revenuecat.com**, then create a **Project** named `Drone Drop`.
2. **Apps**, then add an **iOS** app: App name `Drone Drop`, Bundle ID `com.kenkwan22.dronedrop`.
3. RevenueCat asks for an **In-App Purchase Key**. Create it in App Store Connect: **Users and Access, Integrations, In-App Purchase, Generate**. Download the `.p8` file (you can only download it once), and paste its Key ID and Issuer ID into RevenueCat, then upload the `.p8`.
4. In RevenueCat: **Products**, add `drone_drop_world_tour`. **Entitlements**, create one named exactly `world_tour` and attach the product. **Offerings**, open `default`, add a package of type **Lifetime** and choose the product.
5. Copy the iOS **Public SDK key** (starts with `appl_`). Open `index.html` in the repo and paste it here, then save and commit:

   ```js
   revenueCat: { iosKey: 'appl_XXXXXXXX', androidKey: '', entitlement: 'world_tour' }
   ```

   Public SDK keys are designed to be public; it is safe to store them in the repo.

## Step 7. Get the project onto a Mac

You need a Mac with **Xcode** (free in the Mac App Store, about 15 GB). No Mac? Rent one by the hour (for example macincloud.com), or ask me about Codemagic, which builds in the cloud from the GitHub repo.

On the Mac, in Terminal:

```bash
git clone https://github.com/kenkwan22/drone-drop.git
cd drone-drop
npm install
sudo gem install cocoapods     # once, if you don't have CocoaPods
npm run assets                 # makes every icon and splash size from assets/icon.png and assets/splash.png
npm run ios                    # copies the game in and opens Xcode
```

(If `npm run assets` fails, tell me the error message and I will fix it.)

## Step 8. Build in Xcode

1. In the left sidebar click the blue **App** project, then the **App** target.
2. **Signing & Capabilities:** tick *Automatically manage signing*, choose your **Team**. Bundle Identifier should read `com.kenkwan22.dronedrop`.
3. Click **+ Capability** and add **In-App Purchase**.
4. **General** tab: Version `1.0`, Build `1`. Deployment target iOS 15 or later is fine. Device: iPhone.
5. At the top choose the destination **Any iOS Device (arm64)**.
6. Menu **Product, Archive**. When the Organizer opens: **Distribute App, App Store Connect, Upload**, accept the defaults.
7. After 10 to 30 minutes the build appears in App Store Connect under **TestFlight** (you get an email).

## Step 9. Test on your own iPhone with TestFlight

1. App Store Connect, **TestFlight**, **Internal Testing**, **+** to make a group, add yourself, add the build.
2. On your iPhone install the free **TestFlight** app, accept the invite, and install Drone Drop.
3. Test: play levels 1 to 8; reach the paywall; the price should read **A$5.99** (the store price); buy it (TestFlight purchases are free sandbox purchases); levels 9 and up unlock; delete the app, reinstall, tap **Restore purchase** and confirm levels stay unlocked; try with airplane mode on.
4. Check the top of the screen: the score and lives should sit below the notch, not under it.

## Step 10. The store page (version 1.0)

In App Store Connect, **Distribution**, **iOS App**, version **1.0 Prepare for Submission**. Copy and paste the following.

- **Promotional Text (170 max):** `Catch every parcel, outsmart a thieving pelican, wrestle a giant ape, then take off in a plane through storms and space. 60 levels, free to try.`
- **Subtitle (30 max):** `Catch parcels, fly the sky`
- **Keywords (100 max, no spaces after commas):** `drone,parcel,catch,arcade,pelican,plane,delivery,casual,reflex,boss,storm,space,van,gorilla,flying`
- **Description:**

  ```
  A drone drops the parcels. You slide the van to catch them. Easy? Not with a thieving pelican, mischievous seagulls, wind and lightning around.

  CATCH, COMBO, TURBO
  Catch five in a row to fire up turbo: faster, double points and a water cannon to blast the pelican away.

  60 LEVELS, 20+ WORLDS
  From a sunset harbour to London, Paris, Sydney, Los Angeles, Egypt, Dubai, Saudi Arabia, Tokyo, Mount Fuji, China and Hawaii, then a volcano island and a neon cyberpunk city.

  TAKE TO THE SKY
  From level 30 your van becomes a plane: a biplane, then a jet, then a space plane. Fly above the clouds, through storms, past a space station and into deep space.

  BOSSES AND SURPRISES
  A giant ape swings from the drone. An alien sits on top and tries to steal it. Storms blow parcels sideways, clouds hide them, and enemy aircraft knock them away.

  COLLECT RIDES
  Earn stars to unlock a taxi, an ice-cream van, a fire truck and more.

  FREE TO TRY
  Levels 1 to 8 are free. One purchase unlocks the whole World Tour. No ads.

  Finish level 60 for fireworks and a golden Drone Champion trophy.

  A game by Mont Saba Works.
  ```
- **Support URL:** `https://kenkwan22.github.io/drone-drop/support/`
- **Marketing URL:** `https://kenkwan22.github.io/drone-drop/teaser/`
- **Copyright:** `2026 Mont Saba Works` (or your own name if you enrolled as an individual).
- **Privacy Policy URL:** `https://kenkwan22.github.io/drone-drop/privacy/`
- **Category:** Primary **Games**, subcategory **Arcade**; secondary **Casual**.
- **Screenshots:** ready in `store/apple-6.9in-1320x2868/` (10 PNGs, exactly 1320 x 2868, the **6.9-inch iPhone** size; Apple scales them for smaller iPhones). Upload them in file-name order; Apple allows up to 10. The paywall shot (09) shows A$5.99; if you change the price, re-run the capture.
- **Build:** click **+** and choose the build you uploaded in step 8.
- **In-App Purchases and Subscriptions:** click **+** and add `World Tour` (first submission only; attach it here).

## Step 11. Questionnaires

- **Age Rating:** answer *None* to everything except **Cartoon or Fantasy Violence: Infrequent or Mild** (bombs, an ape, lightning). Expect a low rating (4+ or 9+).
- **App Privacy:** the game keeps progress on the device only. RevenueCat records an anonymous purchase ID. Follow RevenueCat's page "Apple App Privacy" to tick the exact boxes (generally *Purchases* and *Identifiers: User ID*, used for *App Functionality*, not used for tracking). Do not tick tracking.
- **Content Rights:** you own or have rights to all the content (true: it is original).
- **Export compliance:** already answered by the build (no special encryption).
- **Advertising Identifier (IDFA):** No.

## Step 12. Pricing, review notes and submit

1. **Pricing and Availability:** price the app **Free** (the unlock is the in-app purchase), all countries.
2. **App Review Information:** no sign-in required. Contact name, phone and email. In **Notes** paste:

   ```
   No login is needed. Levels 1 to 8 are free. To reach the paywall, complete level 8 or tap any locked level in the Levels screen. The single non-consumable in-app purchase "World Tour" (drone_drop_world_tour) unlocks levels 9 to 60. Restore Purchases is on the paywall screen. The game is original: all art, music and code are our own.
   ```
3. **Version Release:** choose *Manually release this version* so you control the launch day.
4. Click **Add for Review**, then **Submit for Review**.

Review usually takes 1 to 3 days. If Apple rejects it, read the message in Resolution Center, fix the one thing they name, and resubmit. First submissions are often bounced once for a small reason.

## After approval

- Paste the App Store link into `STORES.apple` at the bottom of `teaser/index.html` so the "Coming soon" button becomes a real link, and tell me so I can also add it to the game's title screen.
- To ship an update: change the game, `npm run sync`, raise the Build number in Xcode, archive and upload, then add the new build to a new version in App Store Connect.
