<script setup lang="ts">
import type { LicenceDto } from '@/types/unit'

defineProps<{ licences: LicenceDto[] }>()

function statusBadgeClass(status: string) {
  return ['badge', status.toLowerCase() === 'active' ? 'badge-success' : 'badge-neutral']
}
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Status</th>
        <th>Holder</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(licence, index) in licences" :key="index">
        <td>{{ licence.grantDate }}</td>
        <td>{{ licence.termYears }}</td>
        <td>
          <span :class="statusBadgeClass(licence.status)">{{ licence.status }}</span>
        </td>
        <td>{{ licence.holderId }}</td>
      </tr>
    </tbody>
  </table>
</template>
