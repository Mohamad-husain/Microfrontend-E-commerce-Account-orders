<template>
  <AccountLayout>
    <div class="account-grid orders-layout">
      <AccountSidebar />

      <section class="orders-page" aria-labelledby="orders-title">
        <header class="orders-header">
          <div>
            <p class="eyebrow">My purchases</p>
            <h1 id="orders-title">Order history</h1>
            <p>View and manage your recent LUMÉA orders.</p>
          </div>
          <div class="order-filters" aria-label="Filter orders">
            <v-select
              :model-value="orders.statusFilter"
              class="status-filter"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              label="Status"
              density="compact"
              hide-details
              variant="outlined"
              @update:model-value="orders.setStatusFilter"
            />
            <v-text-field
              :model-value="orders.searchQuery"
              class="order-search"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-magnify"
              placeholder="Search order number"
              variant="outlined"
              @update:model-value="orders.setSearchQuery"
            />
          </div>
        </header>

        <p class="results-copy" aria-live="polite">
          {{ orders.filteredOrders.length }}
          {{ orders.filteredOrders.length === 1 ? "order" : "orders" }} found
        </p>

        <div class="orders-card table-wrap">
          <v-table class="order-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders.paginatedOrders" :key="order.id">
                <td class="order-number">{{ order.id }}</td>
                <td>{{ formatDate(order.date) }}</td>
                <td><OrderStatusChip :status="order.status" /></td>
                <td class="order-total">${{ order.total.toFixed(2) }}</td>
                <td>
                  <div class="order-actions">
                    <v-btn
                      size="small"
                      variant="text"
                      class="details-button"
                      @click="selectedOrder = order"
                    >
                      Details
                    </v-btn>
                    <v-btn
                      v-if="order.status === 'Shipped'"
                      size="small"
                      variant="outlined"
                      class="track-button"
                      @click="track(order)"
                    >
                      Track order
                    </v-btn>
                    <span v-else class="status-note">
                      {{ actionLabel(order.status) }}
                    </span>
                    <v-btn
                      v-if="order.status === 'Delivered'"
                      size="small"
                      class="buy-button"
                      @click="buyAgain(order)"
                    >
                      Buy again
                    </v-btn>
                  </div>
                </td>
              </tr>
              <tr v-if="!orders.paginatedOrders.length">
                <td colspan="5" class="empty-orders">
                  No orders match that order number.
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <v-pagination
          v-if="orders.totalPages > 1"
          v-model="orders.currentPage"
          :length="orders.totalPages"
          size="small"
          class="order-pagination"
        />

        <v-dialog v-model="detailsOpen" max-width="560">
          <v-card v-if="selectedOrder" class="order-dialog">
            <v-card-title class="d-flex align-center justify-space-between pa-6 pb-3">
              <div>
                <p class="eyebrow mb-1">Order details</p>
                <h2>{{ selectedOrder.id }}</h2>
              </div>
              <OrderStatusChip :status="selectedOrder.status" />
            </v-card-title>
            <v-card-text class="px-6 pb-2">
              <div class="detail-meta">
                <span>Placed</span><strong>{{ formatDate(selectedOrder.date) }}</strong>
                <span>Payment</span><strong>{{ selectedOrder.paymentMethod }}</strong>
              </div>
              <v-divider class="my-5" />
              <p class="detail-label">Items</p>
              <div v-for="item in selectedOrder.items" :key="item.productId" class="order-item">
                <span>{{ productName(item.productId) }} × {{ item.quantity }}</span>
                <strong>${{ (item.unitPrice * item.quantity).toFixed(2) }}</strong>
              </div>
              <v-divider class="my-5" />
              <div class="order-total-row"><span>Total paid</span><strong>${{ selectedOrder.total.toFixed(2) }}</strong></div>
              <p class="address-copy">
                <v-icon size="17">mdi-map-marker-outline</v-icon>
                {{ selectedOrder.shippingAddress.line1 }}, {{ selectedOrder.shippingAddress.city }}
              </p>
            </v-card-text>
            <v-card-actions class="px-6 pb-5">
              <v-spacer />
              <v-btn variant="text" @click="selectedOrder = null">Close</v-btn>
              <v-btn v-if="selectedOrder.status === 'Delivered'" class="buy-button" @click="buyAgain(selectedOrder)">Buy again</v-btn>
              <v-btn v-else-if="selectedOrder.status === 'Shipped'" class="track-button" variant="outlined" @click="track(selectedOrder)">Track order</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar v-model="snack.show" color="primary">
          {{ snack.text }}
        </v-snackbar>
      </section>
    </div>
  </AccountLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import AccountLayout from "@/layouts/AccountLayout.vue";
import AccountSidebar from "@/components/account/AccountSidebar.vue";
import OrderStatusChip from "@/components/orders/OrderStatusChip.vue";
import { useOrdersStore } from "@/stores/orders";

const orders = useOrdersStore();
const snack = reactive({ show: false, text: "" });
const selectedOrder = ref(null);
const detailsOpen = computed({
  get: () => Boolean(selectedOrder.value),
  set: (open) => { if (!open) selectedOrder.value = null; },
});
const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Processing", value: "Processing" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

