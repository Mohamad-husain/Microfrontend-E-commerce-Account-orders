<template>
  <footer>
    <div class="grid">
      <div>
        <LumeaLogo />
        <p>Elevating your daily ritual with luxurious, modernist essentials.</p>
      </div>
      <div>
        <b>Discover</b
        ><a
          v-for="x in ['About Us', 'Find a Store']"
          :key="x"
          href="#"
          @click.prevent="external(x)"
          >{{ x }}</a
        >
      </div>
      <div>
        <b>Support</b
        ><a
          v-for="x in ['Shipping & Returns', 'Track Order', 'Privacy Policy']"
          :key="x"
          href="#"
          @click.prevent="external(x)"
          >{{ x }}</a
        >
      </div>
      <div>
        <b>Stay Connected</b>
        <p>Join our newsletter for exclusive access.</p>
        <div class="subscribe">
          <input aria-label="Email address" placeholder="Email Address" /><v-btn
            class="plum-btn"
            @click="external('newsletter')"
            >Subscribe</v-btn
          >
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
import LumeaLogo from "./LumeaLogo.vue";
function external(destination) {
  console.info(`LUMÉA external navigation placeholder: ${destination}`);
}
</script>
<style scoped>
footer {
  margin-top: 48px;
  padding: 38px var(--lumea-page-gutter);
  background: var(--lumea-footer);
}
.grid {
  max-width: 1240px;
  margin: auto;
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 36px;
}
p,
a {
  display: block;
  margin: 10px 0;
  color: #7a6570;
  font-size: 11px;
  line-height: 1.5;
}
a {
  text-decoration: none;
}
.subscribe {
  display: flex;
}
.subscribe input {
  min-width: 0;
  width: 100%;
  border: 1px solid var(--lumea-border);
  padding: 9px;
  border-radius: 7px 0 0 7px;
}
.subscribe .v-btn {
  border-radius: 0 7px 7px 0;
}
@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
</style>
