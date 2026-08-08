import { defineStore } from "pinia";
import { getItem, initializeStorage, setItem } from "@/services/storageService";
import { emitIntegrationEvent } from "@/services/integrationService";
import { useAuthStore } from "./auth";

const starterWishlist = ["product-1", "product-2", "product-3", "product-4"];

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
      const seededItems = getItem("lumea_wishlist", starterWishlist);
      this.items =
        Array.isArray(savedItems) && savedItems.length
          ? savedItems
          : Array.isArray(seededItems) && seededItems.length
            ? seededItems
            : starterWishlist;
      this.products = getItem("lumea_products", []);
      const collectionVersionKey = `${this.storageKey()}_collection_v2`;
      const hasCurrentCollection = getItem(collectionVersionKey, false);
      if (!hasCurrentCollection) {
        this.items = [...starterWishlist];
        setItem(collectionVersionKey, true);
      }
      if (
        !Array.isArray(savedItems) ||
        !savedItems.length ||
        !hasCurrentCollection
      )
        this.persist();
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
