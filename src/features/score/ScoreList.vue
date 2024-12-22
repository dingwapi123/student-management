<template>
  <!-- Loading -->
  <Loading v-show="isLoading" />

  <!-- Content -->
  <div class="overflow-x-auto" v-show="!isLoading">
    <table class="table table-lg">
      <thead>
        <tr>
          <th>Name</th>
          <th>Class</th>
          <th>Subject</th>
          <th>Semester</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody v-if="students.length > 0">
        <ScoreListItem
          v-for="scoreItem in filteredScoreList"
          :key="scoreItem.id"
          :scoreItem="scoreItem"
          :currentStudent="
            students.find(
              (student) => student.student_id === scoreItem.student_id
            )
          "
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import ScoreListItem from './ScoreListItem.vue'

import { useUserStore } from '@/stores/user'

import { getUserId } from '@/utils/userHelper'
import { getScoreList } from '@/services/apiScore'
import { getStudentByStudentId, getStudentList } from '@/services/apiStudent'

import Loading from '@/ui/Loading.vue'

const scoreList = ref([])
const students = ref([])

const userStore = useUserStore()
const { isStudent } = storeToRefs(userStore)

const filteredScoreList = computed(() => {
  const userId = getUserId()

  if (isStudent.value) {
    return scoreList.value.filter(
      (scoreItem) => scoreItem.student_id === userId
    )
  }
  return scoreList.value.filter((scoreItem) =>
    students.value
      .map((student) => student.student_id)
      .includes(scoreItem.student_id)
  )
})

const isLoading = ref(true)
onMounted(async () => {
  isLoading.value = true
  scoreList.value = await getScoreList()

  const userId = getUserId()

  if (!isStudent.value) {
    students.value = await getStudentList(userId)
  } else {
    const student = await getStudentByStudentId(userId)
    students.value = [student]
  }

  isLoading.value = false
})
</script>
