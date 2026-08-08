<template>
  <div class="loading-state" role="status" aria-live="polite">
    <v-progress-circular indeterminate color="primary" size="36" width="3" />
    <p>{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: "Loading your LUMÉA experience…" },
});
</script>

<style scoped>
.loading-state {
  display: grid;
  min-height: 180px;
  place-content: center;
  justify-items: center;
  gap: 14px;
  color: var(--lumea-muted);
  text-align: center;
}
.loading-state p {
  margin: 0;
  font-size: 0.875rem;
}
</style>
