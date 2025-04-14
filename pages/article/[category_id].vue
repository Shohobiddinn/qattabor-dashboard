<template>
  <div class="space-y-6">
    <!-- Title & Back -->
    <div class="flex items-center justify-between">
      <div class="text-xl font-bold">Joylar</div>
      <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true">
        Manzil qo‘shish
      </UButton>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="loading">
      <UiSkeleton v-for="(item, index) in 6" :key="index" />
    </div>
    <!-- Maqolalar ro'yxati -->
    <div v-if="articles.data.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="hotel in articles.data" :key="hotel.id">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold truncate">{{ hotel.title }}</span>
            <UPopover :popper="{ placement: 'bottom-end' }">
              <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" />
              <template #panel>
                <div class="flex flex-col gap-1 p-2 w-40">
                  <UButton icon="i-heroicons-pencil-square" variant="ghost" @click="openEditModal(hotel)"
                    class="justify-start">
                    Tahrirlash
                  </UButton>
                  <UButton icon="i-heroicons-trash" color="red" variant="ghost" @click="deleteArticle(article.id)"
                    class="justify-start">
                    O‘chirish
                  </UButton>
                </div>
              </template>
            </UPopover>
          </div>
        </template>

        <div class="flex flex-col  gap-4">
          <div class="w-full h-52">
            <img v-if="hotel.article_banner.length" :src="config.public.apiImgUrl + hotel.article_banner[0].urls"
              alt="Hotel banner" class="w-full h-48 object-cover rounded-xl" />
            <div v-else>
              <h2>Rasm yo'q!</h2>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xl font-semibold">{{ hotel.title }}</h2>
            </div>

            <p class="text-gray-600 mb-2">{{ hotel.body }}</p>

            <div class="text-sm text-gray-500 mb-1">
              📍 {{ hotel.address }}
            </div>
            <div class="text-sm text-gray-500 mb-1">
              📞 +{{ hotel.phone_number }}
            </div>
            <div class="text-sm text-gray-500 mb-1">
              📅 {{ hotel.start_date }} - {{ hotel.end_date }}
            </div>

            <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>👁 {{ hotel?.views }} views</span>
              <span>⭐ {{ hotel?.average_feedback }}</span>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="text-xs text-gray-400">Qo‘shilgan sana: {{ hotel.created_at }}</div>
        </template>
      </UCard>
    </div>
    <div v-else class="text-center text-gray-500">Hozircha maqolalar yo‘q.</div>

    <!-- Qo‘shish modal -->
    <UModal v-model="isCreateModalOpen">
      <UCard>
        <template #header>Manzil qo‘shish</template>
        <UForm :state="form" :schema="articleSchema" @submit="submitForm" class="space-y-4">
          <UFormGroup name="photo" label="Rasm">
            <input type="file" accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
          </UFormGroup>
          <div class="flex max-sm:flex-wrap gap-2">
            <div class="w-full">


              <UFormGroup name="region_id" label="Hudud">
                <USelect v-model="form.region_id" :options="regions" option-attribute="title" value-attribute="id"
                  placeholder="Hududdni tanlang" />
              </UFormGroup>
              <UFormGroup name="title" label="Sarlavha">
                <UInput v-model="form.title" placeholder="Sarlavha" />
              </UFormGroup>
              <UFormGroup name="is_ad" label="Reklama holati">
                <UToggle v-model="form.is_ad" />
              </UFormGroup>
              <UFormGroup name="start_date" label="Boshlanish sanasi">
                <UInput v-model="form.start_date" type="date" />
              </UFormGroup>

              <UFormGroup name="end_date" label="Tugash sanasi">
                <UInput v-model="form.end_date" type="date" />
              </UFormGroup>


            </div>
            <div class="w-full">
              <UFormGroup name="address" label="Manzil">
                <UInput v-model="form.address" placeholder="Manzil" />
              </UFormGroup>


              <UFormGroup name="phone_number" label="Telefon raqam">
                <UInput v-model="form.phone_number" placeholder="Telefon raqam" type="text" />
              </UFormGroup>
              <UFormGroup name="status" label="Faollik holati">
                <UToggle v-model="form.status" />
              </UFormGroup>
              <UFormGroup name="latitude" label="Latitude">
                <UInput v-model="form.latitude" type="number" placeholder="Latitude" />
              </UFormGroup>

              <UFormGroup name="longitude" label="Longitude">
                <UInput v-model="form.longitude" type="number" placeholder="Longitude" />
              </UFormGroup>
            </div>
          </div>
          <UFormGroup name="body" label="Tavsif">
            <UTextarea v-model="form.body" placeholder="E'lon matni" />
          </UFormGroup>



          <UButton type="submit" color="primary" block>
            Yuborish
          </UButton>
        </UForm>
      </UCard>
    </UModal>

    <!-- Tahrirlash modal -->
    <UModal v-model="isEditModalOpen">
      <UCard>
        <template #header>Maqolani tahrirlash</template>
        <UForm :state="editArticle" :schema="articleSchema" @submit="saveArticle" class="space-y-4">
          <UFormGroup name="photo" label="Rasm">
            <input type="file" accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
          </UFormGroup>
          <div class="flex max-sm:flex-wrap gap-2">
            <div class="w-full">


              <UFormGroup name="region_id" label="Hudud">
                <USelect v-model="editArticle.region_id" :options="regions" option-attribute="title" value-attribute="id"
                  placeholder="Hududdni tanlang" />
              </UFormGroup>
              <UFormGroup name="title" label="Sarlavha">
                <UInput v-model="editArticle.title" placeholder="Sarlavha" />
              </UFormGroup>
              <UFormGroup name="is_ad" label="Reklama holati">
                <UToggle v-model="editArticle.is_ad" />
              </UFormGroup>
              <UFormGroup name="start_date" label="Boshlanish sanasi">
                <UInput v-model="editArticle.start_date" type="date" />
              </UFormGroup>

              <UFormGroup name="end_date" label="Tugash sanasi">
                <UInput v-model="editArticle.end_date" type="date" />
              </UFormGroup>


            </div>
            <div class="w-full">
              <UFormGroup name="address" label="Manzil">
                <UInput v-model="editArticle.address" placeholder="Manzil" />
              </UFormGroup>


              <UFormGroup name="phone_number" label="Telefon raqam">
                <UInput v-model="editArticle.phone_number" placeholder="Telefon raqam" type="text" />
              </UFormGroup>
              <UFormGroup name="status" label="Faollik holati">
                <UToggle v-model="editArticle.status" />
              </UFormGroup>
              <UFormGroup name="latitude" label="Latitude">
                <UInput v-model="editArticle.latitude" type="number" placeholder="Latitude" />
              </UFormGroup>

              <UFormGroup name="longitude" label="Longitude">
                <UInput v-model="editArticle.longitude" type="number" placeholder="Longitude" />
              </UFormGroup>
            </div>
          </div>
          <UFormGroup name="body" label="Tavsif">
            <UTextarea v-model="editArticle.body" placeholder="E'lon matni" />
          </UFormGroup>



          <UButton type="submit" color="primary" block>
            Yuborish
          </UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { articleSchema } from '~/schemas'
