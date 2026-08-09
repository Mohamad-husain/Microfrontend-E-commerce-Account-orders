<template>
  <aside class="sidebar">
    <div class="profile-identity">
      <v-avatar size="46" class="profile-avatar">
        <img
          :src="profileImage"
          alt="User profile"
          @error="usePlaceholder"
        />
      </v-avatar>
      <div>
        <strong>{{ auth.fullName || "LUMÉA Member" }}</strong>
        <span>{{ auth.user?.membership || "LUMÉA Beauty Member" }}</span>
      </div>
    </div>

    <v-list nav density="compact" bg-color="transparent">
      <v-list-item
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        active-class="active"
      >
        <template #prepend><AppIcon :name="item.icon" size="19" /></template>
        {{ item.label }}
      </v-list-item>
      <v-divider class="my-2" />
      <v-list-item
        class="sidebar-link"
        @click="signout"
      >
        <template #prepend><AppIcon name="logout" size="19" /></template>
        Sign Out
      </v-list-item>
    </v-list>
  </aside>
</template>

<script setup>
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppIcon from "@/components/common/AppIcon.vue";

const router = useRouter();
const auth = useAuthStore();
const assetBase = inject("beauty-asset-base", "/");
const assetUrl = (path) =>
  String(path || "").startsWith("/") ? `${assetBase}${path.slice(1)}` : path;
const profileImage = computed(() =>
  assetUrl(auth.user?.avatar || "/images/profile-placeholder.svg"),
);
const items = [
  {
    label: "Personal Info",
    to: "/account/profile",
    icon: "account",
  },
  { label: "Orders", to: "/account/orders", icon: "bag" },
  { label: "Wishlist", to: "/account/wishlist", icon: "heart-outline" },
  { label: "My Reviews", to: "/account/reviews", icon: "star-outline" },
];

function signout() {
  auth.logout();
  router.push("/login");
}

function usePlaceholder(event) {
  event.target.src = assetUrl("/images/profile-placeholder.svg");
}
</script>

<style scoped>
.profile-identity {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 17px;
  padding: 2px 5px;
}
.profile-avatar {
  border: 2px solid #f3dce4;
  background: #f4e1e6;
}
.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-identity strong,
.profile-identity span {
  display: block;
}
.profile-identity strong {
  max-width: 145px;
  overflow: hidden;
  color: #4e1239;
  font-size: 0.78rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.profile-identity span {
  margin-top: 2px;
  color: #876f7b;
  font-size: 0.64rem;
}
</style>
