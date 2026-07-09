# MindEase for Her 🌸

Mental wellness app for women in STEM — mood journaling, guided breathing
exercises, peer support circles, and burnout self-checks.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. That's it — no build step needed for local dev.

## Project structure

```
src/
  components/
    BreathingBloom.jsx   ← signature motif: petal cluster used as section
                            marker (sm), loading state (md), and the actual
                            breathing-exercise pacer (lg, animated)
    Navigation.jsx        ← sidebar (desktop) / bottom tabs (mobile)
  pages/
    Home.jsx               onboarding + goal picker
    Journal.jsx             mood picker + tags + note → Firestore
    Exercises.jsx           breathing / grounding / body-scan with timers
    Community.jsx           peer support circles, anonymous posts
    Dashboard.jsx           mood trend chart (Recharts)
    Quiz.jsx                 burnout self-assessment
  App.jsx                  routes
  index.css                Tailwind layers + shared component classes
tailwind.config.js         design tokens (see below)
```

## Design tokens

| Token | Hex | Use |
|---|---|---|
| `blossom` | `#D6336C` | primary buttons, active nav state |
| `petal` | `#FFE9F0` | page background wash |
| `ink` | `#4A1D2E` | headings & body text (warm plum, not pure black) |
| `cream` | `#FFF9F6` | card surfaces |
| `sage` | `#7C9885` | calm / success states, tag selection |
| `spark` | `#E8A33D` | streaks & highlights |

Fonts: **Fraunces** (display/headings), **Manrope** (body/UI), **IBM Plex Mono**
(numbers — timers, streaks, mood scores). The mono numerals are a deliberate
contrast: a grounding, clinical touch against the soft serif/pink wellness feel.

Section markers use the `BreathingBloom` motif instead of numbered steps
(01/02/03), since Journal / Exercises / Circles / Trends are parallel
destinations, not a sequence.

## Wiring up Firebase (for real persistence)

The Journal, Dashboard, and Community pages currently use local component
state with `// TODO` comments marking where to plug in Firestore. To connect:

1. Create a project at https://console.firebase.google.com, enable
   **Authentication** (Email/Password or Google) and **Firestore**.
2. `npm install firebase` (already in package.json).
3. Create `src/firebase.js`:
   ```js
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { getAuth } from "firebase/auth";

   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     // ...rest from your Firebase project settings
   };

   const app = initializeApp(firebaseConfig);
   export const db = getAuth(app);
   export const auth = getAuth(app);
   ```
4. In `Journal.jsx`'s `handleSave`, replace the TODO with:
   ```js
   import { addDoc, collection, serverTimestamp } from "firebase/firestore";
   import { db } from "../firebase";

   await addDoc(collection(db, "entries"), {
     mood, tags, note, createdAt: serverTimestamp(), uid: auth.currentUser?.uid,
   });
   ```
5. In `Dashboard.jsx`, replace `sampleData` with a `getDocs`/`onSnapshot` query
   against the `entries` collection, grouped by day.
6. In `Community.jsx`, replace local `posts` state with a `posts` collection
   (fields: `circle`, `text`, `hearts`, `createdAt`) and `onSnapshot` for
   live updates.

Keep this to a stretch goal if you're tight on hours — the app is fully
demo-able on local state alone.

## Deploy

```bash
npm run build
```
Then drag the `dist/` folder into Vercel/Netlify, or run `vercel` /
`netlify deploy` from the project root.

## Git push reminder (Vibe2Vision check-ins)

Mandatory push every 6 hours during active hacking hours (10PM–6AM exempt).
Commit early and often as you build each page — don't save it all for the
deadline. Suggested commit points:
- `feat: project scaffold + design tokens`
- `feat: onboarding + navigation`
- `feat: mood journal flow`
- `feat: breathing exercises with bloom pacer`
- `feat: mood trends dashboard`
- `feat: peer support circles`
- `feat: burnout quiz`
- `chore: firebase integration`
- `polish: responsive + animations pass`
