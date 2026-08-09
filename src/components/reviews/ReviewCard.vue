<template>
  <article class="review-card" :class="{ 'is-pending': pending }">
    <div class="review-image-wrap">
      <img :src="productImage" :alt="product?.name || 'LUMÉA product'" />
    </div>

    <div class="review-content">
      <div class="review-topline">
        <div>
          <p class="product-brand">{{ product?.brand || "LUMÉA" }}</p>
          <h2>{{ product?.name || "LUMÉA product" }}</h2>
        </div>
        <time v-if="review.date">{{ review.date }}</time>
      </div>

      <template v-if="!pending">
        <StarRating :model-value="review.rating" readonly />
        <h3>{{ review.title }}</h3>
        <p class="review-comment">{{ review.comment }}</p>
        <div class="review-actions">
          <button type="button" @click="$emit('edit')">Edit</button>
          <button type="button" @click="$emit('delete', review.id)">
            Delete
          </button>
        </div>
      </template>

      <template v-else>
        <p class="pending-copy">
          Purchased LUMÉA essential · Share your experience.
        </p>
        <v-btn size="small" class="write-button" @click="$emit('edit')">
          Write a review
        </v-btn>
      </template>
    </div>
  </article>
</template>

<script setup>
import { computed, inject } from "vue";
import StarRating from "./StarRating.vue";

const props = defineProps({ review: Object, pending: Boolean });
defineEmits(["edit", "delete"]);

const product = computed(() =>
  JSON.parse(localStorage.getItem("lumea_products") || "[]").find(
    (item) => item.id === props.review.productId,
  ),
);
const assetBase = inject("beauty-asset-base", "/");
const productImage = computed(() => {
  const image = product.value?.image || "";
  return image.startsWith("/") ? `${assetBase}${image.slice(1)}` : image;
});
</script>

<style scoped>
.review-card {
  display: flex;
  gap: 16px;
  padding: 13px;
  border: 1px solid #eadde1;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 5px 16px rgb(74 13 55 / 3%);
}
.review-card + .review-card {
  margin-top: 12px;
}
.review-image-wrap {
  flex: 0 0 94px;
  width: 94px;
  height: 112px;
  overflow: hidden;
  border-radius: 8px;
  background: #f5e9ed;
}
.review-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.review-content {
  min-width: 0;
  flex: 1;
}
.review-topline {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.product-brand {
  margin: 0 0 3px;
  color: #9a5c75;
  font-size: 0.57rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.review-topline h2 {
  margin: 0;
  color: #4e1239;
  font-size: 0.78rem;
  font-weight: 700;
}
.review-topline time {
  flex: 0 0 auto;
  color: #957c88;
  font-size: 0.61rem;
}
.review-content :deep(.v-rating) {
  margin: 3px 0 0 -5px;
}
.review-content h3 {
  margin: 3px 0 4px;
  color: #5c1742;
  font-size: 0.79rem;
  font-weight: 700;
}
.review-comment {
  margin: 0;
  color: #775f6c;
  font-size: 0.69rem;
  line-height: 1.45;
}
.review-actions {
  display: flex;
  gap: 13px;
  margin-top: 8px;
}
.review-actions button {
  padding: 0;
  border: 0;
  color: #72174f;
  background: none;
  cursor: pointer;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.pending-copy {
  margin: 11px 0;
  color: #79636e;
  font-size: 0.71rem;
}
.write-button {
  min-height: 29px !important;
  border-radius: 7px;
  color: #fff !important;
  background: #66174f !important;
  font-size: 0.67rem;
  font-weight: 700;
  text-transform: none;
}
.is-pending {
  background: #fffafb;
}
@media (max-width: 520px) {
  .review-card {
    gap: 11px;
  }
  .review-image-wrap {
    flex-basis: 76px;
    width: 76px;
    height: 96px;
  }
  .review-topline {
    flex-direction: column;
    gap: 4px;
  }
  .review-topline time {
    font-size: 0.58rem;
  }
}
</style>
