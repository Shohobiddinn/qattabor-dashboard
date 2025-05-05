<template>
  <div class="space-y-6">
    <!-- Title & Back -->
    <div class="flex items-center justify-between">
      <div class="text-xl font-bold">Joylar</div>
      <div class="flex">
        <USelect v-model="status" @change="getAll" :options="options" option-attribute="name" value-attribute="value"
          placeholder="Holat">
        </USelect>
        <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true">
          Manzil qo‘shish
        </UButton>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="loading">
      <UiSkeleton v-for="(item, index) in 6" :key="index" />
    </div>
    <!-- Maqolalar ro'yxati -->
    <div v-if="articles.data.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="hotel in articles.data" :key="hotel.id">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <span class="text-lg font-semibold truncate">{{ hotel.title.uz }}</span> <br>
              <span class="text-lg font-semibold truncate">{{ hotel.title.ru }}</span>
            </div>
            <UPopover :popper="{ placement: 'bottom-end' }">
              <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" />
              <template #panel>
                <div class="flex flex-col gap-1 p-2 w-40">
                  <UButton icon="i-heroicons-pencil-square" variant="ghost" @click="openEditModal(hotel)"
                    class="justify-start">
                    Tahrirlash
                  </UButton>
                  <UButton icon="i-heroicons-trash" color="red" variant="ghost" @click="deleteArticle(hotel.id)"
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


            <p class="text-gray-600 mb-2">{{ hotel.body.uz }}</p>
            <p class="text-gray-600 mb-2">{{ hotel.body.ru }}</p>

            <div class="text-sm text-gray-500 mb-1">
              📍 {{ hotel.address.uz }} <br>
              📍 {{ hotel.address.ru }}

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
    <UModal v-model="isCreateModalOpen" fullscreen>
      <UCard :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow'
        }
      }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Manzil qo‘shish
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isCreateModalOpen = false" />
          </div>
        </template>
        <UForm :state="form" :schema="articleSchema" @submit="submitForm" class="space-y-4">
          <UFormGroup name="photo" label="Muqova [200px : 100px]">
            <input required type="file" accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
          </UFormGroup>
          <div class="max-h-[200px] overflow-auto">
            <div class="flex justify-between items-center" v-for="(item, index) in images" :key="index">
              <UFormGroup label="Rasm [200px : 100px]">
                <input required type="file" accept="image/*" @change="bannerSubmit($event, index)" class="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100" />
                <img v-if="item.image" :src="item.image" alt="Image Preview"
                  class="w-[100px] h-[100px] object-contain" />
              </UFormGroup>
              <div>
                <div class="w-[100px]">
                  <UButton icon="i-heroicons-minus" color="red" @click="bannerRemove(index)"
                    v-if="images.length > 1 && false">
                  </UButton>
                </div>
                <div class="w-[100px]">
                  <UButton icon="i-heroicons-plus" v-if="images.length == index + 1" @click="bannerCreate(index)">
                  </UButton>
                </div>

              </div>
            </div>
          </div>

          <div class="flex max-sm:flex-wrap gap-2">
            <div class="w-full">
              <UFormGroup name="region_id" label="Hudud">
                <USelect v-model="form.region_id" :options="regions" option-attribute="title.uz" value-attribute="id"
                  placeholder="Hududdni tanlang" />
              </UFormGroup>
              <UFormGroup name="title.uz" label="Sarlavha (uz)">
                <UInput v-model="form.title.uz" placeholder="Sarlavha" />
              </UFormGroup>
              <UFormGroup name="title.uz" label="Sarlavha (ru)">
                <UInput v-model="form.title.ru" placeholder="Sarlavha" />
              </UFormGroup>
              <div class="flex justify-between">
                <UFormGroup name="is_ad" label="Reklama holati">
                  <UToggle v-model="form.is_ad" />
                </UFormGroup>
                <UFormGroup name="is_popular" label="Mashxur">
                  <UToggle v-model="form.is_popular" />
                </UFormGroup>
              </div>
              <UFormGroup name="start_date" label="Boshlanish sanasi">
                <UInput v-model="form.start_date" type="date" />
              </UFormGroup>
              <UFormGroup name="end_date" label="Tugash sanasi">
                <UInput v-model="form.end_date" type="date" />
              </UFormGroup>
            </div>
            <div class="w-full">
              <UFormGroup name="address.uz" label="Manzil (uz)">
                <UInput v-model="form.address.uz" placeholder="Manzil" />
              </UFormGroup>
              <UFormGroup name="address.ru" label="Manzil (ru)">
                <UInput v-model="form.address.ru" placeholder="Manzil" />
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
          <div class="flex max-sm:flex-wrap gap-2">
            <div class="w-full">
              <UFormGroup name="owner_id" label="Telegram ID">
                <UInput v-model="form.owner_id" type="number" placeholder="Telegram ID" />
              </UFormGroup>
              <UFormGroup name="body.uz" label="Tavsif (uz)">
                <UTextarea v-model="form.body.uz" placeholder="E'lon matni" />
              </UFormGroup>
              <UFormGroup name="body.ru" label="Tavsif (ru)">
                <UTextarea v-model="form.body.ru" placeholder="E'lon matni" />
              </UFormGroup>
            </div>
            <div class="w-full">
              <UFormGroup>
                <USelect v-model="statusService"
                  :options="[{ name: 'Media', status: true }, { name: 'Xizmat', status: false }]"
                  option-attribute="name" value-attribute="status" placeholder="Xizmat turi" />
              </UFormGroup>
              <UFormGroup v-if="statusService == 'true'" label="Menu [200px : 100px]">
                <input required type="file" accept="image/*" @change="menuSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
              </UFormGroup>
              <UFormGroup label="Xizmat" v-if="statusService == 'false'">
                <UTextarea v-model="form.services" placeholder="Xizmatlar" />
              </UFormGroup>
              <UFormGroup label="Hashtag">
                <UTextarea v-model="form.hashtags" placeholder="Hashtag" />
              </UFormGroup>
              <UFormGroup label="Ijtimoiy tarmoqlar">
                <UTextarea v-model="form.social_media" placeholder="Ijtimoiy tarmoqlar" />
              </UFormGroup>
            </div>

          </div>



          <UButton type="submit" color="primary" block :loading="loadingSubmit">
            Yuborish
          </UButton>
        </UForm>
      </UCard>
    </UModal>

    <!-- Tahrirlash modal -->
    <UModal v-model="isEditModalOpen" fullscreen>
      <UCard :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow'
        }
      }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Manzilni tahrirlash
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isEditModalOpen = false" />
          </div>
        </template>
        <UForm :state="editArticle" :schema="articleSchema" @submit="saveArticle" class="space-y-4">
          <UFormGroup name="photo" label="Rasm [200px : 100px]">
            <input type="file" accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
          </UFormGroup>
          <div class="max-h-[200px] overflow-auto">
            <div class="flex justify-between items-center" v-for="(item, index) in imagesEdit" :key="index">
              <UFormGroup label="Rasm [200px : 100px]">
                <input type="file" accept="image/*" @change="bannerSubmit($event, index)" class="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100" />
                <img v-if="item.image" :src="item.image" alt="Image Preview"
                  class="w-[100px] h-[100px] object-contain" />
              </UFormGroup>
              <div>
                <div class="w-[100px]">
                  <UButton icon="i-heroicons-minus" color="red" @click="bannerRemove(index)"
                    v-if="images.length > 1 && false">
                  </UButton>
                </div>
                <div class="w-[100px]">
                  <UButton icon="i-heroicons-plus" v-if="images.length == index + 1" @click="bannerCreate(index)">
                  </UButton>
                </div>

              </div>
            </div>
          </div>
          <div class="flex max-sm:flex-wrap gap-2">
            <div class="w-full">


              <UFormGroup name="region_id" label="Hudud">
                <USelect v-model="editArticle.region_id" :options="regions" option-attribute="title.uz"
                  value-attribute="id" placeholder="Hududdni tanlang" />
              </UFormGroup>
              <UFormGroup name="title.uz" label="Sarlavha (uz)">
                <UInput v-model="editArticle.title.uz" placeholder="Sarlavha" />
              </UFormGroup>
              <UFormGroup name="title.ru" label="Sarlavha (ru)">
                <UInput v-model="editArticle.title.ru" placeholder="Sarlavha" />
              </UFormGroup>
              <div class="flex justify-between">
                <UFormGroup name="is_ad" label="Reklama holati">
                  <UToggle v-model="editArticle.is_ad" />
                </UFormGroup>
                <UFormGroup name="is_popular" label="Mashxur">
                  <UToggle v-model="editArticle.is_popular" />
                </UFormGroup>
              </div>
              <UFormGroup name="start_date" label="Boshlanish sanasi">
                <UInput v-model="editArticle.start_date" type="date" />
              </UFormGroup>

              <UFormGroup name="end_date" label="Tugash sanasi">
                <UInput v-model="editArticle.end_date" type="date" />
              </UFormGroup>


            </div>
            <div class="w-full">
              <UFormGroup name="address.uz" label="Manzil (uz)">
                <UInput v-model="editArticle.address.uz" placeholder="Manzil" />
              </UFormGroup>
              <UFormGroup name="address.ru" label="Manzil (ru)">
                <UInput v-model="editArticle.address.ru" placeholder="Manzil" />
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
          <div class="flex max-sm:flex-wrap gap-2">
            <div class="w-full">
              <UFormGroup name="owner_id" label="Telegram ID">
                <UInput v-model="editArticle.owner_id" type="number" placeholder="Telegram ID" />
              </UFormGroup>
              <UFormGroup name="body.uz" label="Tavsif (uz)">
                <UTextarea v-model="editArticle.body.uz" placeholder="E'lon matni" />
              </UFormGroup>
              <UFormGroup name="body.ru" label="Tavsif (ru)">
                <UTextarea v-model="editArticle.body.ru" placeholder="E'lon matni" />
              </UFormGroup>
            </div>
            <div class="w-full">
              <UFormGroup>
                <USelect v-model="statusService"
                  :options="[{ name: 'Media', status: true }, { name: 'Xizmat', status: false }]"
                  option-attribute="name" value-attribute="status" placeholder="Xizmat turi" />
              </UFormGroup>
              <UFormGroup v-if="statusService == 'true'" label="Menu [200px : 100px]">
                <input required type="file" accept="image/*" @change="menuSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
              </UFormGroup>
              <UFormGroup label="Xizmat" v-if="statusService == 'false'">
                <UTextarea v-model="editArticle.services" placeholder="Xizmatlar" />
              </UFormGroup>
              <UFormGroup label="Hashtag">
                <UTextarea v-model="editArticle.hashtags" placeholder="Hashtag" />
              </UFormGroup>
              <UFormGroup label="Ijtimoiy tarmoqlar">
                <UTextarea v-model="editArticle.social_media" placeholder="Ijtimoiy tarmoqlar" />
              </UFormGroup>
            </div>
          </div>
          <UButton type="submit" color="primary" block :loading="loadingSubmit">
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
import { USelect } from '#components'
const config = useRuntimeConfig()
const status = ref('published');
const options = [
  {
    name: 'No faol',
    value: 'inactived'
  },
  {
    name: 'Kutilmoqda',
    value: 'waiting'
  },
  {
    name: 'Faol',
    value: 'published'
  },
]
const { coords, error, getLocation } = useGeolocation()
onMounted(() => {
  getLocation()
  setTimeout(() => {
    form.value.latitude = coords.value?.latitude
    form.value.longitude = coords.value?.longitude

  }, 2000)

})

