import { defineStore } from "pinia";
import { getItem, initializeStorage, setItem } from "@/services/storageService";
import { emitIntegrationEvent } from "@/services/integrationService";
import { useAuthStore } from "./auth";

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({ items: [], products: [] }),
  getters: {
    wishlistProducts: (state) =>
      state.items
        .map((id) => state.products.find((product) => product.id === id))
        .filter(Boolean),
    wishlistCount: (state) => state.items.length,
  },
  actions: {
    storageKey() {
      return `lumea_wishlist_${useAuthStore().user?.id || "guest"}`;
    },
    initialize() {
      initializeStorage();
      const savedItems = getItem(this.storageKey(), null);
      this.items = Array.isArray(savedItems) ? savedItems : [];
      this.products = getItem("lumea_products", []);
      if (!Array.isArray(savedItems)) this.persist();
    },
    persist() {
      setItem(this.storageKey(), this.items);
      emitIntegrationEvent("lumea:wishlist-updated", {
        count: this.items.length,
      });
    },
    addProduct(productId) {
      if (productId && !this.items.includes(productId)) {
        this.items.push(productId);
        this.persist();
      }
    },
    refreshFromStorage() {
      this.products = getItem("lumea_products", []);
      this.items = getItem(this.storageKey(), this.items);
    },
    removeProduct(productId) {
      this.items = this.items.filter((id) => id !== productId);
      this.persist();
    },
    moveToCart(productId) {
      const product = this.products.find((item) => item.id === productId);
      if (!product) return;
      emitIntegrationEvent("lumea:add-to-cart", {
        productId,
        quantity: 1,
        product,
      });
    },
    clearWishlist() {
      this.items = [];
      this.persist();
    },
  },
});