import { formData } from '~/utils'
const config = useRuntimeConfig()

const { coords, error, getLocation } = useGeolocation()
onMounted(() => {
  getLocation()
  setTimeout(() => {
    form.value.latitude = coords.value.latitude
    form.value.longitude = coords.value.longitude

  }, 2000)

})
const route = useRoute();
const loading = ref(false)
const categoryId = route.params.category_id
const category = ref(null)
const articles = ref({
  page: 1,
  page_size: 12,
  total_count: 3,
  total_pages: 1,
  data: []
})
const { request } = useApi()

const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)

const newArticle = ref({ title: '', content: '' })
const editArticle = ref({
  id: 0,
  author_id: 0,
  categorie_id: 0,
  region_id: 0,
  is_ad: false,
  title: "",
  body: "",
  address: "",
  phone_number: 0,
  latitude: 0,
  longitude: 0,
  start_date: "",
  end_date: ""
})
async function getAll() {
  try {
    loading.value = true;
    const { data, error, refresh } = await request(`/articles?status=published&page=${articles.value.page}&page_size=${articles.value.page_size}&category_id=${categoryId}`, 'get');

    articles.value = data

  } catch (error) {

  } finally {
    loading.value = false
  }

}
getAll();


// Tahrirlash
const openEditModal = (article) => {
  editArticle.value = { ...article }
  isEditModalOpen.value = true
}

async function saveArticle() {
  const { data, error, refresh } = await request(`/articles/update`, 'put', editArticle.value)
  if (error) return;
  getAll();
  isEditModalOpen.value = false
}

// O‘chirish
const deleteArticle = (id) => {
  articles.value = articles.value.filter(a => a.id !== id)
}



const form = ref({
  author_id: 0,
  categorie_id: 0,
  region_id: 0,
  is_ad: false,
  title: '',
  body: '',
  address: '',
  phone_number: '',
  status: false,
  latitude: 0,
  longitude: 0,
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date().toISOString().split('T')[0],
})
const regions = ref([]);
async function submitForm() {
  let postForm = {
    ...form.value,
    categorie_id: categoryId,

  }
  const { data, error, refresh } = await request(`/articles/create`, 'post', postForm)
  if (error) return;
  getAll();
  isCreateModalOpen.value = false;
}
async function getRegionList() {
  const { data, error, refresh } = await request(`/region/all?page=1&page_size=100&status=actived`, 'get')
  regions.value = data.data;
}
getRegionList();
async function photoSubmit(event) {
  const file = event.target.files[0]
  if (file) {
    const { data, error, refresh } = await request(`/banners/create`, 'post', formData({ urls: file }))
  }


}

</script>