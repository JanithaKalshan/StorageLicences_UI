<script setup lang="ts">
withDefaults(
  defineProps<{
    active: boolean
    trueLabel?: string
    falseLabel?: string
  }>(),
  {
    trueLabel: 'Yes',
    falseLabel: 'No',
  },
)
</script>

<template>
  <span class="badge" :class="active ? 'badge-success' : 'badge-danger'">
    {{ active ? trueLabel : falseLabel }}
  </span>
</template>
