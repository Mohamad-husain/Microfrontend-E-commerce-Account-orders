<template>
  <main class="register-page">
    <aside class="register-visual" aria-label="LUMÉA botanical radiance serum">
      <img
        :src="registerHero"
        alt="LUMÉA botanical radiance serum"
      />
      <div class="visual-shade"></div>
      <div class="visual-copy">
        <p>Made for your ritual</p>
        <h2>
          Begin with
          <br />
          a little glow.
        </h2>
        <span>Thoughtful beauty, beautifully uncomplicated.</span>
      </div>
    </aside>

    <section class="register-panel" aria-labelledby="register-title">
      <div class="register-topbar">
        <LumeaLogo />
        <router-link to="/login">Sign in</router-link>
      </div>

      <div class="register-content">
        <p class="eyebrow">Create your account</p>
        <h1 id="register-title">
          Your LUMÉA
          <br />
          starts here.
        </h1>
        <p class="intro">
          Join to save your favourites, write reviews, and keep track of every
          order.
        </p>

        <v-form class="register-form" @submit.prevent="submit">
          <div class="name-fields">
            <v-text-field
              v-model="form.firstName"
              label="First name"
              autocomplete="given-name"
              variant="solo"
              flat
              :error-messages="errors.firstName"
            />
            <v-text-field
              v-model="form.lastName"
              label="Last name"
              autocomplete="family-name"
              variant="solo"
              flat
              :error-messages="errors.lastName"
            />
          </div>
          <v-text-field
            v-model="form.email"
            label="Email address"
            type="email"
            autocomplete="email"
            variant="solo"
            flat
            :error-messages="errors.email"
          />
          <v-text-field
            v-model="form.phone"
            label="Phone number"
            type="tel"
            autocomplete="tel"
            variant="solo"
            flat
            :error-messages="errors.phone"
          />
          <v-text-field
            v-model="form.password"
            label="Password"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="
              show ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            autocomplete="new-password"
            variant="solo"
            flat
            hide-details
            @click:append-inner="show = !show"
          />
          <v-progress-linear
            :model-value="strength"
            color="primary"
            height="3"
            rounded
            class="strength-meter"
          />
          <p
            class="password-feedback"
            :class="{ 'is-error': errors.password }"
            :aria-live="errors.password ? 'polite' : 'off'"
          >
            <v-icon v-if="errors.password" size="15">
              mdi-alert-circle-outline
            </v-icon>
            {{
              errors.password ||
              "Use 8+ characters with uppercase, lowercase, and a number."
            }}
          </p>
          <v-text-field
            v-model="form.confirmPassword"
            label="Confirm password"
            :type="showConfirm ? 'text' : 'password'"
            :append-inner-icon="
              showConfirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            autocomplete="new-password"
            variant="solo"
            flat
            :error-messages="errors.confirmPassword"
            @click:append-inner="showConfirm = !showConfirm"
          />
          <v-checkbox
            v-model="terms"
            density="compact"
            hide-details="auto"
            :error-messages="errors.terms"
          >
            <template #label>
              I agree to the Terms & Conditions and Privacy Policy.
            </template>
          </v-checkbox>
          <v-alert
            v-if="error"
            type="error"
            density="compact"
            closable
            class="register-alert"
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>
          <v-btn type="submit" block class="create-button">
            Create my account
          </v-btn>
        </v-form>

        <div class="divider"><span>or continue with</span></div>
        <v-btn
          block
          variant="outlined"
          prepend-icon="mdi-google"
          class="google-button"
          @click="snack('Google sign-in is unavailable in this mock project.')"
        >
          Continue with Google
        </v-btn>
      </div>
    </section>

    <v-snackbar v-model="showSnack" color="success">{{ message }}</v-snackbar>
  </main>
</template>

<script setup>
import { computed, inject, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import LumeaLogo from "@/components/common/LumeaLogo.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});
const errors = ref({});
const error = ref("");
const terms = ref(false);
const show = ref(false);
const showConfirm = ref(false);
const showSnack = ref(false);
const message = ref("");
const assetBase = inject("beauty-asset-base", "/");
const registerHero = `${assetBase}images/register-hero.jpg`;

const strength = computed(() =>
  Math.min(
    100,
    (form.password.length >= 8 ? 40 : 0) +
      (/[A-Z]/.test(form.password) ? 20 : 0) +
      (/[a-z]/.test(form.password) ? 20 : 0) +
      (/\d/.test(form.password) ? 20 : 0),
  ),
);

const snack = (text) => {
  message.value = text;
  showSnack.value = true;
};

async function submit() {
  errors.value = {};
  error.value = "";

  for (const key of ["firstName", "lastName", "phone"]) {
    if (!form[key]) errors.value[key] = "This field is required.";
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.value.email = "Enter a valid email address.";
  }
  if (strength.value < 100) {
    errors.value.password =
      "Use 8+ characters with uppercase, lowercase, and a number.";
  }
  if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = "Passwords must match.";
  }
  if (!terms.value) errors.value.terms = "Please accept the terms.";
  if (Object.keys(errors.value).length) return;

  try {
    await auth.register(form);
    snack("Your LUMÉA account has been created.");
    router.push("/account");
  } catch (caughtError) {
    error.value = caughtError.message;
  }
}
</script>

