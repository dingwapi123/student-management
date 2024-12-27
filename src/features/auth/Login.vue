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

      <div class="grid grid-cols-2 gap-1">
        <label>
          <input
            type="checkbox"
            checked="checked"
            class="checkbox-primary checkbox"
          />
          <span class="mx-2">Remember me</span>
        </label>
        <button class="btn btn-link">Forget password?</button>
      </div>
    </div>

    <div class="text-center">
      <button class="btn btn-primary mx-2 my-2">Login</button>
      <button
        class="btn btn-secondary mx-2 my-2"
        @click="router.push({ name: 'signup' })"
      >
        Signup
      </button>
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '@/services/apiAuth'

import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6)
})
async function onSubmit() {
  const data = await login(email.value, password.value)

  if (data) {
    router.push('/')
  }
}
</script>
