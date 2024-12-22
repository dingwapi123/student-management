<template>
  <section class="my-4 grid grid-cols-4 gap-2">
    <section class="col-span-1">
      <div class="badge badge-info mx-1 gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-4 w-4 transform cursor-pointer stroke-current transition-transform hover:scale-150"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
        info
      </div>
    </section>

    <div class="col-span-2">
      <label class="input input-bordered mx-auto flex w-1/2 items-center gap-2">
        <input type="text" class="grow" placeholder="Search" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
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
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const { isStudent } = storeToRefs(userStore)

function onClick() {
  if (route.name === 'score') {
    router.push({ name: 'score-upload' })
    return
  }

  router.push({ name: 'student-create' })
}
</script>
