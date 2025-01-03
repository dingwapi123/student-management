<template>
  <Form
    class="mx-auto mt-40 w-1/3 rounded-box shadow-2xl shadow-blue-300"
    @submit="onSubmit"
    :validation-schema="validationSchema"
  >
    <h1 class="text-center text-4xl">Sunshine</h1>

    <div class="mx-auto w-3/4">
      <label class="input input-bordered my-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
          />
          <path
            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
          />
        </svg>
        <Field
          name="email"
          type="text"
          class="grow"
          placeholder="Email"
          v-model="email"
        />
        <ErrorMessage name="email" class="text-sm text-red-500" />
      </label>

      <label class="input input-bordered my-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clip-rule="evenodd"
          />
        </svg>
        <Field
          name="password"
          type="password"
          class="grow"
          placeholder="Password"
          v-model="password"
        />
        <ErrorMessage name="password" class="text-sm text-red-500" />
      </label>

      <label class="input input-bordered my-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clip-rule="evenodd"
          />
        </svg>
        <Field
          name="confirmPassword"
          type="password"
          class="grow"
          placeholder="Confirm Password"
          v-model="confirmPassword"
        />
        <ErrorMessage name="confirmPassword" class="text-sm text-red-500" />
      </label>
    </div>

    <div class="text-center">
      <!-- TODO: add form validation -->
      <button class="btn btn-secondary mx-2 my-2" :disabled="isLoading">
        Signup
      </button>
      <button
        class="btn btn-primary mx-2 my-2"
        @click="router.push({ name: 'login' })"
        :disabled="isLoading"
      >
        Login
      </button>
    </div>
  </Form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { signup as signupApi } from '@/services/apiAuth'
import { createTeacher as createTeacherApi } from '@/services/apiTeacher'

import { useMutation } from '@tanstack/vue-query'

import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match')
})

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const router = useRouter()

const toast = useToast()

const { mutate: createTeacher, isPending: isCreating } = useMutation({
  mutationFn: createTeacherApi,
  onSuccess: () => {
    toast.success('Signup successfully')
    router.push({ name: 'login' })
  },
  onError: (error) => {
    toast.error(error.message)
  }
})

const { mutate: signup, isPending: isSigning } = useMutation({
  mutationFn: ({ email, password }) => signupApi(email, password),
  onSuccess: (userData) => {
    createTeacher({ teacher_id: userData.user.id })
  },
  onError: (error) => {
    toast.error(error.message)
  }
})

const isLoading = computed(() => isSigning.value || isCreating.value)
function onSubmit() {
  signup({ email: email.value, password: password.value })
}
</script>
