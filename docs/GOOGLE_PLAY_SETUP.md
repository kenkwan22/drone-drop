# Setting up Drone Drop in Google Play (step by step)

Already done for you: package name `com.kenkwan22.dronedrop`, a signed release bundle (`android/app/build/outputs/bundle/release/app-release.aab`, built by `cd android && gradlew bundleRelease`), 512 px icon in `assets/icon-512.png`, and the in-app purchase code (RevenueCat, product `drone_drop_world_tour`, price A$5.99).

Google's console changes its menu names from time to time. If a label below is not where I say, use the search box at the top of Play Console.

---

## Step 0. Back up your signing key

Copy the folder `C:\Users\kenkw\drone-drop-keys` (the `.jks` file and `keystore.properties`) to a password manager and an external drive. Do it before anything else.

## Step 1. Create the developer account

1. Go to **play.google.com/console/signup** and sign in with a Google account you want to keep for the business.
2. Choose **Personal** or **Organization**. An organization account needs a D-U-N-S number, as at Apple. A personal account is faster but has the testing rule in step 9.
3. Pay the one-time US$25 fee and verify your identity (government ID, and a phone). Verification can take a few days.
4. Fill in the public developer name (Mont Saba Works if you enrol as an organization; your own name for a personal account) and a contact email and website. Both show on your store page.

## Step 2. Set up payments (needed for paid items)

1. In Play Console, open **Setup, Payments profile** (or *Payments settings*) and create a **merchant account**: legal name and address, bank account (Australian BSB and account number), and tax details.
2. Join the **15% service fee programme**. Google charges 15% (not 30%) on the first US$1 million per year.

## Step 3. Create the app

1. **Home, Create app**.
2. **App name:** `Drone Drop`. **Default language:** English (Australia). **App or game:** Game. **Free or paid:** Free (the unlock is an in-app purchase). Tick the declarations (developer program policies, US export laws) and create.

## Step 4. Do the "Set up your app" tasks

Play Console shows these as a checklist. Answers for this game:

- **Privacy policy:** `https://kenkwan22.github.io/drone-drop/privacy/`
- **App access:** *All functionality is available without special access* (no login).
- **Ads:** *No, my app does not contain ads.*
- **Content rating:** start the questionnaire, category **Game**. Answer **No** to everything except cartoon or fantasy violence (mild: bombs, an ape, lightning). Expect a low rating (Everyone or 7+).
- **Target audience:** choose **13 and over** (or 18 and over). Choosing under-13 triggers the Families policy, which adds extra rules. Not designed for children.
- **Data safety:** the game keeps progress on the device. RevenueCat collects an anonymous purchase ID. Declare *Purchase history* and *Device or other IDs*, used for *App functionality*, not shared for advertising. Follow RevenueCat's page "Google Play Data safety" for the exact boxes. Say data is encrypted in transit.
- **Government app, financial features, health features, news app:** all **No**.
- **Advertising ID:** the app does not use it (declare *No*).

## Step 5. Create the paid unlock

1. Open **Monetize, Products, In-app products** (the console may call these **One-time products**).
2. **Create product:**
   - **Product ID:** `drone_drop_world_tour` (cannot be changed later)
   - **Name:** `World Tour`
   - **Description:** `Unlock levels 9 to 60: every world, boss and plane.`
   - **Price:** set the default price to **A$5.99**. Google lets you type any price; other countries convert automatically.
3. **Activate** it. (A product can only be activated after an app bundle with the billing library has been uploaded in step 7; if the button is greyed out, come back after step 7.)

## Step 6. Connect RevenueCat to Google Play

1. In RevenueCat, **Apps, + New, Google Play**: name `Drone Drop`, package name `com.kenkwan22.dronedrop`.
2. RevenueCat needs a **service account** so it can check purchases. Follow RevenueCat's page "Google Play Store service credentials", which has you:
   - make a service account in Google Cloud and download its JSON key,
   - then in Play Console **Users and permissions, Invite new users**, enter the service account email, and give it *View app information*, *View financial data*, and *Manage orders and subscriptions*,
   - upload the JSON to RevenueCat, and tick the Pub/Sub notification option if offered.
   (Permissions can take up to 36 hours to take effect.)
