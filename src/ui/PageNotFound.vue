<template>
  <div>
    <main
      class="flex min-h-screen flex-col items-center justify-center text-center"
    >
      <h1 class="text-4xl">404 Not Found :(</h1>
      <button class="btn btn-primary btn-lg mt-4" @click="router.push('/')">
        Back To Home
      </button>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped></style>
