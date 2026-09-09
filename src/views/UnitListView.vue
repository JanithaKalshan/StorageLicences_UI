<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUnits } from '@/services/unitService'
import type { UnitListItemDto } from '@/types/unit'
import Card from '@/components/ui/Card.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'
import UnitFilterBar from '@/components/units/UnitFilterBar.vue'
import UnitTable from '@/components/units/UnitTable.vue'

const units = ref<UnitListItemDto[]>([])
const totalCount = ref(0)
const page = ref(1)
const pageSize = ref(50)

const hasActiveLicence = ref<'all' | 'true' | 'false'>('all')
const minRemainingPalletCapacity = ref<number | null>(null)
const minRemainingBoxCapacity = ref<number | null>(null)

const isLoading = ref(false)
const errorMessage = ref('')

async function loadUnits() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await getUnits({
      page: page.value,
      pageSize: pageSize.value,
      hasActiveLicence:
        hasActiveLicence.value === 'all' ? undefined : hasActiveLicence.value === 'true',
      minRemainingPalletCapacity: minRemainingPalletCapacity.value ?? undefined,
      minRemainingBoxCapacity: minRemainingBoxCapacity.value ?? undefined,
    })
    units.value = response.items
    totalCount.value = response.totalCount
    page.value = response.page
    pageSize.value = response.pageSize
  } catch (error) {
    units.value = []
    totalCount.value = 0
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load units.'
  } finally {
    isLoading.value = false
  }
}

function applyFilters() {
  page.value = 1
  loadUnits()
}

function onPageChange(newPage: number) {
  page.value = newPage
  loadUnits()
}

function onPageSizeChange(newPageSize: number) {
  pageSize.value = newPageSize
  page.value = 1
  loadUnits()
}

onMounted(loadUnits)
</script>

<template>
  <main class="page">
    <h1>Units</h1>

    <UnitFilterBar
      v-model:has-active-licence="hasActiveLicence"
      v-model:min-remaining-pallet-capacity="minRemainingPalletCapacity"
      v-model:min-remaining-box-capacity="minRemainingBoxCapacity"
      @apply="applyFilters"
    />

    <Card class="results-card">
      <LoadingState v-if="isLoading" message="Loading units..." />
      <ErrorState v-else-if="errorMessage" :message="errorMessage" />
      <EmptyState v-else-if="units.length === 0" message="No units match the selected filters." />
      <template v-else>
        <UnitTable :units="units" />
        <PaginationBar
          :page="page"
          :page-size="pageSize"
          :total-count="totalCount"
          item-label="units"
          @update:page="onPageChange"
          @update:page-size="onPageSizeChange"
        />
      </template>
    </Card>
  </main>
</template>

<style scoped>
.page h1 {
  font-size: 1.5rem;
}

.results-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
