<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), { message: 'Loading...' })
</script>

<template>
  <p class="state-message">{{ message }}</p>
</template>
