<script setup>
import { RouterLink } from 'vue-router';
import { useStorefront } from '@/composables/useStorefront.js';
const { state } = useStorefront();
</script>
<template>
  <nav class="mbnav" aria-label="Mobile navigation">
    <div class="mbnav__in">
      <RouterLink to="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>Home</RouterLink>
      <RouterLink to="/shop/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>Shop</RouterLink>
      <button type="button" @click="state.searchOpen = true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>Search</button>
      <RouterLink to="/contact/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>Help</RouterLink>
    </div>
  </nav>
</template>
<style scoped>
.mbnav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(251, 250, 247, .97);
  backdrop-filter: blur(14px);
  border-top: 1px solid var(--line);
  z-index: 55;
  padding: .5rem .5rem calc(.5rem + env(safe-area-inset-bottom))
}

.mbnav__in {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .25rem
}

.mbnav a,
.mbnav button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .2rem;
  padding: .45rem .25rem;
  font-size: .62rem;
  font-weight: 500;
  color: var(--stone);
  border-radius: 10px;
  transition: color .18s, background .18s
}

.mbnav a:hover,
.mbnav button:hover {
  color: var(--ink);
  background: var(--sand)
}

.mbnav svg {
  width: 20px;
  height: 20px
}

@media(max-width:940px) {
  .mbnav {
    display: block
  }
}
</style>
