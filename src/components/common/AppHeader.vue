<template>
  <header class="site-header">
    <div class="desktop">
      <div class="header-row">
        <v-text-field
          class="search"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-magnify"
          placeholder="Search LUMÉA..."
          variant="solo-filled"
          flat
        />
        <LumeaLogo />
        <div class="actions">
          <v-btn icon variant="text" to="/account" aria-label="My account">
            <v-icon icon="mdi-account-outline" />
          </v-btn>
          <v-badge
            :model-value="Boolean(wishlist.wishlistCount)"
            :content="wishlist.wishlistCount"
            color="primary"
          >
            <v-btn
              icon
              variant="text"
              to="/account/wishlist"
              aria-label="Wishlist"
            >
              <v-icon icon="mdi-heart-outline" />
            </v-btn>
          </v-badge>
        </div>
      </div>
    </div>
    <div class="mobile">
      <v-btn icon="mdi-menu" variant="text" @click="drawer = true" />
      <LumeaLogo />
      <v-btn icon variant="text" to="/account/wishlist" aria-label="Wishlist">
        <v-icon icon="mdi-heart-outline" />
      </v-btn>
      <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
          <v-list-item
            v-for="item in categories"
            :key="item"
            :title="item"
            @click="external(item)"
          />
          <v-divider />
          <v-list-item title="My account" to="/account" />
          <v-list-item title="Wishlist" to="/account/wishlist" />
          <v-list-item title="Shopping bag" @click="external('bag')" />
        </v-list>
      </v-navigation-drawer>
    </div>
  </header>
</template>
<script setup>
import { onMounted, ref } from "vue";
import LumeaLogo from "./LumeaLogo.vue";
import { useWishlistStore } from "@/stores/wishlist";
const wishlist = useWishlistStore(),
  drawer = ref(false),
  categories = [
    "Makeup",
    "Skincare",
    "Haircare",
    "Fragrance",
    "Body Care",
    "Tools",
  ];
onMounted(() => wishlist.initialize());
function external(destination) {
  drawer.value = false;
  console.info(`LUMÉA external navigation placeholder: ${destination}`);
}
</script>
<style scoped>
.site-header {
  background: #fffafb;
  border-bottom: 1px solid var(--lumea-border);
}
.header-row {
  height: 66px;
  max-width: 1240px;
  margin: auto;
  padding: 0 var(--lumea-page-gutter);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}
.search {
  max-width: 230px;
}
.actions {
  justify-self: end;
  display: flex;
  gap: 4px;
}
.mobile {
  display: none;
  height: 58px;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
}
@media (max-width: 720px) {
  .desktop {
    display: none;
  }
  .mobile {
    display: flex;
  }
}
</style>
