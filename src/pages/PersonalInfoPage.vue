<template>
  <AccountLayout>
    <div class="account-grid profile-layout">
      <AccountSidebar />

      <section class="profile-page">
        <header class="profile-heading">
          <p class="eyebrow">My account</p>
          <h1>Welcome back, {{ auth.user?.firstName || "there" }}.</h1>
          <p>Manage your profile, favourites, orders, and beauty rituals.</p>
        </header>

        <div class="profile-summary">
          <article class="member-card">
            <div class="member-card__top">
              <div>
                <p class="eyebrow">LUMÉA membership</p>
                <h2>{{ auth.user?.membership || "LUMÉA Member" }}</h2>
              </div>
              <v-icon size="34">mdi-sparkles</v-icon>
            </div>
            <div class="points-row">
              <strong>{{ auth.user?.rewardPoints || 0 }}</strong>
              <span>reward points</span>
            </div>
            <div class="points-line"><span></span></div>
            <p class="member-card__caption">
              Every ritual brings you closer to your next reward.
            </p>
          </article>

          <article class="activity-card">
            <p class="eyebrow">Your LUMÉA activity</p>
            <div class="activity-list">
              <div>
                <v-icon>mdi-shopping-outline</v-icon>
                <span>
                  <strong>{{ orders.currentUserOrders.length }}</strong>
                  Orders
                </span>
              </div>
              <div>
                <v-icon>mdi-heart-outline</v-icon>
                <span>
                  <strong>{{ wishlist.wishlistCount }}</strong>
                  Saved items
                </span>
              </div>
              <div>
                <v-icon>mdi-star-outline</v-icon>
                <span>
                  <strong>{{ reviews.submittedReviews.length }}</strong>
                  Reviews
                </span>
              </div>
            </div>
          </article>
        </div>

        <section class="details-card" aria-labelledby="personal-details">
          <div class="details-card__heading">
            <div>
              <p class="eyebrow">Personal details</p>
              <h2 id="personal-details">Your profile</h2>
              <p>Keep your account details up to date.</p>
            </div>
            <div class="profile-avatar">
              <v-avatar color="primary" size="58">
                <img
                  v-if="form.avatar"
                  :src="form.avatar"
                  alt="Profile preview"
                />
                <span v-else>{{ auth.initials }}</span>
              </v-avatar>
              <v-btn size="small" variant="text" @click="upload?.click()">
                Change photo
              </v-btn>
              <input
                ref="upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                @change="photo"
              />
            </div>
          </div>

          <v-form class="profile-form" @submit.prevent="save">
            <div class="field-grid">
              <v-text-field
                v-model="form.firstName"
                label="First name"
                variant="solo"
                flat
                :error-messages="errors.firstName"
              />
              <v-text-field
                v-model="form.lastName"
                label="Last name"
                variant="solo"
                flat
                :error-messages="errors.lastName"
              />
              <v-text-field
                v-model="form.email"
                label="Email address"
                type="email"
                variant="solo"
                flat
                :error-messages="errors.email"
              />
              <v-text-field
                v-model="form.phone"
                label="Phone number"
                type="tel"
                variant="solo"
                flat
                :error-messages="errors.phone"
              />
            </div>
            <div class="form-actions">
              <v-btn type="submit" class="save-button">Save changes</v-btn>
              <v-btn variant="text" @click="reset">Cancel</v-btn>
            </div>
          </v-form>
        </section>

        <v-snackbar v-model="snack.show" :color="snack.color">
          {{ snack.text }}
        </v-snackbar>
      </section>
    </div>
  </AccountLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import AccountLayout from "@/layouts/AccountLayout.vue";
import AccountSidebar from "@/components/account/AccountSidebar.vue";
import { useAuthStore } from "@/stores/auth";
import { useOrdersStore } from "@/stores/orders";
import { useReviewsStore } from "@/stores/reviews";
import { useWishlistStore } from "@/stores/wishlist";

const auth = useAuthStore();
const orders = useOrdersStore();
const reviews = useReviewsStore();
const wishlist = useWishlistStore();
const upload = ref(null);
const form = reactive({ ...auth.user });
const errors = reactive({});
const snack = reactive({ show: false, text: "", color: "success" });

onMounted(() => {
  orders.initialize();
  reviews.initialize();
  wishlist.initialize();
});

const notify = (text, color = "success") =>
  Object.assign(snack, { text, color, show: true });

const reset = () => {
  Object.assign(form, auth.user);
  Object.keys(errors).forEach((key) => delete errors[key]);
};

