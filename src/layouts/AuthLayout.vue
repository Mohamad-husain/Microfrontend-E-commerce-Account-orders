<template>
  <div class="auth-wrap">
    <div class="auth-shell">
      <section class="auth-pane">
        <LumeaLogo />
        <div class="auth-content"><slot /></div>
      </section>
      <aside class="auth-art" :class="art">
        <div class="auth-art-text">
          <h2>{{ title }}</h2>
          <p>{{ subtitle }}</p>
        </div>
      </aside>
    </div>
  </div>
</template>
<script setup>
import LumeaLogo from "@/components/common/LumeaLogo.vue";
defineProps({
  title: String,
  subtitle: String,
  art: { type: String, default: "login-art" },
});
</script>
<style scoped>
.auth-wrap {
  min-height: 100vh;
  background: #fffafb;
  padding: 0;
  display: grid;
  place-items: center;
}
.auth-shell {
  width: min(1200px, 100%);
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr);
  overflow: hidden;
  background: #fffafb;
}
.auth-pane {
  padding: 42px clamp(32px, 6vw, 88px);
}
.auth-content {
  max-width: 368px;
  margin: clamp(58px, 12vh, 118px) auto 0;
}
.auth-art {
  position: relative;
  min-height: 100%;
  background-size: cover;
  background-position: center;
}
.auth-art:before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 46%, rgb(54 25 37 / 0.74));
}
.login-art {
  background-image: url("/images/login-hero.jpg");
  background-position: 42% center;
}
.register-art {
  background-image: url("/images/products/perfume.svg");
  background-size: 100% 100%;
  background-color: #e6cdc5;
}
.auth-art-text {
  position: absolute;
  z-index: 1;
  bottom: 52px;
  left: clamp(32px, 5vw, 64px);
  right: clamp(32px, 5vw, 64px);
  color: #fff;
}
.auth-art-text h2 {
  font-family: "Playfair Display", serif;
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  margin: 0;
}
.auth-art-text p {
  font-size: 13px;
  line-height: 1.5;
  max-width: 360px;
}
@media (max-width: 960px) {
  .auth-shell {
    display: block;
  }
  .auth-art {
    display: none;
  }
  .auth-pane {
    min-height: 100vh;
  }
}
@media (max-width: 720px) {
  .auth-wrap {
    padding: 0;
  }
  .auth-shell {
    display: block;
    min-height: 100vh;
    border-radius: 0;
  }
  .auth-pane {
    padding: 28px 24px;
  }
  .auth-content {
    margin: 62px auto 0;
  }
}
</style>
