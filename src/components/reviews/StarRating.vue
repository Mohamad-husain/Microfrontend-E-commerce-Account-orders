<template>
  <div class="star-rating" :aria-label="`${modelValue} out of 5 stars`">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="readonly"
      :aria-label="`Rate ${star} stars`"
      @click="$emit('update:modelValue', star)"
    ><AppIcon :name="star <= modelValue ? 'star' : 'star-outline'" size="18" /></button>
  </div>
</template>
<script setup>
import AppIcon from "@/components/common/AppIcon.vue";
defineProps({ modelValue: { type: Number, default: 0 }, readonly: Boolean });
defineEmits(["update:modelValue"]);
</script>
<style scoped>
.star-rating { display: inline-flex; gap: 2px; color: #7d2b67; }
button { display: grid; padding: 0; border: 0; color: inherit; background: transparent; cursor: pointer; }
button:disabled { cursor: default; }
</style>
