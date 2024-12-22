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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
          />
        </svg>
        <input type="text" class="grow" value="cxz" disabled />
      </label>

      <ul
        class="menu rounded-box bg-base-200"
        v-if="classInChargeArr.length > 0"
      >
        <li>
          <details open>
            <summary>Class In Charge</summary>
            <ul>
              <li v-for="(classItem, idx) in classInChargeArr" :key="idx">
                <a class="pointer-events-none"
                  >Class {{ classItem.split('|')[0] }} | Year
                  {{ classItem.split('|')[1] }}</a
                >
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>

    <div class="text-center">
      <button class="btn btn-primary my-2" @click="onClick">
        Update Avatar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/user'

import { uploadAvatar } from '@/services/apiStorage'
import { getTeacherByTeacherId } from '@/services/apiTeacher'
import { updateUser as updateUserApi } from '@/services/apiAuth'
import { getConfig } from '@/utils/configHelper'

import Loading from '@/ui/Loading.vue'
import { useToast } from 'vue-toastification'
import { getUserId } from '@/utils/userHelper'
import { updateStudent } from '@/services/apiStudent'

const userStore = useUserStore()

const { updateUser } = userStore
const { user, isStudent } = storeToRefs(userStore)

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

/**
 * 处理更新用户头像的点击事件
 * 1. 检查是否已选择新头像文件
 * 2. 获取 Supabase 配置信息
 * 3. 生成新的头像文件名
 * 4. 上传头像文件到 Supabase Storage
 * 5. 更新用户信息中的头像 URL
 */

const toast = useToast()
async function onClick() {
  // 如果没有选择新的头像文件,则直接返回
  if (!avatarFile.value) {
    // TODO: Warning toast
    toast.warning('Please select a new avatar file.')
    return
  }

  toast.info('Updating avatar...')

  // 获取 Supabase 配置信息
  const token = getConfig('SUPABASE_TOKEN')
  const supabaseURL = getConfig('SUPABASE_URL')

  // 从 localStorage 获取用户信息
  const userToken = JSON.parse(localStorage.getItem(token))
  // 生成新的头像文件名,使用用户邮箱和时间戳确保唯一性
  const newAvatarFileName = `${userToken.user.email}-${Date.now()}.png`

  // 上传头像文件到 Supabase Storage
  await uploadAvatar(avatarFile.value, newAvatarFileName)

  const newAvatar = `${supabaseURL}/storage/v1/object/public/avatar/public/${newAvatarFileName}`

  // 在supabase中更新用户信息中的头像 URL
  const updateUserData = await updateUserApi({
    avatar: newAvatar
  })

  if (isStudent.value) {
    const userId = getUserId()
    const students = await updateStudent(userId, {
      avatar: newAvatar
    })
    console.log(students)
  }

  // 更新pinia中的本地用户状态
  updateUser(updateUserData.user.user_metadata)

  toast.clear()
  toast.success('Avatar updated successfully!')
}

const classInChargeArr = ref([])

const isLoading = ref(true)
onMounted(async () => {
  isLoading.value = true

  currentAvatarUrl.value = user.value.avatar

  if (!isStudent.value) {
    const userId = getUserId()
    const teachers = await getTeacherByTeacherId(userId)

    classInChargeArr.value = JSON.parse(teachers[0].class_in_charge)
  }

  isLoading.value = false
})
</script>
