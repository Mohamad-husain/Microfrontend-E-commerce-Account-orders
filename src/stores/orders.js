import { defineStore } from "pinia";
import { getItem, initializeStorage } from "@/services/storageService";
import { emitIntegrationEvent } from "@/services/integrationService";
import { useAuthStore } from "./auth";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
    searchQuery: "",
    statusFilter: "all",
    currentPage: 1,
    itemsPerPage: 5,
  }),
  getters: {
    currentUserOrders: (state) => {
      const userId = useAuthStore().user?.id;
      return userId
        ? state.orders.filter((order) => order.userId === userId)
        : [];
    },
    filteredOrders() {
      const query = this.searchQuery.trim().toLowerCase();
      return this.currentUserOrders.filter(
        (order) =>
          (!query || order.id.toLowerCase().includes(query)) &&
          (this.statusFilter === "all" || order.status === this.statusFilter),
      );
    },
    paginatedOrders() {
      return this.filteredOrders.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage,
      );
    },
    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.filteredOrders.length / this.itemsPerPage),
      );
    },
    getOrderById() {
      return (id) =>
        this.currentUserOrders.find((order) => order.id === id) || null;
    },
  },
  actions: {
    initialize() {
      initializeStorage();
      this.orders = getItem("lumea_orders", []);
    },
    setSearchQuery(query = "") {
      this.searchQuery = query;
      this.currentPage = 1;
    },
    setStatusFilter(status = "all") {
      this.statusFilter = status;
      this.currentPage = 1;
    },
    setPage(page = 1) {
      this.currentPage = Math.min(
        Math.max(1, Number(page) || 1),
        this.totalPages,
      );
    },
    buyAgain(order) {
      if (order?.userId === useAuthStore().user?.id)
        emitIntegrationEvent("lumea:buy-again", { order });
    },
    trackOrder(order) {
      if (order?.userId === useAuthStore().user?.id)
        emitIntegrationEvent("lumea:track-order", { orderId: order.id, order });
    },
  },
});
