<script setup lang="ts">
import type { PlacementDto } from '@/types/unit'

defineProps<{ placements: PlacementDto[] }>()
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th>Id</th>
        <th>Item</th>
        <th>Class</th>
        <th>Scheduled Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="placement in placements" :key="placement.id">
        <td>{{ placement.id }}</td>
        <td>{{ placement.itemId }}</td>
        <td>{{ placement.placementClass }}</td>
        <td>{{ placement.scheduledDate }}</td>
        <td>{{ placement.status }}</td>
      </tr>
    </tbody>
  </table>
</template>
