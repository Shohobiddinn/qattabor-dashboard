<template>
  <div class="space-y-6">
    <!-- Filter va qidiruv paneli -->
    <div class="flex flex-wrap gap-4">
      <div class="flex-1">
      </div>
      <UInput v-model="search" type="search" @change="getCaregory" placeholder="Qidiruv..."
        class="w-full sm:w-auto flex-1" />
      <UButton :disabled="!search" icon="hugeicons:search-02" @click="getCaregory" class="w-full sm:w-auto">

      </UButton>
      <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true" class="w-full sm:w-auto">
        Kategoriya qo‘shish
      </UButton>
    </div>
    <!-- Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="loading">
      <UiSkeleton v-for="(item, index) in 6" :key="index" />

    </div>
    <!-- Kategoriyalar ro'yxati -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="categories.data.length && !loading">
      <UCard v-for="category in categories.data" :key="category.id">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <span class="text-lg font-semibold truncate">{{ category?.title?.uz }}</span> <br>
              <span class="text-lg font-semibold truncate">{{ category?.title?.ru }}</span>
            </div>

            <!-- Popover menyu -->
            <UPopover :popper="{ placement: 'bottom-end' }">
              <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" />
              <template #panel>
                <div class="flex flex-col gap-1 p-2 w-40">
                  <UButton icon="i-heroicons-pencil-square" variant="ghost" @click="openEditModal(category)"
                    class="justify-start">
                    Tahrirlash
                  </UButton>
                  <UButton icon="i-heroicons-trash" color="red" variant="ghost" @click="deleteCategory(category.slug)"
                    class="justify-start">
                    O‘chirish
                  </UButton>
                </div>
              </template>
            </UPopover>
          </div>
        </template>
        <!-- Agar rasm bo‘lsa, ko‘rsatamiz -->
        <div class="mt-2">
          <div class="rounded-md w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img v-if="category.photo" :src="category.photo" alt="Image" class="object-cover w-full h-full" />
            <div v-else class="text-gray-400 text-sm">Rasm yo‘q</div>
          </div>
        </div>

        <!-- Kategoriya tavsifi -->
        <p class="text-sm text-gray-600">{{ category.description?.uz || 'Tavsif yo‘q' }}</p>
        <p class="text-sm text-gray-600">{{ category.description?.ru || 'Tavsif yo‘q' }}</p>



        <template #footer>
          <div class="flex flex-col gap-2">
            <div class="grid grid-cols-2  gap-1  ">
              <NuxtLink :to="`/article/${category.id}`">
                <UButton icon="i-heroicons-document-plus" block color="primary">
                  Article qo‘shish
                </UButton>
              </NuxtLink>
              <NuxtLink :to="`/category/${category.id}`">
                <UButton block color="primary">
                  Put Kategoriya
                </UButton>

              </NuxtLink>

            </div>
            <div class="text-xs text-gray-400 text-right">
              Yangilangan: {{ new Date(category.updated_at).toLocaleString('uz-UZ') }}
            </div>
          </div>
        </template>
      </UCard>

    </div>
    <UPagination v-model="categories.page" :page-count="12" :total="categories.total_count"
      v-if="categories.data.length" />
    <div v-else-if="!loading && !categories.data.length" class="flex justify-center">
      <h1>Ma'lumot topilmadi !</h1>
    </div>
    <!-- Qo‘shish modal -->
    <UModal v-model="isCreateModalOpen">
      <UCard>
        <template #header>Kategoriya qo‘shish</template>
        <UForm :state="newCategory" :schema="schema" @submit="createCategory">
          <UFormGroup name="title.uz" label="Kategoriya nomi uz">
            <UInput v-model="newCategory.title.uz" placeholder="Kategoriya nomi" />
          </UFormGroup>
          <UFormGroup name="title.ru" label="Kategoriya nomi ru">
            <UInput v-model="newCategory.title.ru" placeholder="Kategoriya nomi" />
          </UFormGroup>

          <UFormGroup name="photo" label="Kategoriya rasmi [200px : 100px]">
            <input type="file" required accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100" />
          </UFormGroup>

          <UFormGroup name="description.uz" label="Tavsif uz">
            <UTextarea v-model="newCategory.description.uz" placeholder="Tavsif" />
          </UFormGroup>
          <UFormGroup name="description.ru" label="Tavsif ru">
            <UTextarea v-model="newCategory.description.ru" placeholder="Tavsif" />
          </UFormGroup>

          <UButton type="submit" color="primary" block>
            Saqlash
          </UButton>
        </UForm>
      </UCard>

    </UModal>
    <!-- Tahrirlash modal -->
    <UModal v-model="isEditModalOpen">
      <UCard>
        <template #header>Kategoriyani tahrirlash</template>
        <UForm :state="editCategory" :schema="editSchema" @submit="saveCategory">
          <UFormGroup name="title.uz" label="Kategoriya nomi uz">
            <UInput v-model="editCategory.title.uz" placeholder="Kategoriya nomi" />
          </UFormGroup>
          <UFormGroup name="title.ru" label="Kategoriya nomi ru">
            <UInput v-model="editCategory.title.ru" placeholder="Kategoriya nomi" />
          </UFormGroup>


          <UFormGroup name="photo" label="Kategoriya rasmi [200px : 100px]">
            <input type="file" accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
          </UFormGroup>

          <UFormGroup name="description.uz" label="Tavsif uz">
            <UTextarea v-model="editCategory.description.uz" placeholder="Tavsif" />
          </UFormGroup>
          <UFormGroup name="description.ru" label="Tavsif ru">
            <UTextarea v-model="editCategory.description.ru" placeholder="Tavsif" />
          </UFormGroup>
          <UButton type="submit" color="primary" block>
            Saqlash
          </UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
