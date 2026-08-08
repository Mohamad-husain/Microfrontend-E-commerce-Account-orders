<template>
  <v-chip
    size="x-small"
    class="status-chip"
    :color="colors[status] || 'grey'"
    variant="tonal"
    >{{ status }}</v-chip
  >
</template>
<script setup>
defineProps({ status: String });
const colors = {
  Processing: "warning",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "error",
};
</script>
