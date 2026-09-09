<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="page">
    <p><RouterLink class="table-link" to="/">&larr; Back to units</RouterLink></p>
    <h1>Unit #{{ route.params.id }}</h1>
    <p>Unit detail is not implemented yet.</p>
  </main>
</template>
