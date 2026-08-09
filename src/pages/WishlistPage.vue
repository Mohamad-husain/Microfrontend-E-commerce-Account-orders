<template>
  <AccountLayout>
    <div class="account-grid wishlist-layout">
      <AccountSidebar />
      <section class="wishlist-page" aria-labelledby="wishlist-title">
        <header class="wishlist-header">
          <div>
            <p class="eyebrow">My collection</p>
            <h1 id="wishlist-title">Your wishlist</h1>
            <p>Keep your favourite LUMÉA pieces close for your next ritual.</p>
          </div>
          <div class="wishlist-count">
            <AppIcon name="heart" size="17" />
            <span>{{ wishlist.wishlistCount }} saved</span>
          </div>
        </header>

        <div v-if="wishlist.wishlistCount" class="wishlist-tools">
          <p>Items in your collection are ready whenever you are.</p>
          <v-btn variant="text" size="small" @click="moveAll">
            <AppIcon name="shopping" size="17" class="mr-1" />
            Move all to bag
          </v-btn>
        </div>

        <div v-if="wishlist.wishlistCount" class="product-grid">
          <WishlistProductCard
            v-for="product in wishlist.wishlistProducts"
            :key="product.id"
            :product="product"
            @remove="pending = product.id"
            @move="move"
          />
        </div>

        <EmptyState
          v-else
          icon="mdi-heart-outline"
          title="Your wishlist is empty"
          message="Save your favourite LUMÉA essentials for later."
        >
          <template #action>
            <v-btn class="shop-button mt-5" @click="shop">Discover LUMÉA</v-btn>
          </template>
        </EmptyState>

        <v-alert
          v-if="wishlist.wishlistCount"
          class="wishlist-note"
          :icon="false"
          density="compact"
          variant="tonal"
          color="primary"
        >
          <template #prepend><AppIcon name="sparkle" size="19" /></template>
          <strong>Your edit, saved.</strong>
          <span> Prices and availability can change, but your beauty favourites stay right here.</span>
        </v-alert>

        <ConfirmDialog
          v-model="confirm"
          title="Remove from wishlist?"
          message="This item will be removed from your saved favourites."
          confirm-text="Remove"
          @confirm="remove"
        />
        <v-snackbar v-model="snack.show" color="success">
          {{ snack.text }}
        </v-snackbar>
      </section>
    </div>
  </AccountLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import AccountLayout from "@/layouts/AccountLayout.vue";
import AccountSidebar from "@/components/account/AccountSidebar.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import WishlistProductCard from "@/components/wishlist/WishlistProductCard.vue";
import { useWishlistStore } from "@/stores/wishlist";
import AppIcon from "@/components/common/AppIcon.vue";

const wishlist = useWishlistStore();
const pending = ref(null);
const snack = reactive({ show: false, text: "" });
const confirm = computed({
  get: () => Boolean(pending.value),
  set: (value) => {
    if (!value) pending.value = null;
  },
});

const refreshWishlist = () => wishlist.refreshFromStorage();
onMounted(() => {
  wishlist.initialize();
  window.addEventListener("beauty:wishlist:updated", refreshWishlist);
});
onBeforeUnmount(() => window.removeEventListener("beauty:wishlist:updated", refreshWishlist));

function remove() {
  wishlist.removeProduct(pending.value);
  pending.value = null;
  snack.text = "Item removed from your wishlist.";
  snack.show = true;
}

function move(id) {
  wishlist.moveToCart(id);
  snack.text = "Item added to your bag and kept in your wishlist.";
  snack.show = true;
}

function moveAll() {
  [...wishlist.items].forEach((id) => wishlist.moveToCart(id));
  snack.text =
    "Available items were added to your bag and kept in your wishlist.";
  snack.show = true;
}

function shop() {
  console.info("LUMÉA external navigation placeholder: catalog");
}
</script>

<style scoped>
.wishlist-layout {
  align-items: start;
}
.wishlist-page {
  min-width: 0;
}
.wishlist-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 22px;
  margin: 3px 0 17px;
}
.eyebrow {
  margin: 0 0 7px;
  color: #9a5c75;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.wishlist-header h1 {
  margin: 0;
  color: #4e1239;
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2.1rem, 3.4vw, 2.9rem);
  letter-spacing: -0.05em;
  line-height: 1.03;
}
.wishlist-header > div > p:last-child {
  margin: 8px 0 0;
  color: var(--lumea-muted);
  font-size: 0.83rem;
}
.wishlist-count {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 11px;
  border-radius: 99px;
  color: #6c1b4e;
  background: #f9e8ed;
  font-size: 0.71rem;
  font-weight: 700;
  white-space: nowrap;
}
.wishlist-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 17px;
  padding: 10px 14px;
  border: 1px solid #eee0e5;
  border-radius: 10px;
  background: #fff;
}
.wishlist-tools p {
  margin: 0;
  color: #806a75;
  font-size: 0.73rem;
}
.wishlist-tools .v-btn {
  color: #6d164f;
  font-size: 0.71rem;
  font-weight: 700;
  text-transform: none;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.wishlist-note {
  max-width: 530px;
  margin: 24px auto 0;
  border-radius: 11px;
  color: #70525f;
  background: #fff2f5;
}
.wishlist-note strong {
  color: #5a173f;
  font-size: 0.75rem;
}
.wishlist-note span {
  font-size: 0.69rem;
  line-height: 1.45;
}
.shop-button {
  border-radius: 9px;
  color: #fff !important;
  background: #66174f !important;
  font-size: 0.78rem;
  text-transform: none;
}
@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 560px) {
  .wishlist-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .wishlist-tools {
    align-items: flex-start;
    flex-direction: column;
  }
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
