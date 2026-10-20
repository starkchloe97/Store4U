<script setup>
import { RouterLink } from 'vue-router';
import brandWhite from '@/assets/images/brandWhite.png';
import { SITE_NAME, SITE_PHONE, SITE_PHONE_RAW, SITE_EMAIL, SITE_ADDRESS_LINE1, SITE_ADDRESS_LINE2 } from '@/config/siteInfo.js';
const year = new Date().getFullYear();
</script>
<template>
  <footer class="ftr">
    <div class="wrap">
      <div class="ftr__top">
        <div>
         <RouterLink to="/" class="brand" :aria-label="`${SITE_NAME} home`">
        <img :src="brandWhite"  :alt="`${SITE_NAME} logo`" class="brand__mark" />
      </RouterLink>
          <p class="ftr__about">{{ SITE_NAME }} is an online store for home organization and kitchen essentials from
            top-rated brands. Serving customers across the United States.</p>
          <div class="ftr__pay" aria-label="Accepted payment methods">
            <span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>DISCOVER</span>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li>
              <RouterLink to="/shop/">All Products</RouterLink>
            </li>
            <li>
              <RouterLink to="/collections/home-organization/">Home Organization</RouterLink>
            </li>
            <li>
              <RouterLink to="/collections/kitchen/">Kitchen</RouterLink>
            </li>
            <li>
              <RouterLink to="/collections/cabinet-drawer/">Cabinet &amp; Drawer</RouterLink>
            </li>
            <li>
              <RouterLink to="/collections/closet-entry/">Closet &amp; Entry</RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li>
              <RouterLink to="/contact/">Contact Us</RouterLink>
            </li>
            <li>
              <RouterLink to="/policies/shipping/">Shipping Policy</RouterLink>
            </li>
            <li>
              <RouterLink to="/policies/returns/">Returns &amp; Refunds</RouterLink>
            </li>
            <li>
              <RouterLink to="/faq/">FAQ</RouterLink>
            </li>
            <li>
              <RouterLink to="/policies/warranty/">Warranty</RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li>
              <RouterLink to="/about/">About Us</RouterLink>
            </li>
            <li>
              <RouterLink to="/policies/terms/">Terms of Service</RouterLink>
            </li>
            <li>
              <RouterLink to="/policies/privacy/">Privacy Policy</RouterLink>
            </li>
            <li>
              <RouterLink to="/accessibility/">Accessibility</RouterLink>
            </li>
            <li>
              <RouterLink to="/contact/">Business Inquiries</RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="ftr__legal">
        <div class="ftr__biz">
          <div><strong>Legal Entity</strong>{{ SITE_NAME }}<br>Registered business</div>
          <div><strong>Business Address</strong>
            <address>{{ SITE_NAME }}<br>{{ SITE_ADDRESS_LINE1 }}<br>{{ SITE_ADDRESS_LINE2 }}</address>
          </div>
          <div><strong>Customer Service</strong><a :href="`mailto:${SITE_EMAIL}`">{{ SITE_EMAIL }}</a><br><a :href="`tel:${SITE_PHONE_RAW}`">{{ SITE_PHONE }}</a><br>Mon–Fri, 9:00 AM – 5:00 PM CT<br>Response within 1
            business
            day</div>
        </div>
        <div class="ftr__base"><span>© {{ year }} {{ SITE_NAME }}. All rights reserved. Product names and brands
            belong to their respective owners.</span>
          <nav aria-label="Legal">
            <RouterLink to="/policies/terms/">Terms</RouterLink>
            <RouterLink to="/policies/privacy/">Privacy</RouterLink>
            <RouterLink to="/accessibility/">Accessibility</RouterLink>
            <RouterLink to="/policies/shipping/">Shipping</RouterLink>
            <RouterLink to="/policies/returns/">Returns</RouterLink>
          </nav>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped>
.ftr {
  background: var(--ink);
  color: #B9B5AA;
  padding: clamp(3rem, 5.5vw, 4.5rem) 0 2rem;
  font-size: .86rem
}

.ftr a {
  color: #B9B5AA;
  transition: color .18s
}

.ftr a:hover {
  color: var(--paper)
}

.ftr__top {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, .11)
}

@media(max-width:900px) {
  .ftr__top {
    grid-template-columns: 1fr 1fr;
    gap: 2.25rem
  }
}

@media(max-width:520px) {
  .ftr__top {
    grid-template-columns: 1fr
  }
}

.ftr__brand {
  display: flex;
  align-items: center;
  gap: .6rem;
  margin-bottom: 1.1rem
}

.brand__mark {
  width: auto;
  height: 60px;
}

.brand__mark svg {
  width: 24px;
  height: 24px
}

.ftr__brand>span:last-child {
  font-family: var(--serif);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--paper);
  letter-spacing: -.01em
}

.ftr__about {
  color: #8F8B80;
  font-size: .845rem;
  line-height: 1.7;
  margin-bottom: 1.35rem;
  max-width: 38ch
}

.ftr h4 {
  font-family: var(--sans);
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--paper);
  margin: 0 0 1.05rem
}

.ftr ul {
  list-style: none;
  padding: 0;
  margin: 0
}

.ftr li {
  margin-bottom: .62rem
}

.ftr__legal {
  padding-top: 1.75rem;
  display: grid;
  gap: 1.35rem
}

.ftr__biz {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  font-size: .775rem;
  line-height: 1.65;
  color: #8F8B80;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, .11)
}

@media(max-width:720px) {
  .ftr__biz {
    grid-template-columns: 1fr;
    gap: 1rem
  }
}

.ftr__biz strong {
  color: var(--paper);
  font-weight: 600;
  display: block;
  margin-bottom: .2rem;
  font-size: .72rem;
  letter-spacing: .09em;
  text-transform: uppercase
}

.ftr__biz address {
  font-style: normal
}

.ftr__pay {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  align-items: center
}

.ftr__pay span {
  border: 1px solid rgba(255, 255, 255, .16);
  border-radius: 6px;
  padding: .3rem .6rem;
  font-size: .66rem;
  font-weight: 600;
  letter-spacing: .05em;
  color: #9C988C
}

.ftr__base {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.75rem;
  justify-content: space-between;
  align-items: center;
  font-size: .775rem;
  color: #7C7870
}

.ftr__base nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1.35rem
}
</style>
