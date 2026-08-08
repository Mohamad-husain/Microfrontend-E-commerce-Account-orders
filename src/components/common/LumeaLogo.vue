<template>
  <button class="lumea-logo" aria-label="Luméa home" @click="go">LUMÉA</button>
</template>
<script setup>
import { emitIntegrationEvent } from "@/services/integrationService";
const go = () =>
  emitIntegrationEvent("lumea:navigate-to-store", { section: "home" });
</script>
<style scoped>
button {
  background: none;
  border: 0;
  cursor: pointer;
}
</style>
