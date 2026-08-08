<template>
  <section class="empty-state" :aria-label="title">
    <v-icon :icon="icon" color="primary" size="46" />
    <h2 class="serif">{{ title }}</h2>
    <p>{{ message }}</p>
    <slot name="action" />
  </section>
</template>

<script setup>
defineProps({
  icon: { type: String, default: "mdi-package-variant-closed" },
  title: { type: String, default: "Nothing here yet" },
  message: { type: String, default: "There is nothing to show right now." },
});
</script>

<style scoped>
.empty-state {
  display: grid;
  min-height: 220px;
  place-content: center;
  justify-items: center;
  padding: 2rem;
  color: var(--lumea-muted);
  text-align: center;
}
h2 {
  margin: 14px 0 6px;
  color: var(--lumea-heading);
  font-size: 1.6rem;
}
p {
  max-width: 340px;
  margin: 0;
  font-size: 0.9rem;
}
</style>
