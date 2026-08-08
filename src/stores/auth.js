import { defineStore } from "pinia";
import {
  getItem,
  initializeStorage,
  removeItem,
  setItem,
} from "@/services/storageService";
import { emitIntegrationEvent } from "@/services/integrationService";

const waitForMockLogin = () =>
  new Promise((resolve) => setTimeout(resolve, 500));
const createUserId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const sampleUserId = "user-001";

function createStarterAccountData(user) {
  const orders = getItem("lumea_orders", []);
  const reviews = getItem("lumea_reviews", []);
  const hasOrders = orders.some((order) => order.userId === user.id);
  const hasReviews = reviews.some((review) => review.userId === user.id);
  if (hasOrders && hasReviews) return;
  const displayName = `${user.firstName} ${user.lastName}`.trim();

  const starterOrders = orders
    .filter((order) => order.userId === sampleUserId)
    .slice(0, 3)
    .map((order, index) => ({
      ...order,
      id: `LUM-${Date.now().toString().slice(-5)}${index + 1}`,
      userId: user.id,
      shippingAddress: {
        ...order.shippingAddress,
        fullName: displayName,
      },
    }));

  const starterReviews = reviews
    .filter((review) => review.userId === sampleUserId)
    .map((review, index) => ({
      ...review,
      id: `review-${user.id}-${index + 1}`,
      userId: user.id,
    }));

  if (!hasOrders) setItem("lumea_orders", [...orders, ...starterOrders]);
  if (!hasReviews) setItem("lumea_reviews", [...reviews, ...starterReviews]);
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isInitialized: false,
    loading: false,
    error: "",
    rememberMe: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    fullName: (state) =>
      state.user ? `${state.user.firstName} ${state.user.lastName}`.trim() : "",
    initials: (state) =>
      state.user
        ? `${state.user.firstName?.[0] || ""}${state.user.lastName?.[0] || ""}`.toUpperCase()
        : "",
  },
  actions: {
    initialize() {
      if (this.isInitialized) return;
      initializeStorage();
      this.user = getItem("lumea_current_user", null);
      if (this.user && this.user.id !== sampleUserId)
        createStarterAccountData(this.user);
      this.isInitialized = true;
    },
    async login(email, password, rememberMe = false) {
      this.initialize();
      this.loading = true;
      this.error = "";
      await waitForMockLogin();
      const normalizedEmail = String(email || "")
        .trim()
        .toLowerCase();
      const user = getItem("lumea_users", []).find(
        (item) =>
          item.email?.toLowerCase() === normalizedEmail &&
          item.password === password,
      );
      this.loading = false;
      if (!user) {
        this.error = "We couldn’t find an account with those details.";
        return false;
      }
      this.user = user;
      this.rememberMe = Boolean(rememberMe);
      setItem("lumea_current_user", user);
      emitIntegrationEvent("lumea:auth-changed", { user });
      return true;
    },
    clearError() {
      this.error = "";
    },
    async register(formData) {
      this.initialize();
      const users = getItem("lumea_users", []);
      const email = String(formData?.email || "")
        .trim()
        .toLowerCase();
      if (users.some((item) => item.email?.toLowerCase() === email))
        throw new Error("An account already exists with this email.");
      if (
        formData?.confirmPassword !== undefined &&
        formData.password !== formData.confirmPassword
      )
        throw new Error("Passwords do not match.");
      const user = {
        ...formData,
        id: createUserId(),
        email,
        membership: "Luméa Beauty Member",
        rewardPoints: 0,
        avatar: "",
        createdAt: new Date().toISOString(),
      };
      delete user.confirmPassword;
      users.push(user);
      setItem("lumea_users", users);
      createStarterAccountData(user);
      this.user = user;
      setItem("lumea_current_user", user);
      emitIntegrationEvent("lumea:auth-changed", { user });
      return user;
    },
    logout() {
      removeItem("lumea_current_user");
      this.user = null;
      this.error = "";
      emitIntegrationEvent("lumea:logout", {});
    },
    updateCurrentUser(userData) {
      if (!this.user) return false;
      const updatedUser = { ...this.user, ...userData, id: this.user.id };
      const users = getItem("lumea_users", []).map((item) =>
        item.id === updatedUser.id ? updatedUser : item,
      );
      setItem("lumea_users", users);
      setItem("lumea_current_user", updatedUser);
      this.user = updatedUser;
      emitIntegrationEvent("lumea:auth-changed", { user: updatedUser });
      return true;
    },
  },
});