const images = ref([{ image: '' }]);

const bannerSubmit = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      images.value[index].image = reader.result;
      imagesEdit.value[index].image = reader.result;

    };
    reader.readAsDataURL(file);
    urls.value.push({ urls: file })
  }
};
const menuSubmit = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    form.value.menu = file;
    editArticle.value.menu = file
  }
};
const bannerCreate = (index) => {
  images.value.push({
    image: ''
  });
  imagesEdit.value.push({
    image: ''
  })
};

const bannerRemove = (index) => {
  images.value.splice(index, 1);
};

const statusService = ref('false')
const urls = ref([])
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
const imagesEdit = ref([]);
const articleIdEdit = ref('')
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const editArticle = ref({
  id: 0,
  author_id: 0,
  categorie_id: 0,
  region_id: 0,
  is_ad: false,
  title: {
    uz: '',
    ru: ''
  },
  body: {
    uz: '',
    ru: ''
  },
  address: {
    uz: '',
    ru: ''
  },
  phone_number: 0,
  latitude: 0,
  longitude: 0,
  start_date: "",
  end_date: "",
  owner_id: null,
  services: '',
  social_media: '',
  hashtags: '',
  is_popular: false,
  menu: '',
})
async function getAll() {
  try {
    loading.value = true;
    const { data, error, refresh } = await request(`/articles?status=${status.value}&page=${articles.value.page}&page_size=${articles.value.page_size}&category_id=${categoryId}`, 'get');
    articles.value = data
  } catch (error) {

  } finally {
    loading.value = false
  }

}
getAll();


