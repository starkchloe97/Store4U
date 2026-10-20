<script setup>
import InlineRuns from '@/components/shared/InlineRuns.vue';

defineProps({
  blocks: { type: Array, required: true }
});
</script>

<template>
  <div class="legal-content prose">
    <template v-for="(block, index) in blocks" :key="`${block.type}-${index}`">
      <p v-if="block.type === 'p'" :class="block.class">
        <InlineRuns :runs="block.runs" />
      </p>
      <h2 v-else-if="block.type === 'h2'">{{ block.text }}</h2>
      <h3 v-else-if="block.type === 'h3'">{{ block.text }}</h3>
      <ul v-else-if="block.type === 'ul'">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex"><InlineRuns :runs="item" /></li>
      </ul>
      <ol v-else-if="block.type === 'ol'">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex"><InlineRuns :runs="item" /></li>
      </ol>
      <aside v-else-if="block.type === 'callout'" class="callout">
        <strong v-if="block.title" class="callout__title">{{ block.title }}</strong>
        <InlineRuns :runs="block.runs" />
      </aside>
      <div v-else-if="block.type === 'table'" class="table-wrap">
        <table :class="block.class || undefined">
          <tbody>
            <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
              <template v-for="(cell, cellIndex) in row" :key="cellIndex">
                <th v-if="cellIndex === 0" scope="row"><InlineRuns :runs="cell" /></th>
                <td v-else><InlineRuns :runs="cell" /></td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.legal-content{max-width:82ch}
.legal-content h2{margin:2.5rem 0 .8rem;font-size:clamp(1.4rem,2.4vw,1.8rem)}
.legal-content h2:first-child{margin-top:0}
.legal-content h3{margin:1.75rem 0 .65rem;font-family:var(--sans);font-size:1.06rem;font-weight:700}
.legal-content p,.legal-content li{font-size:.95rem;color:var(--ink-2)}
.legal-content strong{color:var(--ink);font-weight:600}
.legal-content :deep(a){color:var(--clay);text-decoration:underline;text-underline-offset:2px}
.legal-content :deep(a:hover){color:var(--clay-dk)}
.legal-content .dateline{color:var(--stone);font-size:.82rem;border-bottom:1px solid var(--line);padding-bottom:1rem;margin-bottom:1.75rem}
.callout{background:var(--sand);border-left:3px solid var(--clay);border-radius:0 var(--r-sm) var(--r-sm) 0;padding:1.15rem 1.4rem;margin:1.5rem 0 2rem;color:var(--ink-2);font-size:.94rem}
.callout__title{display:block;margin-bottom:.4rem}
.table-wrap{max-width:100%;overflow-x:auto;margin:1.5rem 0}
table{width:100%;border-collapse:collapse;font-size:.9rem}
th,td{border-bottom:1px solid var(--line);padding:.85rem 1rem;text-align:left;vertical-align:top}
th{font-weight:600;background:var(--sand);width:28%}
@media(max-width:600px){th,td{padding:.7rem;font-size:.83rem}}
</style>
