<script setup lang="ts">
import { ref, computed } from 'vue'

const login = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(true)

const passwordType = computed(() => showPassword.value ? 'text' : 'password')
const eyeIcon = computed(() => showPassword.value ? 'i-lucide-eye-off' : 'i-lucide-eye')

function handleSignIn() {
  loading.value = true
  setTimeout(() => {
    console.log('Login:', login.value)
    console.log('Password:', password.value)
    loading.value = false
  }, 1000)
}
</script>


<template>
  <ClientOnly>
    <div class="min-h-screen flex items-center justify-center">
      <UCard class="w-full max-w-md p-6 space-y-6 shadow-xl">
        <template #header>
          <div class="text-center">
            <h2 class="text-2xl font-bold">Qatta Bor</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Qatta borga hush kelibsiz !</p>
          </div>
        </template>

        <UFormGroup label="Login" name="login">
          <UInput v-model="login" type="text" placeholder="Login" icon="i-lucide-mail" required />
        </UFormGroup>

        <UFormGroup label="Parol" name="password">
          <div class="relative">
            <UInput v-model="password" :type="passwordType" placeholder="••••••••" icon="i-lucide-lock" required />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer">
              <UIcon :name="eyeIcon" class="w-5 h-5" />
            </button>
          </div>
        </UFormGroup>







        <UButton class="mt-2" label="Kirish" block :loading="loading" @click="handleSignIn" />

        <template #footer v-if="false">
          <p class="text-sm text-center text-gray-500 dark:text-gray-400">
            Don't have an account?
            <NuxtLink to="/sign-up" class="text-primary font-medium hover:underline">Sign Up</NuxtLink>
          </p>
        </template>
      </UCard>
    </div>

  </ClientOnly>
</template>