// Tahrirlash
const openEditModal = (article) => {
  editArticle.value = { ...article };
  imagesEdit.value = []
  if (article?.article_media[0]?.url?.length > 0) {
    article?.article_media[0]?.url.forEach((item) => {
      imagesEdit.value.push({ image: `https://api.qattabor.uz/${item}` })
    })
  } else {
    imagesEdit.value.push({ image: '' })
  }
  articleIdEdit.value = article?.article_media[0]?.id
  isEditModalOpen.value = true
}
const loadingSubmit = ref(false);

async function saveArticle() {
  loadingSubmit.value = true
  for (const item of urls.value) {
    const { error: bannerError } = await request(`/media/update`, 'put', formData({ id: articleIdEdit.value, ...item }));
    if (bannerError) {
      console.error('Banner error:', bannerError);
      return;
    }
  }
  const { data, error, refresh } = await request(`/articles/update`, 'put', formData(editArticle.value))
  if (error) return;
  isEditModalOpen.value = false;
  articles.value = {
    page: 1,
    page_size: 12,
    total_count: 3,
    total_pages: 1,
    data: []
  }
  getAll();
  loadingSubmit.value = false
}

// O‘chirish
const deleteArticle = async (id) => {

  const { data, error, refresh } = await request(`/articles/delete?id=${id}`, 'delete')
  if (error) return;
  getAll();
}