3. In RevenueCat add the product `drone_drop_world_tour` under **Products**, attach it to the **entitlement** `drone_drop_pro`, and add it to the `default` **offering** as the Lifetime package (the same entitlement and offering the iOS app uses).
4. Copy the Android **Public SDK key** (starts with `goog_`). In `index.html`, near the top, set:

   ```js
   revenueCat: { iosKey: 'appl_...', androidKey: 'goog_XXXXXXXX', entitlement: 'drone_drop_pro' }
   ```

5. Rebuild: `npm run sync`, then `cd android` and `gradlew bundleRelease`. Raise `versionCode` in `android/app/build.gradle` first (each upload needs a higher number). The build needs the JDK 21 folder and the key folder from step 0.

## Step 7. Upload the first build

1. **Test and release, Testing, Closed testing, Create track** (call it `Testers`), then **Create new release**.
2. Choose **Use Play App Signing** (the default). Your key is the *upload key*; Google keeps the real signing key, so a lost upload key is recoverable.
3. Upload `app-release.aab`. Release name `1.0 (1)`. Release notes: `First test version.`
4. **Countries:** all, or just Australia to start.
5. **Save, Review release, Start rollout to Closed testing.**

## Step 8. Fill in the store listing

Go to **Grow users, Store presence, Main store listing**. Copy and paste:

- **Short description (80 max):** `Catch parcels, dodge a thieving pelican, then fly through storms and space.`
- **Full description (4000 max):**

  ```
  A drone drops the parcels. You slide the van to catch them. Easy? Not with a thieving pelican, mischievous seagulls, wind and lightning around.

  A HOMAGE TO THE CLASSICS
  Drone Drop is a homage to the original classic handheld games: one simple idea, quick reflexes and a score to beat. Easy to learn, hard to put down.

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
- **App icon:** `assets/icon-512.png` (512 x 512).
- **Feature graphic:** `store/google-feature-graphic-1024x500.png` (1024 x 500, required).
- **Phone screenshots:** `store/google-phone-1080x2160/` (10 PNGs, 1080 x 2160; Google needs at least 2 and shows up to 8, so upload files 01 to 08 or pick your favourites).
- **Category:** Game, **Arcade**. **Website:** `https://kenkwan22.github.io/drone-drop/teaser/`. **Contact email:** Play Console requires one here; use an address you are happy to show publicly. Privacy policy URL as above.

## Step 9. Closed test with real testers (new personal accounts)

At the time of writing, a **personal** developer account created after November 2023 must run a closed test with **at least 12 testers opted in for 14 days in a row** before it can apply for production access. (Organization accounts are exempt. Check Play Console, **Dashboard**, for the current numbers, as Google changes them.)

1. In the closed test track, **Testers, Create email list**, add the Gmail addresses of your testers (friends, family, anyone with an Android phone).
2. Copy the **opt-in link** and send it to them. Each tester opens it, taps **Become a tester**, then installs the app from Play.
3. Keep the testers opted in for the full 14 days. You will want a few who open the game now and then.
4. Add yourself under **Setup, License testing** so your test purchases are free: add your Gmail to the license testers list.
5. Test the full path on a real phone from the Play link: play to level 8, see the paywall (price shows A$5.99), buy it with a licence-tester account, confirm levels 9 and up unlock, then uninstall, reinstall and **Restore purchase**.

## Step 10. Apply for production, then publish

1. After the testing period, **Dashboard, Apply for production** and answer the questions about your test (what testers found, what you changed).
2. Google reviews the application (usually a few days). Then **Production, Create new release**, add the build (promote the tested one), and **Start rollout**.
3. First reviews typically take from a few hours to a few days. Fix any issue Google names in **Policy status** and resubmit.

## After it is live

- Put the Play Store link into `STORES.google` at the bottom of `teaser/index.html` and push, so the button on your teaser page works.
- To update: change the game, raise `versionCode` and `versionName` in `android/app/build.gradle`, run `npm run sync` and `gradlew bundleRelease` in `android/`, then create a new release and upload the new bundle.
