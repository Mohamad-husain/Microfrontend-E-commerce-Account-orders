import { createApp, type App as VueApp } from 'vue';
import { createPinia } from 'pinia';
import vuetify from '../plugins/vuetify';
import { createAccountRouter } from '../router';
import App from '../App.vue';
import '../assets/styles/main.css';
import 'vuetify/styles';
import { addIntegratedWishlistProduct, prepareIntegratedReview, toggleIntegratedWishlistProduct } from '../services/storageService';

const routeMap: Record<string, string> = { login: '/login', register: '/register', profile: '/account/profile', orders: '/account/orders', wishlist: '/account/wishlist', reviews: '/account/reviews' };
window.addEventListener('beauty:order:placed', (event: Event) => {
  try {
    const detail = (event as CustomEvent).detail || {}; const user = JSON.parse(localStorage.getItem('lumea_current_user') || 'null'); if (!user) return;
    const orders = JSON.parse(localStorage.getItem('lumea_orders') || '[]');
    const order = { id: `LUM-${Date.now().toString().slice(-6)}`, userId: user.id, date: new Date().toISOString().slice(0, 10), status: 'Processing', arrivalDate: '', shippingAddress: { label: 'Home', fullName: detail.shippingInfo?.fullName || `${user.firstName} ${user.lastName}`, line1: detail.shippingInfo?.address || '', city: detail.shippingInfo?.city || '', state: detail.shippingInfo?.state || '', postalCode: detail.shippingInfo?.postalCode || '', country: '' }, paymentMethod: detail.paymentMethod || 'card', items: (detail.items || []).map((item: any) => ({ productId: String(item.id), quantity: item.qty, unitPrice: item.price })), shipping: 0, tax: 0, total: detail.total || 0 };
    localStorage.setItem('lumea_orders', JSON.stringify([order, ...orders]));
  } catch { /* leave existing account persistence intact if storage is unavailable */ }
});
window.addEventListener('beauty:wishlist:add', (event: Event) => {
  const product = addIntegratedWishlistProduct((event as CustomEvent).detail?.product);
  if (product) window.dispatchEvent(new CustomEvent('beauty:wishlist:updated', { detail: { productId: product.id } }));
});
window.addEventListener('beauty:wishlist:toggle', (event: Event) => {
  const detail = (event as CustomEvent).detail || {};
  const result = toggleIntegratedWishlistProduct(detail.product, Boolean(detail.active));
  if (result) window.dispatchEvent(new CustomEvent('beauty:wishlist:updated', { detail: { productId: result.product.id, active: result.active } }));
});
window.addEventListener('beauty:review:open', (event: Event) => {
  const result = prepareIntegratedReview((event as CustomEvent).detail?.product);
  window.dispatchEvent(new CustomEvent('beauty:navigate', { detail: { to: result.requiresLogin ? '/login' : '/reviews' } }));
});

class BeautyAccount extends HTMLElement {
  app?: VueApp; router?: ReturnType<typeof createAccountRouter>;
  static get observedAttributes() { return ['route', 'routing', 'hide-chrome', 'asset-base']; }
  connectedCallback() { this.mount(); }
  disconnectedCallback() { this.app?.unmount(); this.app = undefined; }
  attributeChangedCallback() { if (this.app) this.router?.push(routeMap[this.getAttribute('route') || 'profile'] || '/account/profile'); }
  mount() {
    const embedded = this.getAttribute('routing') === 'none'; this.router = createAccountRouter(embedded);
    this.app = createApp(App); this.app.provide('beauty-hide-chrome', this.hasAttribute('hide-chrome') || this.hasAttribute('hidechrome') || (this as any).hideChrome === true); this.app.provide('beauty-asset-base', this.getAttribute('asset-base') || `${window.location.origin}/`); this.app.use(createPinia()).use(vuetify).use(this.router); this.app.mount(this);
    this.router.push(routeMap[this.getAttribute('route') || 'profile'] || '/account/profile');
  }
}
if (!customElements.get('beauty-account')) customElements.define('beauty-account', BeautyAccount);
