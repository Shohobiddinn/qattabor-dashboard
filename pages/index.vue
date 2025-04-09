<template>
    <div class="space-y-6">
      <!-- Filter va qidiruv paneli -->
      <div class="flex flex-wrap gap-4">
        <UInput v-model="dateFrom" type="date" placeholder="Dan sana" class="w-full sm:w-auto flex-1" />
        <UInput v-model="dateTo" type="date" placeholder="Gacha sana" class="w-full sm:w-auto flex-1" />
        <UInput v-model="search" placeholder="Qidiruv..." class="w-full sm:w-auto flex-1" />
        <UButton
          icon="i-heroicons-plus"
          @click="isCreateModalOpen = true"
          class="w-full sm:w-auto"
        >
          Kategoriya qo‘shish
        </UButton>
      </div>
      <!-- Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UiSkeleton v-for="(item, index) in 8" :key="index" />

      </div>
      <!-- Kategoriyalar ro'yxati -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="category in filteredCategories" :key="category.id">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold truncate">{{ category.name }}</span>
  
              <!-- Popover menyu -->
              <UPopover :popper="{ placement: 'bottom-end' }">
                <UButton
                  icon="i-heroicons-ellipsis-horizontal"
                  color="gray"
                  variant="ghost"
                />
                <template #panel>
                  <div class="flex flex-col gap-1 p-2 w-40">
                    <UButton
                      icon="i-heroicons-pencil-square"
                      variant="ghost"
                      @click="openEditModal(category)"
                      class="justify-start"
                    >
                      Tahrirlash
                    </UButton>
                    <UButton
                      icon="i-heroicons-trash"
                      color="red"
                      variant="ghost"
                      @click="deleteCategory(category.id)"
                      class="justify-start"
                    >
                      O‘chirish
                    </UButton>
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
  
          <p class="text-sm text-gray-600">{{ category.description }}</p>
  
          <template #footer>
            <NuxtLink :to="`/article/${category.id}`">
                <UButton
                  icon="i-heroicons-document-plus"
                  block
                  color="primary"
                >
                  Article qo‘shish
                </UButton>

            </NuxtLink>
          </template>
        </UCard>
      </div>
  
      <!-- Qo‘shish modal -->
      <UModal v-model="isCreateModalOpen">
        <UCard>
          <template #header>Kategoriya qo‘shish</template>
          <div class="space-y-4">
            <UInput v-model="newCategory.name" placeholder="Kategoriya nomi" />
            <UTextarea v-model="newCategory.description" placeholder="Tavsif" />
          </div>
          <template #footer>
            <UButton color="primary" block @click="createCategory">Saqlash</UButton>
          </template>
        </UCard>
      </UModal>
  
      <!-- Tahrirlash modal -->
      <UModal v-model="isEditModalOpen">
        <UCard>
          <template #header>Kategoriyani tahrirlash</template>
          <div class="space-y-4">
            <UInput v-model="editCategory.name" placeholder="Kategoriya nomi" />
            <UTextarea v-model="editCategory.description" placeholder="Tavsif" />
          </div>
          <template #footer>
            <UButton color="primary" block @click="saveCategory">Saqlash</UButton>
          </template>
        </UCard>
      </UModal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const dateFrom = ref('')
  const dateTo = ref('')
  const search = ref('')
  const isCreateModalOpen = ref(false)
  const isEditModalOpen = ref(false)
  
  const newCategory = ref({ name: '', description: '' })
  const editCategory = ref({ id: null, name: '', description: '' })
  
  const categories = ref([
    { id: 1, name: 'Texnologiya', description: 'IT yangiliklari', createdAt: '2024-01-10' },
    { id: 2, name: 'Sport', description: 'Sport yangiliklari', createdAt: '2024-02-15' },
    { id: 3, name: 'Madaniyat', description: 'San’at va madaniyat', createdAt: '2024-03-01' }
  ])
  
  const filteredCategories = computed(() => {
    return categories.value.filter(c => {
      const matchDate =
        (!dateFrom.value || new Date(c.createdAt) >= new Date(dateFrom.value)) &&
        (!dateTo.value || new Date(c.createdAt) <= new Date(dateTo.value))
      const matchSearch =
        !search.value || c.name.toLowerCase().includes(search.value.toLowerCase())
      return matchDate && matchSearch
    })
  })
  
  const createCategory = () => {
    const id = Date.now()
    categories.value.push({
      id,
      name: newCategory.value.name,
      description: newCategory.value.description,
      createdAt: new Date().toISOString().slice(0, 10)
    })
    newCategory.value = { name: '', description: '' }
    isCreateModalOpen.value = false
  }
  
  const openEditModal = (category) => {
    editCategory.value = { ...category }
    isEditModalOpen.value = true
  }
  
  const saveCategory = () => {
    const index = categories.value.findIndex(c => c.id === editCategory.value.id)
    if (index !== -1) {
      categories.value[index] = { ...editCategory.value }
    }
    isEditModalOpen.value = false
  }
  
  const deleteCategory = (id) => {
    categories.value = categories.value.filter(c => c.id !== id)
  }
  
  const addArticle = (category) => {
    alert(`"${category.name}" kategoriyasiga maqola qo‘shiladi.`)
  }
  </script>
  