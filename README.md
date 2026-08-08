# LUMÉA Account & Orders Microfrontend

An independently deployable Vue account experience for the LUMÉA beauty store. It owns login, registration, profile management, account overview, orders, wishlist, reviews, addresses, payment methods, and logout. There is **no real backend**.

## Technology

Vue 3, Vite, Vuetify, Pinia, Vue Router, Material Design Icons, static JSON seed data, and browser localStorage.

## Run locally

```bash
npm install
npm run dev
```

Create a production bundle with `npm run build`.

Test account: `eleanor@lumea.com` / `Password123`.

## Routes

`/login`, `/register`, `/account`, `/account/profile`, `/account/orders`, `/account/orders/:id`, `/account/wishlist`, `/account/reviews`, `/account/addresses`, `/account/payment-methods`; `/` redirects to `/account`.

## Mock data

Seed files in `src/data` initialize localStorage once. Runtime edits persist in `lumea_users`, `lumea_current_user`, `lumea_orders`, `lumea_products`, `lumea_reviews`, `lumea_addresses`, `lumea_payment_methods`, and `lumea_wishlist`. `resetStorage()` restores seeds for development.

## Integration

The integration method is iframe composition with `postMessage` and CustomEvent fallback. This is the simplest reliable approach for a mixed Vue, React, and Lit team where every microfrontend is independently deployed. Exposed events: `lumea:auth-changed`, `lumea:logout`, `lumea:wishlist-updated`, `lumea:add-to-cart`, `lumea:buy-again`, `lumea:track-order`, and `lumea:navigate-to-store`. A future inbound listener structure is available; no incoming events are currently required.

## Deploy

Import the repository into Vercel. The included SPA rewrite supports direct route refreshes. Set `VITE_SHELL_ORIGIN` to the shell’s exact production origin. Live URL: TBD. Repository URL: TBD.

## Limitations

Mock authentication and payments only; data is browser-local and not shared across devices. Harder than expected: Keeping navigation, authentication state, and design consistency synchronized between independently deployed applications.
