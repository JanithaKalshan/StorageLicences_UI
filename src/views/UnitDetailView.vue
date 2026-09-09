<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getUnit, ApiRequestError } from '@/services/unitService'
import type { UnitDetailDto } from '@/types/unit'
import Card from '@/components/ui/Card.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import DefinitionList from '@/components/ui/DefinitionList.vue'
import LicenceHistoryTable from '@/components/units/LicenceHistoryTable.vue'
import PlacementsTable from '@/components/units/PlacementsTable.vue'

const route = useRoute()
const unitId = computed(() => Number(route.params.id))

const unit = ref<UnitDetailDto | null>(null)
const isLoading = ref(false)
const isNotFound = ref(false)
const errorMessage = ref('')

async function loadUnit() {
  isLoading.value = true
  isNotFound.value = false
  errorMessage.value = ''
  unit.value = null
  try {
    unit.value = await getUnit(unitId.value)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      isNotFound.value = true
    } else {
      errorMessage.value = error instanceof Error ? error.message : 'Failed to load unit.'
    }
  } finally {
    isLoading.value = false
  }
}

const unitInfoItems = computed(() => {
  if (!unit.value) return []
  return [
    { label: 'Pallet Capacity', value: String(unit.value.palletCapacity) },
    { label: 'Box Capacity', value: String(unit.value.boxCapacity) },
    { label: 'Occupied Pallets', value: String(unit.value.occupiedPalletCount) },
    { label: 'Occupied Boxes', value: String(unit.value.occupiedBoxCount) },
    { label: 'Remaining Pallets', value: String(unit.value.remainingPalletCapacity) },
    { label: 'Remaining Boxes', value: String(unit.value.remainingBoxCapacity) },
  ]
})

const licencesItems = computed(() => {
  const licences = unit.value?.licences
  if (!licences || licences.length === 0) return []

  // Grab the first or currently active licence from the array
  const licence = licences[0]
  debugger
  if (!licence) return []
  return [
    { label: 'Grant Date', value: licence.grantDate },
    { label: 'Term (Years)', value: licence.termYears },
    { label: 'Coverage End Date', value: licence.coverageEndDateExclusive },
    { label: 'Surrendered Date', value: licence.surrenderedDate },
    { label: 'Holder', value: licence.holderId },
  ]
})

onMounted(loadUnit)
</script>

<template>
  <main class="page">
    <p><RouterLink class="table-link" to="/">&larr; Back to Units</RouterLink></p>

    <LoadingState v-if="isLoading" message="Loading unit details..." />
    <EmptyState v-else-if="isNotFound" message="The requested unit does not exist." />
    <ErrorState v-else-if="errorMessage" :message="errorMessage" />

    <template v-else-if="unit">
      <h1>Unit #{{ unit.id }}</h1>

      <div class="detail-grid">
        <Card>
          <h2 class="card-title">Unit Information</h2>
          <DefinitionList :items="unitInfoItems" />
        </Card>

        <Card>
          <h2 class="card-title">Current Licence</h2>
          <DefinitionList v-if="licencesItems.length" :items="licencesItems" />
          <EmptyState v-else message="No active licence." />
        </Card>

        <Card>
          <h2 class="card-title">Actions</h2>
          <div class="action-buttons">
            <button type="button" class="btn btn-secondary">Schedule Placement</button>
          </div>
        </Card>
      </div>

      <Card>
        <h2 class="card-title">Placements</h2>
        <PlacementsTable v-if="unit.placements.length" :placements="unit.placements" />
        <EmptyState v-else message="No placements found." />
      </Card>
    </template>
  </main>
</template>
