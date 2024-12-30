<template>
  <Loading v-show="isLoading" />

  <!-- Content -->
  <div class="overflow-x-auto" v-show="!isLoading">
    <table class="table table-lg">
      <!-- head -->
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th>
          <th>Name</th>
          <th>Class</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <StudentListItem
          v-for="student in filteredStudentList"
          :key="student.id"
          :student
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

import { useSearchStore } from '@/stores/search'
import {
  getStudentListWithLimit,
  countStudent as countStudentApi
} from '@/services/apiStudent'
import { getConfig } from '@/utils/configHelper'
import { getUserId } from '@/utils/userHelper'

import StudentListItem from './StudentListItem.vue'
import Loading from '@/ui/Loading.vue'
import Pageination from '@/ui/Pageination.vue'

const { studentSearchCondition } = storeToRefs(useSearchStore())
const studentList = ref([])

const filteredStudentList = computed(() => {
  return studentList.value.filter((student) => {
    const studentInfoJSON = JSON.stringify([
      student.name.toLowerCase(),
      student.gender,
      student.class,
      student.grade
    ])

    for (const condition of studentSearchCondition.value) {
      if (!studentInfoJSON.includes(condition)) {
        return false
      }
    }

    return true
  })
})

const isLoading = ref(true)

async function fetchData() {
  isLoading.value = true

  const token = getConfig('SUPABASE_TOKEN')
  const userToken = JSON.parse(localStorage.getItem(token))

  const teacherId = userToken.user.id

  studentList.value = await getStudentListWithLimit(
    teacherId,
    currentPage.value,
    pageSize
  )

  isLoading.value = false
}

const router = useRouter()
const route = useRoute()

const currentPage = ref(route.query.page || 1)
const pageSize = getConfig('PAGE_SIZE')
const countStudent = ref(0)

const pageCount = computed(() => {
  return Math.ceil(countStudent.value / pageSize)
})

watch(
  () => currentPage.value,
  () => {
    fetchData()
    router.push({ query: { page: currentPage.value } })
  }
)

watch(
  () => route.query.page,
  (page) => {
    currentPage.value = page
  }
)

onMounted(async () => {
  const userId = getUserId()

  router.push({ query: { page: currentPage.value } })
  fetchData()

  const countStudentData = await countStudentApi(userId)
  countStudent.value = countStudentData
})
</script>
