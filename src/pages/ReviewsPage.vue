<template>
  <AccountLayout>
    <div class="account-grid reviews-layout">
      <AccountSidebar />

      <section class="reviews-page" aria-labelledby="reviews-title">
        <header class="reviews-header">
          <p class="eyebrow">My account</p>
          <h1 id="reviews-title">My reviews</h1>
          <p>Manage your product reviews and share your LUMÉA experience.</p>
        </header>

        <v-tabs v-model="reviews.activeTab" class="review-tabs" color="primary">
          <v-tab value="submitted">
            Submitted reviews
            <span>{{ reviews.submittedReviews.length }}</span>
          </v-tab>
          <v-tab value="pending">
            Pending reviews
            <span>{{ reviews.pendingReviews.length }}</span>
          </v-tab>
        </v-tabs>

        <v-window v-model="reviews.activeTab" class="review-window">
          <v-window-item value="submitted">
            <div v-if="reviews.submittedReviews.length" class="review-list">
              <ReviewCard
                v-for="review in reviews.submittedReviews"
                :key="review.id"
                :review="review"
                @edit="reviews.openEditDialog(review)"
                @delete="pending = review.id"
              />
            </div>
            <p v-else class="empty-copy">
              You have not submitted any reviews yet.
            </p>
          </v-window-item>
          <v-window-item value="pending">
            <div v-if="reviews.pendingReviews.length" class="review-list">
              <ReviewCard
                v-for="review in reviews.pendingReviews"
                :key="review.id"
                :review="review"
                pending
                @edit="reviews.openEditDialog(review)"
              />
            </div>
            <p v-else class="empty-copy">
              There are no products waiting for your review.
            </p>
          </v-window-item>
        </v-window>

        <ReviewFormDialog />
        <ConfirmDialog
          v-model="confirm"
          title="Delete review?"
          message="This review will be permanently removed."
          confirm-text="Delete"
          @confirm="remove"
        />
        <v-snackbar v-model="snack.show" color="success">
          {{ snack.text }}
        </v-snackbar>
      </section>
    </div>
  </AccountLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import AccountLayout from "@/layouts/AccountLayout.vue";
import AccountSidebar from "@/components/account/AccountSidebar.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import ReviewCard from "@/components/reviews/ReviewCard.vue";
import ReviewFormDialog from "@/components/reviews/ReviewFormDialog.vue";
import { useReviewsStore } from "@/stores/reviews";

const reviews = useReviewsStore();
const pending = ref(null);
const snack = reactive({ show: false, text: "" });
const confirm = computed({
  get: () => Boolean(pending.value),
  set: (value) => {
    if (!value) pending.value = null;
  },
});

onMounted(() => reviews.initialize());

function remove() {
  reviews.deleteReview(pending.value);
  pending.value = null;
  snack.text = "Review deleted.";
  snack.show = true;
}
</script>

<style scoped>
.reviews-layout {
  align-items: start;
}
.reviews-page {
  min-width: 0;
}
.reviews-header {
  margin: 3px 0 20px;
}
.eyebrow {
  margin: 0 0 7px;
  color: #9a5c75;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.reviews-header h1 {
  margin: 0;
  color: #4e1239;
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2rem, 3vw, 2.65rem);
  letter-spacing: -0.045em;
  line-height: 1.04;
}
.reviews-header > p:last-child {
  margin: 8px 0 0;
  color: var(--lumea-muted);
  font-size: 0.82rem;
}
.review-tabs {
  border-bottom: 1px solid #eadde1;
}
.review-tabs :deep(.v-tab) {
  min-width: 0;
  padding: 0 12px;
  color: #806a75;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
}
.review-tabs :deep(.v-tab:first-child) {
  padding-left: 0;
}
.review-tabs :deep(.v-tab span) {
  margin-left: 5px;
  color: #9f7587;
  font-size: 0.63rem;
}
.review-window {
  padding-top: 18px;
}
.review-list {
  max-width: 760px;
}
.empty-copy {
  padding: 28px 0;
  color: #88717d;
  font-size: 0.8rem;
}
@media (max-width: 560px) {
  .review-tabs :deep(.v-tab) {
    padding: 0 8px;
    font-size: 0.65rem;
  }
}
</style>
