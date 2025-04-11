<template>
    <div class="space-y-6">
      <!-- Title & Back -->
      <div class="flex items-center justify-between">
        <div class="text-xl font-bold">Joylar</div>
        <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true">
          Manzil qo‘shish
        </UButton>
      </div>
  
      <!-- Maqolalar ro'yxati -->
      <div v-if="articles.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="article in articles" :key="article.id">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold truncate">{{ article.title }}</span>
              <UPopover :popper="{ placement: 'bottom-end' }">
                <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" />
                <template #panel>
                  <div class="flex flex-col gap-1 p-2 w-40">
                    <UButton
                      icon="i-heroicons-pencil-square"
                      variant="ghost"
                      @click="openEditModal(article)"
                      class="justify-start"
                    >
                      Tahrirlash
                    </UButton>
                    <UButton
                      icon="i-heroicons-trash"
                      color="red"
                      variant="ghost"
                      @click="deleteArticle(article.id)"
                      class="justify-start"
                    >
                      O‘chirish
                    </UButton>
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
  
          <p class="text-sm text-gray-600 line-clamp-3">{{ article.content }}</p>
          <template #footer>
            <div class="text-xs text-gray-400">Qo‘shilgan sana: {{ article.createdAt }}</div>
          </template>
        </UCard>
      </div>
      <div v-else class="text-center text-gray-500">Hozircha maqolalar yo‘q.</div>
  
      <!-- Qo‘shish modal -->
      <UModal v-model="isCreateModalOpen">
        <UCard>
          <template #header>Maqola qo‘shish</template>
          <div class="space-y-4">
            <UInput v-model="newArticle.title" placeholder="Sarlavha" />
            <UTextarea v-model="newArticle.content" placeholder="Maqola matni..." />
          </div>
          <template #footer>
            <UButton color="primary" @click="createArticle">Saqlash</UButton>
          </template>
        </UCard>
      </UModal>
  
      <!-- Tahrirlash modal -->
      <UModal v-model="isEditModalOpen">
        <UCard>
          <template #header>Maqolani tahrirlash</template>
          <div class="space-y-4">
            <UInput v-model="editArticle.title" placeholder="Sarlavha" />
            <UTextarea v-model="editArticle.content" placeholder="Maqola matni..." />
          </div>
          <template #footer>
            <UButton color="primary" @click="saveArticle">Saqlash</UButton>
          </template>
        </UCard>
      </UModal>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { ref, computed, onMounted } from 'vue'
  
  // Router orqali category_id olish
  const route = useRoute()
  const categoryId = route.params.category_id
  // Kategoriya va maqolalar (simulyatsiya uchun static)
  const category = ref(null)
  const articles = ref([])
  
  const isCreateModalOpen = ref(false)
  const isEditModalOpen = ref(false)
  
  const newArticle = ref({ title: '', content: '' })
  const editArticle = ref({ id: null, title: '', content: '' })
  
  // Dastlabki ma'lumotni yuklash (static)
  onMounted(() => {
    // Bu qismda siz backendan ma'lumot olishni qo‘shishingiz mumkin
    category.value = {
      id: categoryId,
      name: categoryId == 1 ? 'Texnologiya' : categoryId == 2 ? 'Sport' : 'Madaniyat',
    }
  
    articles.value = [
      { id: 1, title: 'Birinchi maqola', content: 'Bu birinchi maqolaning matni.', createdAt: '2024-04-01', categoryId },
      { id: 2, title: 'Ikkinchi maqola', content: 'Ikkinchi maqola haqida qisqacha.', createdAt: '2024-04-05', categoryId }
    ]
  })
  
  // Qo‘shish
  const createArticle = () => {
    const id = Date.now()
    articles.value.push({
      id,
      title: newArticle.value.title,
      content: newArticle.value.content,
      createdAt: new Date().toISOString().slice(0, 10),
      categoryId
    })
    newArticle.value = { title: '', content: '' }
    isCreateModalOpen.value = false
  }
  
  // Tahrirlash
  const openEditModal = (article) => {
    editArticle.value = { ...article }
    isEditModalOpen.value = true
  }
  
  const saveArticle = () => {
    const index = articles.value.findIndex(a => a.id === editArticle.value.id)
    if (index !== -1) {
      articles.value[index] = { ...editArticle.value }
    }
    isEditModalOpen.value = false
  }
  
  // O‘chirish
  const deleteArticle = (id) => {
    articles.value = articles.value.filter(a => a.id !== id)
  }
  </script>
  