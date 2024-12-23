<template>
  <section class="my-4 grid grid-cols-4 gap-2">
    <section class="col-span-1">
      <div v-if="isStudentList">
        <Condition
          v-for="(condition, idx) in studentSearchCondition"
          :key="idx"
          :onDelete="() => onDelete(idx)"
          >{{ condition }}</Condition
        >
      </div>
      <div v-if="!isStudentList">
        <Condition
          v-for="(condition, idx) in scoreSearchCondition"
          :key="idx"
          :onDelete="() => onDelete(idx)"
          >{{ condition }}</Condition
        >
      </div>
    </section>

    <!-- search bar -->
    <div class="col-span-2">
      <label class="input input-bordered mx-auto flex w-1/2 items-center gap-2">
        <input
          type="text"
          class="grow"
          placeholder="Search"
          v-model="searchString"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 cursor-pointer opacity-70"
          @click="onSearch"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
    </div>

    <div class="col-span-1 text-center">
      <button class="btn btn-primary" @click="onClick" v-if="!isStudent">
        {{ route.name === 'score' ? 'Upload Score' : 'Add Student' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'
import { useSearchStore } from '@/stores/search'

import Condition from './Condition.vue'

import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()

const toast = useToast()

const userStore = useUserStore()
const { isStudent } = storeToRefs(userStore)
const { scoreSearchCondition, studentSearchCondition } =
  storeToRefs(useSearchStore())

const isStudentList = computed(() => route.name === 'student')

function onClick() {
  if (route.name === 'score') {
    router.push({ name: 'score-upload' })
    return
  }

  router.push({ name: 'student-create' })
}

const searchString = ref('')
const onSearch = () => {
  if (!searchString.value.length) {
    toast.warning('Please enter a search query')
    return
  }

  if (isStudentList.value) {
    studentSearchCondition.value = [
      ...studentSearchCondition.value,
      searchString.value.toLowerCase()
    ]
  } else {
    scoreSearchCondition.value = [
      ...scoreSearchCondition.value,
      searchString.value.toLowerCase()
    ]
  }

  searchString.value = ''
}

const onDelete = (idx) => {
  if (isStudentList.value) {
    studentSearchCondition.value.splice(idx, 1)
  } else {
    scoreSearchCondition.value.splice(idx, 1)
  }
}
</script>
