<template>
  <v-rating
    :model-value="modelValue"
    :readonly="readonly"
    color="primary"
    density="compact"
    size="17"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
<script setup>
defineProps({ modelValue: { type: Number, default: 0 }, readonly: Boolean });
defineEmits(["update:modelValue"]);
</script>
