<template>
  <svg
    class="app-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<script setup>
import {
  mdiAccountOutline,
  mdiBagPersonalOutline,
  mdiCheckCircleOutline,
  mdiCreation,
  mdiClose,
  mdiHeart,
  mdiHeartOutline,
  mdiLogout,
  mdiMapMarkerOutline,
  mdiShoppingOutline,
  mdiStar,
  mdiStarOutline,
} from "@mdi/js";
import { computed } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 20 },
});

const icons = {
  account: mdiAccountOutline,
  bag: mdiBagPersonalOutline,
  check: mdiCheckCircleOutline,
  close: mdiClose,
  heart: mdiHeart,
  "heart-outline": mdiHeartOutline,
  logout: mdiLogout,
  location: mdiMapMarkerOutline,
  shopping: mdiShoppingOutline,
  sparkle: mdiCreation,
  star: mdiStar,
  "star-outline": mdiStarOutline,
};
const path = computed(() => icons[props.name] || mdiStarOutline);
</script>

<style scoped>
.app-icon { display: inline-block; flex: 0 0 auto; vertical-align: middle; }
</style>
