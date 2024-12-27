<template>
  <div class="navbar bg-base-300">
    <!-- dropdown -->
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
        >
          <li>
            <a
              :class="route.name === 'score' ? 'active' : ''"
              @click="router.push({ name: 'score' })"
              >Score</a
            >
          </li>

          <li>
            <a
              :class="route.name === 'student' ? 'active' : ''"
              @click="router.push({ name: 'student' })"
              >Student</a
            >
          </li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl" @click="router.push('/')">Sunshine</a>
    </div>

    <!-- web links -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1" v-if="!isStudent">
        <li>
          <a
            :class="route.name === 'score' ? 'active' : ''"
            @click="router.push({ name: 'score' })"
            >Score</a
          >
        </li>

        <li>
          <a
            :class="route.name === 'student' ? 'active' : ''"
            @click="router.push({ name: 'student' })"
            >Student</a
          >
        </li>
      </ul>
    </div>

    <!-- avatar -->
    <div class="navbar-end">
      <ToggleTheme />
      <div class="dropdown dropdown-end">
        <div
          tabIndex="{0}"
          role="button"
          class="avatar btn btn-circle btn-ghost"
        >
          <div class="w-10 rounded-full">
            <img alt="Tailwind CSS Navbar component" :src="user.avatar" />
          </div>
        </div>
        <ul
          tabIndex="{0}"
          class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
        >
          <li>
            <a class="justify-between" @click="router.push({ name: 'info' })">
              Profile
            </a>
          </li>
          <li><a @click="onClick">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

import { getConfig } from '@/utils/configHelper'
import { signout } from '@/services/apiAuth'

import ToggleTheme from './ToggleTheme.vue'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const { updateUser } = userStore
const { user, isStudent } = storeToRefs(userStore)

async function onClick() {
  await signout()

  router.push({ name: 'login' })
}

onMounted(() => {
  const token = getConfig('SUPABASE_TOKEN')
  const userToken = JSON.parse(localStorage.getItem(token))
  const userMetadata = userToken?.user?.user_metadata

  updateUser(userMetadata)
})
</script>
