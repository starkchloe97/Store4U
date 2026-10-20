<script setup>
import { computed } from 'vue';
import PageHero from '@/components/shared/PageHero.vue';
import LegalContent from '@/components/shared/LegalContent.vue';
import policies from '@/data/policies.json';
import { SITE_PHONE, SITE_ADDRESS_ONE_LINE, SITE_ADDRESS_LINE1, SITE_ADDRESS_LINE2, SITE_ADDRESS_LOCALITY, SITE_ADDRESS_REGION, SITE_ADDRESS_POSTAL_CODE, SITE_ADDRESS_COUNTRY } from '@/config/siteInfo.js';

const props = defineProps({
  policyKey: { type: String, required: true }
});
function resolveSiteInfo(value) {
  if (typeof value === 'string') {
    return value
      .replace(/\(236\)\s*506-1948/g, SITE_PHONE)
      .replace(/\+1?-?236-506-1948/g, SITE_PHONE)
      .replace(/10228 E Northwest Hwy,?\s*Dallas, TX 75238(?:, United States)?/gi, SITE_ADDRESS_ONE_LINE)
      .replace(/10228 E Northwest Hwy/gi, SITE_ADDRESS_LINE1)
      .replace(/Dallas, TX 75238(?:, United States)?/gi, `${SITE_ADDRESS_LOCALITY}, ${SITE_ADDRESS_REGION} ${SITE_ADDRESS_POSTAL_CODE}`)
      .replace(/Dallas, Texas/gi, `${SITE_ADDRESS_LOCALITY}, ${SITE_ADDRESS_REGION}`)
      .replace(/Dallas facility/gi, 'our facility');
  }
  if (Array.isArray(value)) return value.map(resolveSiteInfo);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolveSiteInfo(child)]));
  }
  return value;
}
const policy = computed(() => resolveSiteInfo(policies[props.policyKey]));
</script>

<template>
  <main v-if="policy">
    <PageHero :title="policy.title" :description="policy.description" :breadcrumbs="[{ label: policy.title }]" />
    <section class="sec">
      <div class="wrap">
        <LegalContent :blocks="policy.blocks" />
      </div>
    </section>
  </main>
</template>
<style scoped>
/* Page typography and policy copy are encapsulated by LegalContent.vue. */
</style>
