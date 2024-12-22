<template>
  <Loading v-show="isLoading" />

  <div
    class="mx-auto mt-40 w-1/3 rounded-box shadow-2xl shadow-blue-300"
    v-show="!isLoading"
  >
    <div class="mx-auto w-3/4 pt-4">
      <select
        class="select select-bordered mb-4 flex w-full"
        v-model="currentStudent"
      >
        <option disabled selected>Choose Student</option>
        <option
          v-for="(student, index) in students"
          :key="index"
          :value="student"
        >
          {{ student.name }}
        </option>
      </select>

      <label class="input input-bordered my-4 flex items-center gap-2">
        Student ID
        <input
          type="text"
          class="grow"
          :value="currentStudent.student_id"
          disabled
        />
      </label>

      <label class="input input-bordered my-4 flex items-center gap-2">
        Class
        <input
          type="text"
          class="grow"
          :value="`Class ${currentStudent.class} | Year ${currentStudent.grade}`"
          disabled
        />
      </label>

      <label class="input input-bordered my-4 flex items-center gap-2">
        Score
        <input type="number" class="grow" v-model="score" min="0" max="100" />
      </label>

      <select class="select select-bordered mb-4 w-full" v-model="subject">
        <option disabled selected>Choose Subject</option>
        <option>Mathematics</option>
        <option>English</option>
        <option>History</option>
        <option>Geography</option>
        <option>Science</option>
        <option>Chemistry</option>
        <option>Physics</option>
        <option>Biology</option>
      </select>

      <div class="grid grid-cols-2 gap-4">
        <select class="select select-bordered w-full" v-model="semesterYear">
          <option disabled>Choose Subject</option>
          <option v-for="year in yearList" :key="year">{{ year }}</option>
        </select>
        <select class="select select-bordered w-full" v-model="semesterSeason">
          <option disabled>Choose Subject</option>
          <option>Spring</option>
          <option>Fall</option>
        </select>
      </div>
    </div>

    <div class="text-center">
      <button class="btn btn-primary my-2" @click="onClick">
        Update Score
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { getConfig } from '@/utils/configHelper'
import { getStudentList } from '@/services/apiStudent'
import { createScore } from '@/services/apiScore'

import Loading from '@/ui/Loading.vue'
import { useToast } from 'vue-toastification'

const currentStudent = ref({
  name: 'Alex',
  student_id: '123',
  class: 'x',
  grade: 'x'
})

const students = ref([])

const score = ref(0)
const subject = ref('Mathematics')

const semesterSeason = ref('Spring')
const semesterYear = ref(new Date().getFullYear())

const yearList = Array.from(
  { length: new Date().getFullYear() - 2000 + 1 },
  (_, index) => index + 2000
)

const router = useRouter()
const toast = useToast()
const onClick = async () => {
  toast.info('Updating score...')

  const newScore = {
    student_id: currentStudent.value.student_id,
    score: score.value,
    subject: subject.value,
    semesterSeason: semesterSeason.value,
    semesterYear: semesterYear.value
  }

  const scores = await createScore(newScore)
  console.log(scores)

  toast.clear()
  toast.success('Score updated successfully!')

  router.push({ name: 'score' })
}

const isLoading = ref(true)
onMounted(async () => {
  isLoading.value = true
  const token = getConfig('SUPABASE_TOKEN')
  const userToken = JSON.parse(localStorage.getItem(token))

  const teacherId = userToken.user.id
  students.value = await getStudentList(teacherId)

  currentStudent.value = students.value[0]
  isLoading.value = false
})
</script>
