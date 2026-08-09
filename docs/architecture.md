# Architecture

```mermaid
flowchart LR
  Shell[Shell Application]
  Catalog[Catalog Microfrontend]
  Cart[Cart and Checkout Microfrontend]
  Account[Account and Orders Microfrontend]
  Shell -->|dynamic import of deployed ESM bundle| Catalog[&lt;beauty-catalog&gt; Lit]
  Shell -->|dynamic import of deployed ESM bundle| Cart[&lt;beauty-cart&gt; React]
  Shell -->|dynamic import of deployed ESM bundle| Account[&lt;beauty-account&gt; Vue]
  Catalog -->|beauty:cart:add / beauty:navigate| Shell
  Cart -->|beauty:cart:updated / beauty:order:placed| Shell
  Account -->|beauty:auth:* / beauty:cart:add / beauty:navigate| Shell
  Shell -->|route, routing=none, hide-chrome attributes| Catalog
  Shell -->|route, routing=none, hide-chrome attributes| Cart
  Shell -->|route, routing=none, hide-chrome attributes| Account
```

Account is independently deployable: its Vue UI, Pinia state, JSON seed data, and localStorage persistence live entirely in this project. Seed JSON is copied once, then Pinia stores update localStorage for runtime changes.

The shell composes live deployed bundles as Web Components. It does not import sibling source files or use iframes. The components communicate through namespaced `beauty:*` CustomEvents on `window`.

Current limitations: no backend, no cross-device sync, mock authentication, and mock payment methods. Catalog/cart remain separate microfrontends.