const config = useRuntimeConfig()
import { ref, watch } from 'vue'
import { formData } from "~/utils"
const { request } = useApi()
import { z } from 'zod'

const loading = ref(false);
const search = ref('')
const categories = ref({
  page: 1,
  page_size: 12,
  total_count: 3,
  total_pages: 1,
  data: []
})
async function getCaregory() {
  loading.value = true
  let searchGet = search.value ? `&title=${search.value}` : '';
  const { data, error, refresh } = await request(`/category/all?status=active&page=${categories.value.page}&page_size=${categories.value.page_size}${searchGet}`, 'get')
  categories.value = data;
  loading.value = false;
}
getCaregory();
watch(() => categories.value.page, () => {
  getCaregory();
});
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)

watch(() => isCreateModalOpen.value, () => {
  newCategory.value = {
    parent_id: 0,
    title: {
      uz: '',
      ru: '',
    },
    description: {
      uz: '',
      ru: '',
    },
    photo: null,
  }
})

const newCategory = ref({
  parent_id: 0,
  title: {
    uz: '',
    ru: '',
  },
  description: {
    uz: '',
    ru: '',
  },
  photo: null,
})
const schema = z.object({
  title: z.object({
    uz: z.string().min(1, 'Kategoriya nomi (uz) majburiy'),
    ru: z.string().min(1, 'Kategoriya nomi (ru) majburiy')
  }),
  description: z.object({
    uz: z.string().min(1, 'Tavsif (uz) majburiy'),
    ru: z.string().min(1, 'Tavsif (ru) majburiy')
  }),
  photo: z
    .any()
    .optional()
    .refine(
      (file) => !file || file instanceof File,
      'Faqat rasm fayli tanlang'
    )
})

const editSchema = z.object({
  title: z.object({
    uz: z.string().min(1, 'Kategoriya nomi (uz) majburiy'),
    ru: z.string().min(1, 'Kategoriya nomi (ru) majburiy')
  }),
  description: z.object({
    uz: z.string().min(1, 'Tavsif (uz) majburiy'),
    ru: z.string().min(1, 'Tavsif (ru) majburiy')
  }),
})
const editCategory = ref({
  slug: '',
  parent_id: 0,
  title: {
    uz: '',
    ru: '',
  },
  description: {
    uz: '',
    ru: '',
  },
  photo: null,
})
function photoSubmit(event) {
  const file = event.target.files[0]
  if (file) {
    newCategory.value.photo = file;
    editCategory.value.photo = file;
  }

}


const createCategory = async () => {
  try {
    const { data, error, refresh } = await request(`/category/create`, 'post', formData(newCategory.value))
    if (!error) {
      getCaregory();

    }
    newCategory.value = {
      parent_id: 0,
      title: {
        uz: '',
        ru: '',
      },
      description: {
        uz: '',
        ru: '',
      },
      photo: null,
    }
    isCreateModalOpen.value = false

  } catch { }

}

const openEditModal = (category) => {
  editCategory.value = { ...category };
  isEditModalOpen.value = true
}

const saveCategory = async () => {

  try {
    const { data, error, refresh } = await request(`/category/upd`, 'put', formData(editCategory.value))
    getCaregory();
    editCategory.value = {
      slug: '',
      parent_id: 0,
      title: {
        uz: '',
        ru: '',
      },
      description: {
        uz: '',
        ru: '',
      },
      photo: null,
    }
    isEditModalOpen.value = false


  } catch {
  }
}

const deleteCategory = async (slug) => {
  const { data, error, refresh } = await request(`/category/delete?slug=${slug}`, 'delete')
  getCaregory();
}

const addArticle = (category) => {
  alert(`"${category.name}" kategoriyasiga maqola qo‘shiladi.`)
}
</script>