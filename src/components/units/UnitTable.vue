<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { UnitListItemDto } from '@/types/unit'
import StatusBadge from '@/components/ui/StatusBadge.vue'

defineProps<{ units: UnitListItemDto[] }>()
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th>Unit</th>
        <th>Pallets (Occupied / Total)</th>
        <th>Remaining Pallets</th>
        <th>Boxes (Occupied / Total)</th>
        <th>Remaining Boxes</th>
        <th>Active Licence</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="unit in units" :key="unit.id">
        <td>{{ unit.id }}</td>
        <td>{{ unit.occupiedPalletCount }} / {{ unit.palletCapacity }}</td>
        <td>{{ unit.remainingPalletCapacity }}</td>
        <td>{{ unit.occupiedBoxCount }} / {{ unit.boxCapacity }}</td>
        <td>{{ unit.remainingBoxCapacity }}</td>
        <td><StatusBadge :active="unit.hasActiveLicence" /></td>
        <td>
          <RouterLink class="table-link" :to="{ name: 'unit-detail', params: { id: unit.id } }">
            View
          </RouterLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>
