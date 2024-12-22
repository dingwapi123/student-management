<template>
  <Loading v-show="isLoading" />

  <div
    class="mx-auto mt-40 w-1/3 rounded-box shadow-2xl shadow-blue-300"
    v-show="!isLoading"
  >
    <div class="mx-auto w-3/4 pt-4">
      <label class="input input-bordered my-4 flex items-center gap-2">
        Email
        <input type="text" class="grow" v-model="email" />
      </label>

      <label class="input input-bordered my-4 flex items-center gap-2">
        Name
        <input type="text" class="grow" v-model="name" />
      </label>

      <select class="select select-bordered mb-4 w-full" v-model="classInfo">
        <option disabled>Choose Class</option>
        <option
          v-for="classItem in classInChargeArr"
          :value="classItem"
          :key="classItem"
        >
          Class {{ classItem.split('|')[0] }} | Year
          {{ classItem.split('|')[1] }}
        </option>
      </select>

      <select class="select select-bordered mb-4 w-full" v-model="gender">
        <option disabled>Choose Gender</option>
        <option>male</option>
        <option>female</option>
      </select>
    </div>

    <div class="text-center">
      <button class="btn btn-primary my-2" @click="onClick">
        Create Student
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { getConfig } from '@/utils/configHelper'

import { getTeacherByTeacherId } from '@/services/apiTeacher'
import { createStudent } from '@/services/apiStudent'
import { signup } from '@/services/apiAuth'

import Loading from '@/ui/Loading.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()

const email = ref('someone@qq.com')
const name = ref('Someone')
const classInfo = ref('Class X | Year X')

const classInChargeArr = ref([])

const gender = ref('male')

const teacherId = ref('')

const isLoading = ref(true)

const toast = useToast()
const onClick = async () => {
  toast.info('Creating Student...')
  const userData = await signup(email.value, '123456', {
    isStudent: true
  })
  const studentId = userData.user.id

  const students = await createStudent({
    name: name.value,
    class: classInfo.value.split('|')[0],
    grade: classInfo.value.split('|')[1],
    gender: gender.value,
    teacher_id: teacherId.value,
    avatar:
      'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    student_id: studentId
  })

  console.log(students)
  toast.clear()
  toast.success('Student Created successfully!')
  router.push({ name: 'student' })
}
onMounted(async () => {
  isLoading.value = true

  const token = getConfig('SUPABASE_TOKEN')
  const userToken = JSON.parse(localStorage.getItem(token))
  teacherId.value = userToken.user.id
  const teachers = await getTeacherByTeacherId(teacherId.value)
  classInChargeArr.value = JSON.parse(teachers[0].class_in_charge)
  classInfo.value = classInChargeArr.value[0]
  isLoading.value = false
})
</script>
