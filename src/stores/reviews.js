import { defineStore } from "pinia";
import { getItem, initializeStorage, setItem } from "@/services/storageService";
import { useAuthStore } from "./auth";

const wishlistReviewProducts = ["product-1", "product-2"];

export const useReviewsStore = defineStore("reviews", {
  state: () => ({
    reviews: [],
    activeTab: "submitted",
    editingReview: null,
    dialogOpen: false,
  }),
  getters: {
    currentUserReviews: (state) => {
      const userId = useAuthStore().user?.id;
      return userId
        ? state.reviews.filter((review) => review.userId === userId)
        : [];
    },
    submittedReviews() {
      return this.currentUserReviews.filter(
        (review) => review.status === "submitted",
      );
    },
    pendingReviews() {
      return this.currentUserReviews.filter(
        (review) => review.status === "pending",
      );
    },
  },
  actions: {
    initialize() {
      initializeStorage();
      this.reviews = getItem("lumea_reviews", []);
      this.migrateReviewsToWishlistProducts();
    },
    migrateReviewsToWishlistProducts() {
      const userId = useAuthStore().user?.id;
      if (!userId) return;
      const migrationKey = `lumea_reviews_wishlist_products_v1_${userId}`;
      if (getItem(migrationKey, false)) return;

      let index = 0;
      this.reviews = this.reviews.map((review) => {
        if (review.userId !== userId || review.status !== "submitted") {
          return review;
        }
        const productId = wishlistReviewProducts[index];
        index += 1;
        return productId ? { ...review, productId } : review;
      });

      this.persist();
      setItem(migrationKey, true);
    },
    persist() {
      setItem("lumea_reviews", this.reviews);
    },
    addReview(review) {
      const userId = useAuthStore().user?.id;
      if (!userId || !review) return null;
      const entry = {
        ...review,
        id: review.id || `review-${Date.now()}`,
        userId,
      };
      this.reviews.push(entry);
      this.persist();
      return entry;
    },
    updateReview(review) {
      const userId = useAuthStore().user?.id;
      if (!userId || !review?.id) return false;
      const index = this.reviews.findIndex(
        (item) => item.id === review.id && item.userId === userId,
      );
      if (index < 0) return false;
      this.reviews[index] = { ...this.reviews[index], ...review, userId };
      this.persist();
      return true;
    },
    deleteReview(reviewId) {
      const userId = useAuthStore().user?.id;
      if (!userId) return false;
      const nextReviews = this.reviews.filter(
        (review) => review.id !== reviewId || review.userId !== userId,
      );
      if (nextReviews.length === this.reviews.length) return false;
      this.reviews = nextReviews;
      this.persist();
      return true;
    },
    openEditDialog(review) {
      this.editingReview = review ? { ...review } : null;
      this.dialogOpen = Boolean(review);
    },
    closeEditDialog() {
      this.dialogOpen = false;
      this.editingReview = null;
    },
  },
});
