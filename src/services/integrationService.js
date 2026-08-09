// Exposed events: lumea:auth-changed, lumea:logout, lumea:wishlist-updated,
// lumea:add-to-cart, lumea:buy-again, lumea:track-order, lumea:navigate-to-store.
// Production shells must set VITE_SHELL_ORIGIN and validate incoming event origins.
const beautyEventName = (eventName) => ({
  'lumea:auth-changed': 'beauty:auth:login',
  'lumea:logout': 'beauty:auth:logout',
  'lumea:wishlist-updated': 'beauty:wishlist:updated',
  'lumea:add-to-cart': 'beauty:cart:add',
  'lumea:buy-again': 'beauty:cart:add',
  'lumea:navigate-to-store': 'beauty:navigate',
}[eventName] || eventName);

export function emitIntegrationEvent(eventName, detail = {}) {
  if (typeof window === "undefined") return;
  const payload =
    eventName === "lumea:auth-changed" && detail.user
      ? {
          ...detail,
          user: (({ password, ...safeUser }) => safeUser)(detail.user),
        }
      : detail;
  window.dispatchEvent(new CustomEvent(beautyEventName(eventName), { detail: payload }));
}

export function registerIntegrationListener(handler) {
  if (typeof window === "undefined") return () => {};
  const listener = (event) => {
    if (event.data?.source !== "account-orders-microfrontend")
      handler(event.data);
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}
