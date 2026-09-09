<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  pageSize: number
  totalCount: number
  itemLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}>()

const totalPages = computed(() =>
  props.totalCount === 0 ? 0 : Math.ceil(props.totalCount / props.pageSize),
)

const rangeStart = computed(() =>
  props.totalCount === 0 ? 0 : (props.page - 1) * props.pageSize + 1,
)

const rangeEnd = computed(() => Math.min(props.page * props.pageSize, props.totalCount))

// Shows a window of up to 5 page numbers centered on the current page.
const visiblePages = computed(() => {
  const total = totalPages.value
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }
  const end = Math.min(total, Math.max(1, props.page - 2) + 4)
  const start = Math.max(1, end - 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

function goToPage(target: number) {
  if (target >= 1 && target <= totalPages.value && target !== props.page) {
    emit('update:page', target)
  }
}

function onPageSizeChange(event: Event) {
  emit('update:pageSize', Number((event.target as HTMLSelectElement).value))
}
</script>

<template>
  <div class="pagination-bar">
    <p class="pagination-summary">
      <template v-if="totalCount === 0">Showing 0 {{ itemLabel ?? 'results' }}</template>
      <template v-else>
        Showing {{ rangeStart }} - {{ rangeEnd }} of {{ totalCount }} {{ itemLabel ?? 'results' }}
      </template>
    </p>

    <div class="pagination-controls">
      <label>
        <span class="sr-only">Page size</span>
        <select class="input" :value="pageSize" @change="onPageSizeChange">
          <option :value="10">10 / page</option>
          <option :value="25">25 / page</option>
          <option :value="50">50 / page</option>
          <option :value="100">100 / page</option>
        </select>
      </label>

      <button
        type="button"
        class="page-button"
        :disabled="page <= 1"
        aria-label="Previous page"
        @click="goToPage(page - 1)"
      >
        &lsaquo;
      </button>

      <button
        v-for="pageNumber in visiblePages"
        :key="pageNumber"
        type="button"
        class="page-button"
        :class="{ 'is-active': pageNumber === page }"
        :aria-current="pageNumber === page ? 'page' : undefined"
        @click="goToPage(pageNumber)"
      >
        {{ pageNumber }}
      </button>

      <button
        type="button"
        class="page-button"
        :disabled="page >= totalPages"
        aria-label="Next page"
        @click="goToPage(page + 1)"
      >
        &rsaquo;
      </button>
    </div>
  </div>
</template>