const form = ref({
  author_id: 0,
  categorie_id: 0,
  region_id: 0,
  is_ad: false,
  title: {
    uz: '',
    ru: ''
  },
  body: {
    uz: '',
    ru: ''
  },
  address: {
    uz: '',
    ru: ''
  },
  phone_number: '',
  status: false,
  latitude: 0,
  longitude: 0,
  photo: '',
  menu: '',
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date().toISOString().split('T')[0],
  owner_id: null,
  services: '',
  social_media: '',
  hashtags: '',
  is_popular: false
})
const regions = ref([]);
async function submitForm() {
  loadingSubmit.value = true;
  let postForm = {
    ...form.value,
    categorie_id: categoryId,
    slug: ''
  }
  postForm.hashtags = postForm.hashtags.split(',');
  console.log(urls.value);

  // images.value.forEach((item) => {
  //   urls.value.push(item.image)
  // })
  // for (const item of urls.value) {
  //   const { error: bannerError } = await request(`/media/create`, 'post', formData(item));
  //   if (bannerError) {
  //     console.error('Banner error:', bannerError);
  //     return;
  //   }
  // }
  const { error: bannerError } = await request(`/media/create`, 'post', formData(urls.value));

  const { data, error, refresh } = await request(`/articles/create`, 'post', formData(postForm));
  if (error) return;
  isCreateModalOpen.value = false;
  articles.value = {
    page: 1,
    page_size: 12,
    total_count: 3,
    total_pages: 1,
    data: []
  }
  getAll();
  loadingSubmit.value = false;
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
watch(() => articles.value.page, () => {
  getAll();
});
watch(() => isCreateModalOpen.value, () => {
  form.value = {
    author_id: 0,
    categorie_id: 0,
    region_id: 0,
    is_ad: false,
    title: {
      uz: '',
      ru: ''
    },
    body: {
      uz: '',
      ru: ''
    },
    address: {
      uz: '',
      ru: ''
    },
    phone_number: '',
    status: false,
    latitude: 0,
    longitude: 0,
    photo: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    owner_id: null,
    services: '',
    social_media: '',
    hashtags: '',
    is_popular: false
  }
})
</script>