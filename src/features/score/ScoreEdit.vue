<template>
  <!-- Loading -->
  <Loading v-show="isLoading" />

  <!-- Content -->
  <Form
    @submit="onSubmit"
    :validation-schema="validationSchema"
    class="mx-auto mt-40 w-1/3 rounded-box shadow-2xl shadow-blue-300"
    v-show="!isLoading"
  >
    <h1 class="pt-4 text-center text-4xl">{{ currentStudent.name }}</h1>

    <div class="mx-auto w-3/4">
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
        <Field
          name="score"
          type="number"
          class="grow"
          v-model="score"
          min="0"
          max="100"
        />
        <ErrorMessage name="score" class="text-sm text-red-500" />
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
  </Form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getScoreByScoreId } from '@/services/apiScore'
import { getStudentByStudentId } from '@/services/apiStudent'
import { updateScore } from '@/services/apiScore'

import Loading from '@/ui/Loading.vue'

import { useToast } from 'vue-toastification'

import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const validationSchema = yup.object({
  score: yup.string().required('Grade is required')
})

const isLoading = ref(true)

const route = useRoute()
const router = useRouter()

const currentStudent = ref({
  name: 'someone',
  class: 'x',
  grade: 'x'
})

const score = ref(0)
const subject = ref('Mathematics')

const semesterSeason = ref('Spring')
const semesterYear = ref(new Date().getFullYear())

const yearList = Array.from(
  { length: new Date().getFullYear() - 2000 + 1 },
  (_, index) => index + 2000
)

const toast = useToast()
const onSubmit = async () => {
  toast.info('Updating Score...')

  const newScore = {
    score: score.value,
    subject: subject.value,
    semesterSeason: semesterSeason.value,
    semesterYear: semesterYear.value
  }

  const updatedScore = await updateScore(route.params.id, newScore)
  console.log(updatedScore)

  toast.clear()
  toast.success('Score Updated successfully!')
  router.push({ name: 'score' })
}

onMounted(async () => {
  isLoading.value = true
  const scores = await getScoreByScoreId(route.params.id)
  const scoreData = scores[0]

  score.value = scoreData.score
  subject.value = scoreData.subject
  semesterSeason.value = scoreData.semesterSeason
  semesterYear.value = scoreData.semesterYear

  const student = await getStudentByStudentId(scoreData.student_id)

  currentStudent.value = student
  isLoading.value = false
})
</script>
