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
          v-for="scoreItem in filteredScoreListByPage"
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

  <Pageination :currentPage :pageCount></Pageination>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import ScoreListItem from './ScoreListItem.vue'

import { useUserStore } from '@/stores/user'
import { useSearchStore } from '@/stores/search'

import { getUserId } from '@/utils/userHelper'
import { getConfig } from '@/utils/configHelper'
import { getScoreList } from '@/services/apiScore'
import { getStudentByStudentId, getStudentList } from '@/services/apiStudent'

import Loading from '@/ui/Loading.vue'
import Pageination from '@/ui/Pageination.vue'

const scoreList = ref([])
const students = ref([])

const userStore = useUserStore()
const { isStudent } = storeToRefs(userStore)

const searchStore = useSearchStore()
const { scoreSearchCondition } = storeToRefs(searchStore)

const filteredScoreListBySearch = computed(() => {
  const userId = getUserId()

  let filteredList = scoreList.value.filter((scoreItem) =>
    isStudent.value
      ? scoreItem.student_id === userId
      : students.value
          .map((student) => student.student_id)
          .includes(scoreItem.student_id)
  )
  // Apply search conditions
  filteredList = filteredList.filter((scoreItem) => {
    const student = students.value.find(
      (student) => student.student_id === scoreItem.student_id
    )

    if (!student) return false

    const studentInfoJson = JSON.stringify([
      student.name.toLowerCase(),
      student.class,
      scoreItem.subject,
      scoreItem.semester,
      scoreItem.score
    ])

    for (const condition of scoreSearchCondition.value) {
      if (!studentInfoJson.includes(condition.toLowerCase())) {
        return false
      }
    }

    return true
  })

  return filteredList
})

const router = useRouter()
const route = useRoute()

const currentPage = ref(route.query.page || 1)
const pageSize = getConfig('PAGE_SIZE')
const pageCount = computed(() =>
  Math.ceil(filteredScoreListBySearch.value.length / pageSize)
)
const filteredScoreListByPage = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize

  return filteredScoreListBySearch.value.slice(start, end)
})

watch(
  () => currentPage.value,
  () => {
    router.push({ query: { page: currentPage.value } })
  }
)

watch(
  () => route.query.page,
  (page) => {
    currentPage.value = page
  }
)

const isLoading = ref(true)
onMounted(async () => {
  router.push({ query: { page: currentPage.value } })
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
