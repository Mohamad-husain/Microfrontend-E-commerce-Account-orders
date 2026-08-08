<template>
  <v-dialog v-model="reviews.dialogOpen" max-width="520"
    ><v-card class="form-dialog pa-6"
      ><h2 class="serif">
        {{
          reviews.editingReview?.status === "pending"
            ? "Write a Review"
            : "Edit Review"
        }}
      </h2>
      <v-rating
        v-model="form.rating"
        color="primary"
        class="my-3"
      /><v-text-field
        v-model="form.title"
        label="Review title"
        variant="outlined"
      /><v-textarea
        v-model="form.comment"
        label="Your review"
        variant="outlined"
      />
      <div class="d-flex justify-end ga-3">
        <v-btn variant="text" @click="reviews.closeEditDialog">Cancel</v-btn
        ><v-btn class="plum-btn" @click="save">Save Review</v-btn>
      </div></v-card
    ></v-dialog
  >
</template>
<script setup>
import { reactive, watch } from "vue";
import { useReviewsStore } from "@/stores/reviews";
const reviews = useReviewsStore(),
  form = reactive({ rating: 0, title: "", comment: "" });
watch(
  () => reviews.editingReview,
  (v) => v && Object.assign(form, v),
);
function save() {
  if (!form.rating || !form.title || !form.comment) return;
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
</script>
