<script setup lang="ts">
import { ref } from 'vue'
import { createPlacement } from '@/services/placementService'
import { ApiRequestError } from '@/services/unitService'
import type { CreatePlacementResponse } from '@/types/placement'

const props = defineProps<{ unitId: number }>()

const emit = defineEmits<{
  (e: 'created', placement: CreatePlacementResponse): void
  (e: 'cancel'): void
}>()

const itemId = ref('')
const placementClass = ref<'Pallet' | 'Box' | ''>('')
const scheduledDate = ref('')
const assertedRequesterId = ref('')

const fieldErrors = ref<Record<string, string>>({})
const submitErrors = ref<string[]>([])
const isSubmitting = ref(false)

function validate(): boolean {
  const errors: Record<string, string> = {}

  if (!itemId.value || !Number.isInteger(Number(itemId.value)) || Number(itemId.value) <= 0) {
    errors.itemId = 'Enter a valid item ID.'
  }
  if (!placementClass.value) {
    errors.placementClass = 'Select a placement class.'
  }
  if (!scheduledDate.value) {
    errors.scheduledDate = 'Select a scheduled date.'
  }
  if (!assertedRequesterId.value.trim()) {
    errors.assertedRequesterId = 'Enter a requester ID.'
  }

  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}

function resetForm() {
  itemId.value = ''
  placementClass.value = ''
  scheduledDate.value = ''
  assertedRequesterId.value = ''
  fieldErrors.value = {}
}

async function onSubmit() {
  submitErrors.value = []

  if (!validate()) {
    return
  }

  isSubmitting.value = true
  try {
    const placement = await createPlacement({
      unitId: props.unitId,
      itemId: Number(itemId.value),
      placementClass: placementClass.value as 'Pallet' | 'Box',
      scheduledDate: scheduledDate.value,
      assertedRequesterId: assertedRequesterId.value.trim(),
    })
    resetForm()
    emit('created', placement)
  } catch (error) {
    if (error instanceof ApiRequestError && error.errors?.length) {
      submitErrors.value = error.errors.map((apiError) => apiError.description)
    } else {
      submitErrors.value = [
        error instanceof Error ? error.message : 'Failed to schedule placement.',
      ]
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="form-stack" @submit.prevent="onSubmit">
    <p v-if="submitErrors.length" class="field-error">Placement could not be scheduled.</p>
    <ul v-if="submitErrors.length" class="error-list" role="alert">
      <li v-for="(message, index) in submitErrors" :key="index">{{ message }}</li>
    </ul>

    <div class="form-field">
      <label for="placement-unit">Unit</label>
      <input id="placement-unit" class="input" type="text" :value="unitId" disabled />
    </div>

    <div class="form-field">
      <label for="placement-item">Item</label>
      <input
        id="placement-item"
        v-model="itemId"
        class="input"
        type="number"
        min="1"
        :disabled="isSubmitting"
      />
      <span v-if="fieldErrors.itemId" class="field-error">{{ fieldErrors.itemId }}</span>
    </div>

    <div class="form-field">
      <label for="placement-class">Placement Class</label>
      <select id="placement-class" v-model="placementClass" class="input" :disabled="isSubmitting">
        <option value="" disabled>Select a class</option>
        <option value="Pallet">Pallet</option>
        <option value="Box">Box</option>
      </select>
      <span v-if="fieldErrors.placementClass" class="field-error">{{
        fieldErrors.placementClass
      }}</span>
    </div>

    <div class="form-field">
      <label for="placement-date">Scheduled Date</label>
      <input
        id="placement-date"
        v-model="scheduledDate"
        class="input"
        type="date"
        :disabled="isSubmitting"
      />
      <span v-if="fieldErrors.scheduledDate" class="field-error">{{
        fieldErrors.scheduledDate
      }}</span>
    </div>

    <div class="form-field">
      <label for="placement-requester">Requester</label>
      <input
        id="placement-requester"
        v-model="assertedRequesterId"
        class="input"
        type="text"
        :disabled="isSubmitting"
      />
      <span v-if="fieldErrors.assertedRequesterId" class="field-error">{{
        fieldErrors.assertedRequesterId
      }}</span>
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn btn-secondary"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Scheduling...' : 'Schedule Placement' }}
      </button>
    </div>
  </form>
</template>
