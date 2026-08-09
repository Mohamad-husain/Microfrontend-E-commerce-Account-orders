import { defineStore } from "pinia";
import { getItem, initializeStorage, setItem } from "@/services/storageService";
import { useAuthStore } from "./auth";

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
