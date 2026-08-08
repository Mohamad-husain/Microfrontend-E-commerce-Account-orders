<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="pa-6">
      <h2 class="serif">{{ title }}</h2>
      <p class="mt-3 muted">{{ message }}</p>
      <div class="d-flex justify-end ga-3 mt-6">
        <v-btn variant="text" @click="$emit('update:modelValue', false)">{{
          cancelText
        }}</v-btn>
        <v-btn class="plum-btn" @click="$emit('confirm')">{{
          confirmText
        }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: "Please confirm" },
  message: { type: String, default: "Are you sure you want to continue?" },
  confirmText: { type: String, default: "Confirm" },
  cancelText: { type: String, default: "Cancel" },
});
defineEmits(["update:modelValue", "confirm"]);
</script>

<style scoped>
h2 {
  color: var(--lumea-heading);
  font-size: 1.65rem;
}
p {
  font-size: 0.9rem;
}
</style>
