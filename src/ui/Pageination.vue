<template>
  <div class="join flex items-center justify-center">
    <button
      v-for="(_, idx) in new Array(pageCount)"
      :class="`btn join-item btn-lg ${idx + 1 == currentPage ? 'btn-disabled' : ''}`"
      :key="idx"
      @click="handleChangePage(idx + 1)"
    >
      {{ idx + 1 }}
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps(['currentPage', 'pageCount'])

const router = useRouter()

function handleChangePage(page) {
  router.push({ query: { page } })
}
</script>
