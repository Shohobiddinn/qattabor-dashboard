<template>
  <UCard class="h-screen w-64 border-r hidden md:flex flex-col gap-2 py-4 fixed left-0 top-0 z-20">
    <nav class="flex flex-col gap-1">
      <NuxtLink v-for="item in items" :key="item.to" :to="item.to"
        class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors" :class="{
          'bg-primary text-white': route.path === item.to,
          'hover:bg-gray-100': route.path !== item.to
        }">
        <UIcon :name="item.icon" class="w-5 h-5" />
        <span class="text-sm font-medium">{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </UCard>

  <!-- Mobil menyu -->
  <USlideover v-model="isOpen" side="left">
    <div class="p-4">
      <nav class="flex flex-col gap-2">
        <NuxtLink v-for="item in items" :key="item.to" :to="item.to" @click="isOpen = false"
          class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors" :class="{
            'bg-primary text-white': route.path === item.to,
            'hover:bg-gray-100': route.path !== item.to
          }">
          <UIcon :name="item.icon" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>
  </USlideover>
  <UButton icon="i-lucide-align-justify" color="gray" variant="ghost" class="md:hidden fixed top-4 left-4 z-30"
    @click="isOpen = true" />

</template>

<script setup lang="ts">
const route = useRoute()
const isOpen = ref(false)

const items = [
  { to: '/', icon: 'i-heroicons-home', label: 'Kategoriyalar' },
  { to: '/users', icon: 'i-heroicons-users', label: 'Hodimlar' },
  // { to: '/contact', icon: 'i-heroicons-phone', label: 'Aloqa' }
]
</script>
