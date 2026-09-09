<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <span class="brand">Storage Licences</span>
    <nav class="tab-nav">
      <RouterLink to="/" class="tab-link">Units</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
