// Exposed events: lumea:auth-changed, lumea:logout, lumea:wishlist-updated,
// lumea:add-to-cart, lumea:buy-again, lumea:track-order, lumea:navigate-to-store.
// Production shells must set VITE_SHELL_ORIGIN and validate incoming event origins.
export function emitIntegrationEvent(eventName, detail = {}) {
  if (typeof window === "undefined") return;
  const payload =
    eventName === "lumea:auth-changed" && detail.user
      ? {
          ...detail,
          user: (({ password, ...safeUser }) => safeUser)(detail.user),
        }
      : detail;
  window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
  if (window.parent && window.parent !== window) {
    const targetOrigin = import.meta.env.VITE_SHELL_ORIGIN || "*";
    window.parent.postMessage(
      { source: "account-orders-microfrontend", type: eventName, payload },
      targetOrigin,
    );
  }
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
