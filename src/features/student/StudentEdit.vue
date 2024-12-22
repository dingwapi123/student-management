<template>
  <!-- Loading -->
  <Loading v-show="isLoading" />

  <!-- Content -->
  <div
    class="mx-auto mt-40 w-1/3 rounded-box shadow-2xl shadow-blue-300"
    v-show="!isLoading"
  >
    <div class="avatar flex justify-center pt-4">
      <div class="w-24 rounded-full">
        <label for="avatar-input" class="cursor-pointer">
          <img :src="currentAvatarUrl" />
        </label>
      </div>
    </div>

    <input
      class="hidden"
      id="avatar-input"
      type="file"
      accept="image/*"
      @change="handleAvatarChange"
    />

    <div class="mx-auto w-3/4">
      <label class="input input-bordered my-4 flex items-center gap-2">
        Name
        <input
          type="text"
          class="grow"
          value="Class 1 | Year 8"
          v-model="name"
        />
      </label>

      <select class="select select-bordered mb-4 w-full" v-model="gender">
        <option disabled selected>Choose Gender</option>
        <option>male</option>
        <option>female</option>
      </select>
    </div>

    <div class="text-center">
      <button class="btn btn-primary my-2" @click="onClick">
        Update Profile
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStudentByStudentId } from '@/services/apiStudent'
import { updateStudent } from '@/services/apiStudent'

import { uploadAvatar } from '@/services/apiStorage'
import { getConfig } from '@/utils/configHelper'

import Loading from '@/ui/Loading.vue'
import { useToast } from 'vue-toastification'

const isLoading = ref(true)

const route = useRoute()
const router = useRouter()

const name = ref('someone')
const gender = ref('male')

const currentAvatarUrl = ref(
  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
)
const avatarFile = ref(null)

function handleAvatarChange(event) {
  const file = event.target.files[0]
  avatarFile.value = file

  const newAvatarUrl = URL.createObjectURL(file)
  currentAvatarUrl.value = newAvatarUrl
}

const toast = useToast()
async function onClick() {
  toast.info('Updating student profile...')

  const newStudent = {
    name: name.value,
    gender: gender.value
  }
  if (avatarFile.value) {
    // 获取 Supabase 配置信息
    const token = getConfig('SUPABASE_TOKEN')
    const supabaseURL = getConfig('SUPABASE_URL')

    // 从 localStorage 获取用户信息
    const userToken = JSON.parse(localStorage.getItem(token))
    // 生成新的头像文件名,使用用户邮箱和时间戳确保唯一性
    const newAvatarFileName = `${userToken.user.email}-${Date.now()}.png`

    // 上传头像文件到 Supabase Storage
    await uploadAvatar(avatarFile.value, newAvatarFileName)

    // 在supabase中更新用户信息中的头像 URL
    const avatar = `${supabaseURL}/storage/v1/object/public/avatar/public/${newAvatarFileName}`
    newStudent.avatar = avatar
  }

  const student = await updateStudent(route.params.id, newStudent)
  console.log(student)

  toast.clear()
  toast.success('Student profile updated successfully!')
  router.push({ name: 'student' })
}

onMounted(async () => {
  isLoading.value = true
  const studentId = route.params.id

  const student = await getStudentByStudentId(studentId)

  console.log(student)

  name.value = student.name
  gender.value = student.gender
  currentAvatarUrl.value = student.avatar

  isLoading.value = false
})
</script>