function photo(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 2 * 1024 * 1024
  ) {
    notify("Select a JPG, PNG, or WEBP image under 2 MB.", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => (form.avatar = reader.result);
  reader.readAsDataURL(file);
}

function save() {
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (!form.firstName) errors.firstName = "First name is required.";
  if (!form.lastName) errors.lastName = "Last name is required.";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.phone) errors.phone = "Phone is required.";
  if (Object.keys(errors).length) {
    return notify("Please correct the highlighted fields.", "error");
  }

  const users = JSON.parse(localStorage.getItem("lumea_users") || "[]");
  if (
    users.some(
      (user) =>
        user.id !== auth.user.id &&
        user.email.toLowerCase() === form.email.toLowerCase(),
    )
  ) {
    return notify("That email is already in use.", "error");
  }
  auth.updateCurrentUser(form);
  notify("Your personal information has been saved.");
}
</script>

<style scoped>
.profile-layout {
  align-items: start;
}
.profile-page {
  min-width: 0;
}
.profile-heading {
  margin: 2px 0 25px;
}
.eyebrow {
  margin: 0 0 7px;
  color: #9a5c75;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.profile-heading h1,
.details-card h2,
.member-card h2 {
  font-family: "Playfair Display", Georgia, serif;
}
.profile-heading h1 {
  margin: 0;
  color: #4e1239;
  font-size: clamp(2rem, 3.2vw, 2.85rem);
  letter-spacing: -0.045em;
  line-height: 1.05;
}
.profile-heading > p:last-child,
.details-card__heading > div > p:last-child {
  margin: 8px 0 0;
  color: var(--lumea-muted);
  font-size: 0.84rem;
}
.profile-summary {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(240px, 0.8fr);
  gap: 16px;
  margin-bottom: 18px;
}
.member-card,
.activity-card,
.details-card {
  border: 1px solid #ead9df;
  border-radius: 15px;
}
.member-card {
  padding: 21px 22px;
  color: #5d1648;
  background: linear-gradient(135deg, #f9c6d6, #f7add0);
}
.member-card__top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.member-card__top .eyebrow {
  color: #823957;
}
.member-card h2 {
  margin: 0;
  font-size: 1.25rem;
}
.member-card__top .v-icon {
  color: #d66d9a;
  opacity: 0.7;
}
.points-row {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 19px;
}
.points-row strong {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
}
.points-row span,
.member-card__caption {
  font-size: 0.68rem;
}
.points-line {
  height: 4px;
  margin: 8px 0 9px;
  overflow: hidden;
  border-radius: 3px;
  background: rgb(255 255 255 / 38%);
}
.points-line span {
  display: block;
  width: 58%;
  height: 100%;
  border-radius: inherit;
  background: #65174f;
}
.member-card__caption {
  margin: 0;
  color: #773452;
}
.activity-card {
  padding: 21px 20px;
  background: #fff;
}
.activity-list {
  display: grid;
  gap: 13px;
  margin-top: 15px;
}
.activity-list > div {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6d5863;
  font-size: 0.76rem;
}
.activity-list .v-icon {
  color: #7d2b67;
  font-size: 18px;
}
.activity-list strong {
  margin-right: 3px;
  color: #4e1239;
  font-size: 0.98rem;
}
.details-card {
  padding: 24px;
  background: #fff;
}
.details-card__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}
.details-card h2 {
  margin: 0;
  color: #4e1239;
  font-size: 1.4rem;
}
.profile-avatar {
  display: flex;
  align-items: center;
  gap: 9px;
}
.profile-avatar .v-avatar {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
}
.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-avatar .v-btn {
  color: #6d164f;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: none;
}
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 14px;
}
.profile-form :deep(.v-field) {
  min-height: 46px;
  background: #fffdfd;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px #e5d5db;
  transition:
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}
.profile-form :deep(.v-field--focused) {
  background: #fff;
  box-shadow:
    inset 0 0 0 1px #8b315f,
    0 0 0 3px rgb(139 49 95 / 12%);
}
.profile-form :deep(.v-field__input) {
  font-size: 0.85rem;
}
.profile-form :deep(.v-label) {
  color: #76626e;
  font-size: 0.74rem;
}
.form-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}
.save-button {
  min-height: 42px !important;
  padding: 0 20px;
  border-radius: 9px;
  color: #fff !important;
  background: #66174f !important;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: none;
}
.form-actions .v-btn--variant-text {
  color: #6d164f;
  font-size: 0.78rem;
  text-transform: none;
}
@media (max-width: 860px) {
  .profile-summary {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 620px) {
  .details-card {
    padding: 19px;
  }
  .details-card__heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .field-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
