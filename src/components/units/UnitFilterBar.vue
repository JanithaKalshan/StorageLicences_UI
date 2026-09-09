<script setup lang="ts">
const hasActiveLicence = defineModel<'all' | 'true' | 'false'>('hasActiveLicence', {
  required: true,
})
const minRemainingPalletCapacity = defineModel<number | null>('minRemainingPalletCapacity', {
  required: true,
})
const minRemainingBoxCapacity = defineModel<number | null>('minRemainingBoxCapacity', {
  required: true,
})

const emit = defineEmits<{ (e: 'apply'): void }>()
</script>

<template>
  <form class="card form-row" @submit.prevent="emit('apply')">
    <div class="form-field">
      <label for="active-licence-filter">Active Licence</label>
      <select id="active-licence-filter" v-model="hasActiveLicence" class="input">
        <option value="all">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>

    <div class="form-field">
      <label for="min-pallets">Min Remaining Pallets</label>
      <input
        id="min-pallets"
        v-model.number="minRemainingPalletCapacity"
        class="input"
        type="number"
        min="0"
      />
    </div>

    <div class="form-field">
      <label for="min-boxes">Min Remaining Boxes</label>
      <input
        id="min-boxes"
        v-model.number="minRemainingBoxCapacity"
        class="input"
        type="number"
        min="0"
      />
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Apply Filters</button>
    </div>
  </form>
</template>