onMounted(() => orders.initialize());

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function actionLabel(status) {
  if (status === "Processing") return "Being prepared";
  if (status === "Cancelled") return "Order cancelled";
  return "Delivered";
}

function productName(productId) {
  return JSON.parse(localStorage.getItem("lumea_products") || "[]").find(
    (product) => product.id === productId,
  )?.name || "LUMÉA product";
}

function track(order) {
  orders.trackOrder(order);
  snack.text = `Tracking details for ${order.id} were requested.`;
  snack.show = true;
}

function buyAgain(order) {
  orders.buyAgain(order);
  snack.text = `${order.id} was added to your shopping bag.`;
  snack.show = true;
}
</script>

<style scoped>
.orders-layout {
  align-items: start;
}
.orders-page {
  min-width: 0;
}
.orders-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 22px;
  margin: 3px 0 23px;
}
.eyebrow {
  margin: 0 0 7px;
  color: #9a5c75;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.orders-header h1 {
  margin: 0;
  color: #4e1239;
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2rem, 3vw, 2.65rem);
  letter-spacing: -0.045em;
  line-height: 1.04;
}
.orders-header > div > p:last-child {
  margin: 8px 0 0;
  color: var(--lumea-muted);
  font-size: 0.82rem;
}
.order-filters {
  display: flex;
  gap: 10px;
  width: min(100%, 430px);
}
.status-filter {
  width: 145px;
}
.order-search {
  flex: 1;
  min-width: 190px;
}
.order-search :deep(.v-field),
.status-filter :deep(.v-field) {
  min-height: 39px;
  border-radius: 9px;
  background: #fff;
}
.order-search :deep(.v-field__input),
.order-search :deep(.v-field__prepend-inner),
.status-filter :deep(.v-field__input) {
  font-size: 0.73rem;
}
.order-search :deep(.v-field--focused),
.status-filter :deep(.v-field--focused) {
  box-shadow: 0 0 0 3px rgb(139 49 95 / 9%);
}
.results-copy {
  margin: -10px 0 14px;
  color: #806a75;
  font-size: 0.73rem;
}
.orders-card {
  overflow: hidden;
  border: 1px solid #ead9df;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 7px 22px rgb(74 13 55 / 5%);
}
.order-table :deep(table) {
  min-width: 680px;
}
.order-table :deep(thead tr) {
  background: #fff5f7;
}
.order-table :deep(th) {
  height: 42px;
  color: #795968;
  font-size: 0.61rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.order-table :deep(td) {
  height: 58px;
  color: #705c67;
  font-size: 0.74rem;
  border-color: #f0e4e8;
}
.order-number,
.order-total {
  color: #4e1239 !important;
  font-weight: 700;
}
.order-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  min-width: 220px;
}
.details-button {
  min-height: 28px !important;
  padding: 0 5px !important;
  color: #6d164f !important;
  font-size: 0.67rem;
  font-weight: 700;
}
.track-button {
  min-height: 28px !important;
  padding: 0 11px !important;
  border-color: #a26080 !important;
  color: #6d164f !important;
  border-radius: 7px;
  font-size: 0.67rem;
  font-weight: 700;
  text-transform: none;
}
.buy-button {
  min-height: 28px !important;
  padding: 0 11px !important;
  border-radius: 7px;
  color: #fff !important;
  background: #66174f !important;
  font-size: 0.67rem;
  font-weight: 700;
  text-transform: none;
}
.status-note {
  color: #917985;
  font-size: 0.68rem;
  font-weight: 600;
}
.empty-orders {
  height: 110px !important;
  color: #8b7781 !important;
  text-align: center;
}
.order-pagination {
  margin-top: 21px;
}
.order-pagination :deep(.v-btn) {
  min-width: 29px;
  height: 29px;
  color: #6b5260;
  font-size: 0.7rem;
}
.order-pagination :deep(.v-btn--active) {
  color: #fff;
  background: #66174f;
}
.order-dialog h2 {
  color: #4e1239;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.4rem;
}
.detail-meta {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px 18px;
  color: #806a75;
  font-size: 0.76rem;
}
.detail-meta strong {
  color: #4e1239;
  font-weight: 700;
}
.detail-label {
  margin: 0 0 8px;
  color: #806a75;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.order-item,
.order-total-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  color: #705c67;
  font-size: 0.78rem;
}
.order-item + .order-item { margin-top: 9px; }
.order-item strong,
.order-total-row strong { color: #4e1239; }
.order-total-row { font-size: 0.88rem; font-weight: 700; }
.address-copy {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 18px 0 0;
  color: #806a75;
  font-size: 0.74rem;
}
.address-copy .v-icon { color: #7d2b67; }
@media (max-width: 720px) {
  .orders-header {
    align-items: stretch;
    flex-direction: column;
  }
  .order-filters {
    width: 100%;
  }
}
@media (max-width: 480px) {
  .order-filters { flex-direction: column; }
  .status-filter, .order-search { width: 100%; }
}
</style>
