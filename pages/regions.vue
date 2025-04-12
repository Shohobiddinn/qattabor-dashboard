<template>
    <div>
        <div class="space-y-6">
            <!-- Filter va qidiruv paneli -->
            <div class="flex flex-wrap gap-4">
                <div class="flex-1"></div>
                <UInput v-model="search" type="search" @change="getRegionList" placeholder="Qidiruv..."
                    class="w-full sm:w-auto flex-1" />
                <UButton :disabled="!search" icon="hugeicons:search-02" @click="getRegionList" class="w-full sm:w-auto">
                </UButton>
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
                                            @click="deleteRegion(region.id)" class="justify-start">
                                            O‘chirish
                                        </UButton>
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                    </template>

                    <div class="mt-2">
                        <h2>{{ region?.title }}</h2>
                        <div>
                            <span>{{ region?.latitude }}</span> - <span>{{ region?.longitude }}</span>
                        </div>
                    </div>

                    <!-- Tavsif -->
                    <p class="text-sm text-gray-600">{{ region.description || 'Tavsif yo‘q' }}</p>

                    <template #footer>
                        <div class="text-xs text-gray-400 text-right">
                            Yangilangan: {{ new Date(region.updated_at).toLocaleString('uz-UZ') }}
                        </div>
                    </template>
                </UCard>
            </div>

            <!-- Qo‘shish modal -->
            <UModal v-model="isCreateModalOpen">
                <UCard>
                    <template #header>Foydalanuvchi qo‘shish</template>
                    <UForm :state="newRegion" :schema="schema" @submit="createRegion">
                        <UFormGroup name="name" label="Foydalanuvchi nomi">
                            <UInput v-model="newRegion.name" placeholder="Foydalanuvchi nomi" />
                        </UFormGroup>
                        <UFormGroup name="username" label="Login">
                            <UInput v-model="newRegion.username" placeholder="Login" />
                        </UFormGroup>
                        <UFormGroup name="password" label="Parol">
                            <UInput v-model="newRegion.password_hash" placeholder="Parol" />
                        </UFormGroup>
                        <UFormGroup name="photo" label="Rasm">
                            <input type="file" accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
                        </UFormGroup>

                        <UFormGroup name="description" label="Tavsif">
                            <UTextarea v-model="newRegion.description" placeholder="Tavsif" />
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
                    <template #header>Foydalanuvchini tahrirlash</template>
                    <UForm :state="editRegion" :schema="schema" @submit="saveRegion">
                        <UFormGroup name="name" label="Foydalanuvchi nomi">
                            <UInput v-model="editRegion.name" placeholder="Foydalanuvchi nomi" />
                        </UFormGroup>

                        <UFormGroup name="photo" label="Rasm">
                            <input type="file" accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
                        </UFormGroup>

                        <UFormGroup name="description" label="Tavsif">
                            <UTextarea v-model="editRegion.description" placeholder="Tavsif" />
                        </UFormGroup>

                        <UButton type="submit" color="primary" block>
                            Saqlash
                        </UButton>
                    </UForm>
                </UCard>
            </UModal>
        </div>

    </div>
</template>

<script setup>
import { z } from "zod"
import { ref, watch } from 'vue'
import { formData } from "~/utils"
const { request } = useApi()
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
    name: '',
    username: "",
    password_hash: '',
    role: 'admin',
    status: 'actived',
    description: '',
    photo: null,
})

const schema = z.object({
    name: z.string().min(1, 'Foydalanuvchi nomi majburiy'),
    username: z.string().min(1, 'Login majburiy'),
    password_hash: z.string().min(1, 'Parol majburiy'),
    description: z.string().min(1, 'Tavsif majburiy'),
    photo: z.any().optional().refine((file) => !file || file instanceof File, 'Faqat rasm fayli tanlang')
})

const editRegion = ref({
    id: 0,
    name: '',
    description: '',
    photo: null,
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
        const { data, error, refresh } = await request(`/regions/create`, 'post', formData(newRegion.value));
        regions.value.data.push(
            ...newRegion.value, id
        )
        newRegion.value = {
            name: '',
            username: "",
            password_hash: '',
            role: 'admin',
            status: true,
            description: '',
            photo: null,
        }
        isCreateModalOpen.value = false

    } catch { }
}

const saveRegion = async () => {
    try {
        const { data, error, refresh } = await request(`/region/update`, 'put', formData(editRegion.value))
        const index = regions.value.data.findIndex(u => u.id === editRegion.value.id)
        if (index !== -1) {
            regions.value[index] = { ...editRegion.value }
        }
        editRegion.value = { name: '', description: '', photo: null }
        isEditModalOpen.value = false
    } catch { }
}

const deleteRegion = async (id) => {
    const { data, error, refresh } = await request(`/region/delete?id=${id}`, 'delete')
    regions.value.data = regions.value.data.filter(u => u.id !== id)
}
const openEditModal = (region) => {
    editRegion.value = { ...region }
    isEditModalOpen.value = true
}

</script>

<style lang="scss" scoped></style>