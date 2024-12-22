<template>
  <NavBar />

  <Toolbar v-show="routeName === 'score' || routeName === 'student'" />

  <RouterView />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';

import NavBar from '@/ui/NavBar.vue';
import Toolbar from '@/ui/Toolbar.vue';

const route = useRoute();
const routeName = computed(() => route.name);
</script>