<style scoped>
.register-page {
  display: grid;
  grid-template-columns: minmax(440px, 0.96fr) minmax(0, 1.04fr);
  min-height: 100vh;
  padding: 18px;
  background: #f5efed;
}

.register-visual {
  position: relative;
  min-height: calc(100vh - 36px);
  overflow: hidden;
  border-radius: 26px;
  background: #d8d0cb;
}

.register-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.visual-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(54 35 38 / 0.03) 42%,
    rgb(54 27 35 / 0.68)
  );
}

.visual-copy {
  position: absolute;
  right: clamp(30px, 5vw, 72px);
  bottom: clamp(36px, 6vh, 72px);
  left: clamp(30px, 5vw, 72px);
  color: #fff;
}

.visual-copy p {
  margin: 0 0 12px;
  color: #f6dce2;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.visual-copy h2,
h1 {
  font-family: "Playfair Display", Georgia, serif;
}

.visual-copy h2 {
  margin: 0;
  font-size: clamp(2rem, 3.3vw, 3.25rem);
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1.01;
}

.visual-copy span {
  display: block;
  max-width: 275px;
  margin-top: 17px;
  color: #fff7f8;
  font-size: 0.82rem;
  line-height: 1.55;
}

.register-panel {
  min-width: 0;
  padding: 30px clamp(34px, 6vw, 90px) 44px;
}

.register-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.register-topbar > a {
  color: #6e194f;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
}

.register-content {
  width: min(100%, 430px);
  margin: 54px auto 0;
  padding-bottom: 30px;
}

.eyebrow {
  margin: 0 0 13px;
  color: #9a5c75;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #4e1239;
  font-size: clamp(2.25rem, 3.25vw, 3.3rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.intro {
  max-width: 382px;
  margin: 18px 0 26px;
  color: #786572;
  font-size: 0.87rem;
  line-height: 1.58;
}

.name-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.register-form :deep(.v-field) {
  min-height: 46px;
  background: #fffdfd;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px #e5d5db;
  transition:
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.register-form :deep(.v-field--focused) {
  background: #fff;
  box-shadow:
    inset 0 0 0 1px #8b315f,
    0 0 0 3px rgb(139 49 95 / 12%);
}

.register-form :deep(.v-field__input) {
  font-size: 0.85rem;
}

.register-form :deep(.v-label),
.register-form :deep(.v-checkbox .v-label) {
  color: #76626e;
  font-size: 0.74rem;
}

.strength-meter {
  margin: 5px 2px 0;
}

.password-feedback {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  min-height: 18px;
  margin: 7px 1px 13px;
  color: #8a7480;
  font-size: 0.69rem;
  line-height: 1.35;
}

.password-feedback.is-error {
  margin-top: 8px;
  padding: 7px 9px;
  border: 1px solid #f1c8d0;
  border-radius: 7px;
  color: #a32236;
  background: #fff2f4;
}

.register-form :deep(.v-checkbox) {
  margin: 1px 0 18px;
}

.register-alert {
  margin-bottom: 14px;
  border-radius: 10px;
  font-size: 0.78rem;
}

.create-button {
  min-height: 47px !important;
  border-radius: 10px;
  color: #fff !important;
  background: #66174f !important;
  font-size: 0.84rem;
  font-weight: 700;
  text-transform: none;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 23px 0 17px;
  color: #927a86;
  font-size: 0.63rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.divider::before,
.divider::after {
  height: 1px;
  flex: 1;
  background: #e1d1d7;
  content: "";
}

.google-button {
  min-height: 45px !important;
  border: 1px solid #decfd4 !important;
  border-radius: 10px;
  color: #563644 !important;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: none;
}

@media (max-width: 900px) {
  .register-page {
    display: block;
    padding: 0;
  }

  .register-visual {
    display: none;
  }

  .register-panel {
    min-height: 100vh;
  }
}

@media (max-width: 560px) {
  .register-panel {
    padding: 26px 24px 34px;
  }

  .register-content {
    margin-top: 48px;
  }

  .name-fields {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
