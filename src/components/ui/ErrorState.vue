<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <p class="state-message is-error" role="alert">{{ message }}</p>
</template>
