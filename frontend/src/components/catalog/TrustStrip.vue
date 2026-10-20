<script setup>
// Static trust indicators; no component state is required.
</script>
<template>
  <section class="strip">
    <div class="wrap">
      <div class="strip__in">
        <div class="strip__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M1 3h15v13H1z" />
            <path d="M16 8h4l3 3v5h-7z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <div><strong>Free US Shipping</strong><span>On all orders over $50</span></div>
        </div>
        <div class="strip__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 7v6h6" />
            <path d="M3.5 13a9 9 0 1 0 2.1-9.4L3 7" />
          </svg>
          <div><strong>30-Day Returns</strong><span>Unused items in original packaging, no restocking fee</span></div>
        </div>
        <div class="strip__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div><strong>Real US Support</strong><span>Phone and email, Mon–Fri 9–5 CT</span></div>
        </div>
        <div class="strip__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 5v14M7 5v14M11 5v9M15 5v14M19 5v14" />
          </svg>
          <div><strong>Hundreds of Products</strong><span>Storage and kitchen best sellers in one place</span></div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.strip {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--paper)
}

.strip__in {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--line)
}

.strip__i {
  background: var(--paper);
  padding: 1.6rem 1.25rem;
  display: flex;
  gap: .8rem;
  align-items: flex-start;
  transition: background .2s
}

.strip__i:hover {
  background: var(--sand)
}

.strip__i svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--clay);
  margin-top: 2px
}

.strip__i strong {
  display: block;
  font-size: .845rem;
  font-weight: 600;
  margin-bottom: .14rem
}

.strip__i span {
  font-size: .775rem;
  color: var(--stone);
  line-height: 1.45
}

@media(max-width:820px) {
  .strip__in {
    grid-template-columns: repeat(2, 1fr)
  }
}

@media(max-width:460px) {
  .strip__i {
    padding: 1.1rem .85rem;
    gap: .55rem
  }

  .strip__i strong {
    font-size: .8rem
  }

  .strip__i span {
    font-size: .7rem
  }
}
</style>
