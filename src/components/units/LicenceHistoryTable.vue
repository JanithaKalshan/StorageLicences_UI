<script setup lang="ts">
import type { LicenceDto } from '@/types/unit'

defineProps<{ licences: LicenceDto[] }>()

function statusLabel(licence: LicenceDto) {
  return licence.surrenderedDate ? 'Surrendered' : 'Active'
}

function statusBadgeClass(licence: LicenceDto) {
  return ['badge', licence.surrenderedDate ? 'badge-neutral' : 'badge-success']
}
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th>Grant Date</th>
        <th>Coverage End Date</th>
        <th>Status</th>
        <th>Holder</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(licence, index) in licences" :key="index">
        <td>{{ licence.grantDate }}</td>
        <td>{{ licence.coverageEndDateExclusive }}</td>
        <td>
          <span :class="statusBadgeClass(licence)">{{ statusLabel(licence) }}</span>
        </td>
        <td>{{ licence.holderId }}</td>
      </tr>
    </tbody>
  </table>
</template>
