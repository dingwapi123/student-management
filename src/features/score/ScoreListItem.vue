<template>
  <tr>
    <td>{{ currentStudent.name }}</td>
    <!-- TODO: render class and grade by student_id -->
    <td>
      {{ `Class ${currentStudent.class} | Year ${currentStudent.grade}` }}
    </td>
    <td>{{ scoreItem.subject }}</td>
    <td>{{ scoreItem.semesterSeason }} {{ scoreItem.semesterYear }}</td>
    <td>{{ scoreItem.score }}</td>
    <th v-if="!isStudent">
      <button
        class="btn btn-ghost btn-sm"
        @click="
          router.push({ name: 'score-edit', params: { id: scoreItem.id } })
        "
      >
        details
      </button>
      <button class="btn btn-error btn-sm">delete</button>
    </th>
  </tr>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'

const router = useRouter()

const userStore = useUserStore()
const { isStudent } = storeToRefs(userStore)

defineProps(['scoreItem', 'currentStudent'])
</script>
