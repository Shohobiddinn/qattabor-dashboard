<template>
    <div>
        <div class="space-y-6">
            <!-- Filter va qidiruv paneli -->
            <div class="flex flex-wrap gap-4">
                <div class="flex-1"></div>
                <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true" class="w-full sm:w-auto">
                    Hudud qo‘shish
                </UButton>
            </div>

            <!-- Skeleton -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="loading">
                <UiSkeleton v-for="(item, index) in 6" :key="index" />
            </div>

            <!-- Foydalanuvchilar ro‘yxati -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="regions.data.length">
                <UCard v-for="region in regions.data" :key="region.id">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold truncate">{{ region?.name }}</span>

                            <!-- Popover menyu -->
                            <UPopover :popper="{ placement: 'bottom-end' }">
                                <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" />
                                <template #panel>
                                    <div class="flex flex-col gap-1 p-2 w-40">
                                        <UButton icon="i-heroicons-pencil-square" variant="ghost"
                                            @click="openEditModal(region)" class="justify-start">
                                            Tahrirlash
                                        </UButton>
                                        <UButton icon="i-heroicons-trash" color="red" variant="ghost"
                                            @click="deleteRegion(region.slug)" class="justify-start">
                                            O‘chirish
                                        </UButton>
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                    </template>

                    <div class="mt-2">
                        <h2>{{ region?.title?.uz }}</h2>
                        <h2>{{ region?.title?.ru }}</h2>
                        <div>
                            <span>{{ region?.latitude }}</span> - <span>{{ region?.longitude }}</span>
                        </div>
                    </div>

                    <template #footer>
                        <div class="text-xs text-gray-400 text-right">
                            Yangilangan: {{ new Date(region.updated_at).toLocaleString('uz-UZ') }}
                        </div>
                    </template>
                </UCard>
            </div>
            <UPagination v-model="regions.page" :page-count="12" :total="regions.total_count"
                v-if="regions.data.length" />
            <!-- Qo‘shish modal -->
            <UModal v-model="isCreateModalOpen">
                <UCard>
                    <template #header>Hudud qo‘shish</template>
                    <UForm :state="newRegion" :schema="regionCreateSchema" @submit="createRegion">
                        <UFormGroup name="title.uz" label="Hudud nomi (uz)">
                            <UInput v-model="newRegion.title.uz" placeholder="Hudud nomi" />
                        </UFormGroup>
                        <UFormGroup name="title.ru" label="Hudud nomi (ru)">
                            <UInput v-model="newRegion.title.ru" placeholder="Hudud nomi" />
                        </UFormGroup>
                        <UFormGroup name="latitude" label="Kenglik">
                            <UInput v-model="newRegion.latitude" placeholder="Kenglik" />
                        </UFormGroup>
                        <UFormGroup name="longitude" label="Balandlik">
                            <UInput v-model="newRegion.longitude" placeholder="Balandlik" />
                        </UFormGroup>

                        <UButton class="mt-2" type="submit" color="primary" block>
                            Saqlash
                        </UButton>
                    </UForm>
                </UCard>
            </UModal>

            <!-- Tahrirlash modal -->
            <UModal v-model="isEditModalOpen">
                <UCard>
                    <template #header>Hududni tahrirlash</template>
                    <UForm :state="editRegion" :schema="regionCreateSchema" @submit="saveRegion">
                        <UFormGroup name="title.uz" label="Hudud nomi (uz)">
                            <UInput v-model="editRegion.title.uz" placeholder="Hudud nomi" />
                        </UFormGroup>
                           <UFormGroup name="title.ru" label="Hudud nomi (ru)">
                            <UInput v-model="editRegion.title.ru" placeholder="Hudud nomi" />
                        </UFormGroup>
                        <UFormGroup name="latitude" label="Kenglik">
                            <UInput v-model="editRegion.latitude" placeholder="Kenglik" />
                        </UFormGroup>
                        <UFormGroup name="longitude" label="Balandlik">
                            <UInput v-model="editRegion.longitude" placeholder="Balandlik" />
                        </UFormGroup>

                        <UButton class="mt-2" type="submit" color="primary" block>
                            Saqlash
                        </UButton>
                    </UForm>
                </UCard>
            </UModal>
        </div>

    </div>
</template>

<script setup>
import { onMounted } from 'vue'
const { coords, error, getLocation } = useGeolocation()
import { ref, watch } from 'vue'
import { regionCreateSchema } from "~/schemas"
const { request } = useApi()
onMounted(() => {
    getLocation()
    setTimeout(() => {
        newRegion.value.latitude = coords.value.latitude
        newRegion.value.longitude = coords.value.longitude

    }, 2000)

})
const loading = ref(false)
const search = ref('')
const regions = ref({
    page: 1,
    page_size: 12,
    total_count: 3,
    total_pages: 1,
    data: []
})

async function getRegionList() {
    loading.value = true
    let searchGet = search.value ? `&name=${search.value}` : ''
    const { data, error, refresh } = await request(`/region/all?page=${regions.value.page}&page_size=${regions.value.page_size}${searchGet}&status=actived`, 'get')
    regions.value = data
    loading.value = false
}
getRegionList();
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)

const newRegion = ref({
    parent_id: 0,
    title: {
        uz:'',
        ru:''
    },
    latitude: 0,
    longitude: 0
})


const editRegion = ref({
    slug: "",
    parent_id: 0,
    title: "",
    latitude: 0,
    longitude: 0
})

function photoSubmit(event) {
    const file = event.target.files[0]
    if (file) {
        newRegion.value.photo = file
        editRegion.value.photo = file
    }
}

const createRegion = async () => {
    try {
        const id = Date.now()
        const { data, error, refresh } = await request(`/region/create`, 'post', newRegion.value);
        if (error) return;
        isCreateModalOpen.value = false
        getRegionList();
        newRegion.value = {
            parent_id: 0,
            title: "",
            latitude: 0,
            longitude: 0
        }

    } catch { }
}

const saveRegion = async () => {
    try {
        const postData = {
            parent_id: 0,
            title: editRegion.value.title,
            slug: editRegion.value.slug,
            latitude: editRegion.value.latitude,
            longitude: editRegion.value.longitude
        }
        const { data, error, refresh } = await request(`/region/update`, 'put', postData)
        if (error) return;
        getRegionList();
        isEditModalOpen.value = false
    } catch { }
}

const deleteRegion = async (slug) => {
    const { data, error, refresh } = await request(`/region/delete?slug=${slug}`, 'delete')
    getRegionList();
}
const openEditModal = (region) => {
    editRegion.value = { ...region }
    isEditModalOpen.value = true
}
watch(() =>regions.value.page, () => {
    getRegionList();
})
</script>

<style lang="scss" scoped></style>