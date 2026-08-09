# Beauty Account & Orders

Vue 3 + Vuetify account slice for login, register, profile, orders, wishlist, and reviews. It is the LUMÉA visual reference. Standalone: https://microfrontend-e-commerce-account-or.vercel.app/. Remote bundle: `https://microfrontend-e-commerce-account-or.vercel.app/mfe/beauty-account.js`, registering `<beauty-account>` once.

Inputs are `route="login|register|profile|orders|wishlist|reviews"`, `routing="standalone|none"`, and `hide-chrome`. In shell mode the account layout hides its header/footer and uses memory routing. It emits `beauty:auth:login`, `beauty:auth:logout`, and `beauty:wishlist:updated`, listens at module scope for `beauty:order:placed`, and persists the order through its existing local storage model.

Run `npm install`, `npm run lint`, `npm run build`, and `npm run dev`. Vercel SPA rewriting is configured; `dist/mfe/beauty-account.js` injects required styles.
