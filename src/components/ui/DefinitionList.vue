<script setup lang="ts">
//defineProps<{ items: Array<{ label: string; value: string }> }>()
const props = defineProps<{ items: Array<{ label: string; value: string }> }>()
console.log('DefinitionList items:', props.items)
</script>

<template>
  <dl class="definition-list">
    <div v-for="item in items" :key="item.label" class="definition-row">
      <dt>{{ item.label }}</dt>
      <dd>{{ item.value }}</dd>
    </div>
  </dl>
</template>
