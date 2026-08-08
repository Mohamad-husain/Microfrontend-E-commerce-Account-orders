<template>
  <main class="login-page">
    <section class="login-panel" aria-labelledby="login-title">
      <LumeaLogo />

      <div class="login-content">
        <p class="eyebrow">Your beauty ritual</p>
        <h1 id="login-title">Welcome back.</h1>
        <p class="intro">
          Sign in to revisit your favourites, reviews, and orders.
        </p>

        <v-form class="login-form" @submit.prevent="submit">
          <v-text-field
            v-model="email"
            label="Email address"
            type="email"
            autocomplete="email"
            variant="solo"
            flat
            :error-messages="errors.email"
          />
          <v-text-field
            v-model="password"
            label="Password"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="
              show ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            autocomplete="current-password"
            variant="solo"
            flat
            :error-messages="errors.password"
            @click:append-inner="show = !show"
          />

          <div class="login-options">
            <v-checkbox
              v-model="remember"
              label="Remember me"
              density="compact"
              hide-details
            />
            <a
              href="#"
              @click.prevent="
                snack('Password recovery is not connected to a backend.')
              "
            >
              Forgot password?
            </a>
          </div>

          <v-alert
            v-if="auth.error"
            type="error"
            density="compact"
            closable
            class="login-alert"
            @click:close="auth.clearError()"
          >
            {{ auth.error }}
          </v-alert>

          <v-btn
            type="submit"
            block
            class="login-button"
            :loading="auth.loading"
          >
            Sign in
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

        <p class="signup-prompt">
          New to LUMÉA?
          <router-link to="/register">Create an account</router-link>
        </p>
      </div>
    </section>

    <aside class="visual-panel" aria-label="LUMÉA skincare collection">
      <img src="/images/login-hero.jpg" alt="LUMÉA skincare collection" />
      <div class="visual-overlay"></div>
      <div class="visual-copy">
        <p class="visual-kicker">LUMÉA Rituals</p>
        <h2>
          Small moments,
          <br />
          beautifully yours.
        </h2>
        <p>
          Thoughtful beauty essentials to make every day feel a little more
          luminous.
        </p>
      </div>
    </aside>

    <v-snackbar v-model="showSnack" color="primary">{{ message }}</v-snackbar>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import LumeaLogo from "@/components/common/LumeaLogo.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const email = ref("");
const password = ref("");
const remember = ref(false);
const show = ref(false);
const errors = ref({});
const showSnack = ref(false);
const message = ref("");

const snack = (text) => {
  message.value = text;
  showSnack.value = true;
};

async function submit() {
  errors.value = {};

  if (!email.value) errors.value.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = "Enter a valid email address.";
  }

  if (!password.value) errors.value.password = "Password is required.";
  if (Object.keys(errors.value).length) return;

  if (await auth.login(email.value, password.value, remember.value)) {
    router.push(String(route.query.redirect || "/account"));
  }
}
</script>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(440px, 1.05fr);
  min-height: 100vh;
  padding: 18px;
  background: #f5efed;
}

.login-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 30px clamp(34px, 6vw, 88px) 34px;
}

.login-content {
  width: min(100%, 378px);
  margin: auto;
  padding: 54px 0 32px;
}

.eyebrow,
.visual-kicker {
  margin: 0 0 14px;
  color: #9a5c75;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h1,
h2 {
  font-family: "Playfair Display", Georgia, serif;
}

h1 {
  margin: 0;
  color: #4e1239;
  font-size: clamp(2.2rem, 3.2vw, 3.25rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.intro {
  max-width: 330px;
  margin: 19px 0 32px;
  color: #786572;
  font-size: 0.88rem;
  line-height: 1.6;
}

.login-form :deep(.v-field) {
  min-height: 48px;
  background: #fffdfd;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px #e5d5db;
  transition:
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.login-form :deep(.v-field__input) {
  color: #412837;
  font-size: 0.86rem;
}

.login-form :deep(.v-label) {
  color: #7c6a75;
  font-size: 0.75rem;
}

.login-form :deep(.v-field--focused) {
  background: #fff;
  box-shadow:
    inset 0 0 0 1px #8b315f,
    0 0 0 3px rgb(139 49 95 / 12%);
}

.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 2px 0 22px;
}

.login-options :deep(.v-checkbox) {
  margin: 0;
}

.login-options :deep(.v-label) {
  color: #67535f;
  font-size: 0.74rem;
}

.login-options a,
.signup-prompt a {
  color: #6d164f;
  font-size: 0.74rem;
  font-weight: 700;
  text-decoration: none;
}

.login-options a:hover,
.signup-prompt a:hover {
  text-decoration: underline;
}

.login-alert {
  margin: 0 0 16px;
  border-radius: 10px;
  font-size: 0.78rem;
}

.login-button {
  min-height: 48px !important;
  border-radius: 10px;
  color: #fff !important;
  background: #66174f !important;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-transform: none;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 25px 0 18px;
  color: #927a86;
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.divider::before,
.divider::after {
  width: 1px;
  height: 1px;
  flex: 1;
  background: #e1d1d7;
  content: "";
}

.google-button {
  min-height: 46px !important;
  border: 1px solid #decfd4 !important;
  border-radius: 10px;
  color: #563644 !important;
  background: transparent !important;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: none;
}

.signup-prompt {
  margin: 25px 0 0;
  color: #806d78;
  font-size: 0.74rem;
  text-align: center;
}

.visual-panel {
  position: relative;
  min-height: calc(100vh - 36px);
  overflow: hidden;
  border-radius: 26px;
  background: #d9c4bb;
}

.visual-panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 43% center;
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(33 17 24 / 0.04) 35%,
    rgb(45 18 31 / 0.7)
  );
}

.visual-copy {
  position: absolute;
  right: clamp(30px, 5vw, 68px);
  bottom: clamp(36px, 6vh, 72px);
  left: clamp(30px, 5vw, 68px);
  color: #fff;
}

.visual-kicker {
  color: #f3dadd;
}

.visual-copy h2 {
  margin: 0;
  font-size: clamp(2rem, 3.2vw, 3.15rem);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1.02;
}

.visual-copy > p:last-child {
  max-width: 330px;
  margin: 18px 0 0;
  color: #fff8fa;
  font-size: 0.87rem;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .login-page {
    display: block;
    padding: 0;
  }

  .login-panel {
    min-height: 100vh;
  }

  .visual-panel {
    display: none;
  }
}

@media (max-width: 560px) {
  .login-panel {
    padding: 26px 24px 30px;
  }

  .login-content {
    padding: 68px 0 22px;
  }

  h1 {
    font-size: 2.45rem;
  }
}
</style>
