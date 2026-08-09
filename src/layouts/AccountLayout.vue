<template>
  <AppHeader v-if="!hideChrome" />
  <main class="account-shell"><slot /></main>
  <AppFooter v-if="!hideChrome" />
</template>
<script setup>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import { inject } from "vue";
const hideChrome = inject("beauty-hide-chrome", false);
</script>
<style scoped>
.account-shell {
  max-width: 1240px;
  margin: auto;
  padding: 38px var(--lumea-page-gutter) 46px;
}
@media (max-width: 720px) {
  .account-shell {
    padding-top: 25px;
  }
}
</style>
