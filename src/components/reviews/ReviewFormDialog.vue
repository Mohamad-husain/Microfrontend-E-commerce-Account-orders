<template>
  <v-dialog v-model="reviews.dialogOpen" max-width="520">
    <v-card class="form-dialog pa-6">
      <p class="eyebrow">Your experience matters</p>
      <h2 class="serif">
        {{
          reviews.editingReview?.status === "pending"
            ? "Write a Review"
            : "Edit Review"
        }}
      </h2>
      <v-rating
        v-model="form.rating"
        color="primary"
        aria-label="Product rating"
        class="my-3"
      />
      <v-alert v-if="error" type="error" density="compact" variant="tonal" class="mb-4">
        {{ error }}
      </v-alert>
      <v-text-field
        v-model="form.title"
        label="Review title"
        variant="outlined"
      /><v-textarea
        v-model="form.comment"
        label="Your review"
        variant="outlined"
      />
      <div class="d-flex justify-end ga-3">
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn class="plum-btn" @click="save">Save review</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import { useReviewsStore } from "@/stores/reviews";
const reviews = useReviewsStore(),
  form = reactive({ rating: 0, title: "", comment: "" });
const error = ref("");
watch(
  () => reviews.editingReview,
  (v) => {
    error.value = "";
    if (v) Object.assign(form, v);
  },
);
function save() {
  if (!form.rating || !form.title.trim() || !form.comment.trim()) {
    error.value = "Please add a rating, title, and review before saving.";
    return;
  }
  reviews.updateReview({
    ...reviews.editingReview,
    ...form,
    status: "submitted",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });
  reviews.closeEditDialog();
}
function close() {
  error.value = "";
  reviews.closeEditDialog();
}
</script>
<style scoped>
.eyebrow {
  margin: 0 0 6px;
  color: #9a5c75;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.form-dialog h2 {
  margin: 0;
  color: #4e1239;
  font-size: 1.65rem;
}
</style>
