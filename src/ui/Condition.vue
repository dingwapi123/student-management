<template>
  <div class="badge badge-info mx-1 gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="inline-block h-4 w-4 transform cursor-pointer stroke-current transition-transform hover:scale-150"
      @click="onDelete"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      ></path>
    </svg>
    <slot />
  </div>
</template>

<script setup>
defineProps(['onDelete'])
</script>

<style lang="scss" scoped></style>
