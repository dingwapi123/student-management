<template>
  <!-- Loading -->
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
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { getStudentList } from '@/services/apiStudent'
import { getConfig } from '@/utils/configHelper'

import StudentListItem from './StudentListItem.vue'
import Loading from '@/ui/Loading.vue'

import { useSearchStore } from '@/stores/search'

const { studentSearchCondition } = storeToRefs(useSearchStore())
const studentList = ref([])

const filteredStudentList = computed(() => {
  return studentList.value.filter((student) => {
    const studentInfoJson = JSON.stringify([
      student.name.toLowerCase(),
      student.gender,
      student.class,
      student.grade
    ])

    for (const condition of studentSearchCondition.value) {
      if (!studentInfoJson.includes(condition)) {
        return false
      }
    }

    return true
  })
})

const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  const token = getConfig('SUPABASE_TOKEN')
  const userToken = JSON.parse(localStorage.getItem(token))

  const teacherId = userToken.user.id

  studentList.value = await getStudentList(teacherId)
  isLoading.value = false
})
</script>
