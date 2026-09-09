<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), { message: 'No results found.' })
</script>

<template>
  <p class="state-message">{{ message }}</p>
</template>
