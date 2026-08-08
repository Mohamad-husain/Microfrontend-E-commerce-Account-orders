<template>
  <article class="wishlist-card">
    <div class="product-visual">
      <span class="saved-label">Saved item</span>
      <img :src="product.image" :alt="product.name" class="product-image" />
      <v-btn
        icon
        size="x-small"
        variant="flat"
        class="remove-button"
        aria-label="Remove from wishlist"
        @click="$emit('remove')"
      >
        <v-icon size="15">mdi-close</v-icon>
      </v-btn>
    </div>

    <div class="product-content">
      <p class="product-brand">{{ product.brand }}</p>
      <h2>{{ product.name }}</h2>
      <p class="product-detail">{{ product.shade }}</p>
      <div class="price-row">
        <strong>${{ product.price.toFixed(2) }}</strong>
        <s v-if="product.oldPrice">${{ product.oldPrice.toFixed(2) }}</s>
        <span v-if="!product.inStock" class="out-of-stock">Out of stock</span>
      </div>
      <v-btn
        block
        size="small"
        class="move-button"
        :disabled="!product.inStock"
        @click="$emit('move', product.id)"
      >
        <v-icon start size="16">mdi-shopping-outline</v-icon>
        Move to bag
      </v-btn>
    </div>
  </article>
</template>

<script setup>
defineProps({ product: Object });
defineEmits(["remove", "move"]);
</script>

<style scoped>
.wishlist-card {
  overflow: hidden;
  border: 1px solid #eadce1;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 18px rgb(74 13 55 / 4%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.wishlist-card:hover {
  box-shadow: 0 12px 24px rgb(74 13 55 / 9%);
  transform: translateY(-3px);
}
.product-visual {
  position: relative;
  overflow: hidden;
  background: #f9f0f2;
}
.product-image {
  display: block;
  width: 100%;
  height: 196px;
  object-fit: cover;
}
.saved-label {
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 10px;
  padding: 5px 7px;
  border-radius: 99px;
  color: #775260;
  background: rgb(255 255 255 / 82%);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.remove-button {
  position: absolute;
  top: 9px;
  right: 9px;
  min-width: 27px !important;
  width: 27px;
  height: 27px;
  color: #775260;
  background: #fff !important;
}
.product-content {
  padding: 15px;
}
.product-brand {
  margin: 0 0 5px;
  color: #9a5c75;
  font-size: 0.59rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
h2 {
  min-height: 34px;
  margin: 0;
  color: #4d1b39;
  font-size: 0.81rem;
  font-weight: 700;
  line-height: 1.35;
}
.product-detail {
  min-height: 18px;
  margin: 4px 0 9px;
  color: #896f7b;
  font-size: 0.67rem;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 20px;
}
.price-row strong {
  color: #4e1239;
  font-size: 0.8rem;
}
.price-row s {
  color: #a68b96;
  font-size: 0.67rem;
}
.out-of-stock {
  color: #b3261e;
  font-size: 0.63rem;
  font-weight: 700;
}
.move-button {
  min-height: 35px !important;
  margin-top: 13px;
  border-radius: 8px;
  color: #fff !important;
  background: #66174f !important;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: none;
}
</style>
