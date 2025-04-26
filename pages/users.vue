<template>
    <div class="space-y-6">
        <!-- Filter va qidiruv paneli -->
        <div class="flex flex-wrap gap-4">
            <div class="flex-1"></div>
            <UInput v-model="search" type="search" @change="getUserList" placeholder="Qidiruv..."
                class="w-full sm:w-auto flex-1" />
            <UButton :disabled="!search" icon="hugeicons:search-02" @click="getUserList" class="w-full sm:w-auto">
            </UButton>
            <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true" class="w-full sm:w-auto">
                Hodim qo‘shish
            </UButton>
        </div>

        <!-- Skeleton -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="loading">
            <UiSkeleton v-for="(item, index) in 6" :key="index" />
        </div>

        <!-- Foydalanuvchilar ro‘yxati -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="users.data.length && !loading">
            <UCard v-for="user in users.data" :key="user.id">
                <template #header>
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold truncate">{{ user?.name }}</span>

                        <!-- Popover menyu -->
                        <UPopover :popper="{ placement: 'bottom-end' }">
                            <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" />
                            <template #panel>
                                <div class="flex flex-col gap-1 p-2 w-40">
                                    <UButton icon="i-heroicons-pencil-square" variant="ghost"
                                        @click="openEditModal(user)" class="justify-start">
                                        Tahrirlash
                                    </UButton>
                                    <UButton icon="i-heroicons-trash" color="red" variant="ghost"
                                        @click="deleteUser(user.id)" class="justify-start">
                                        O‘chirish
                                    </UButton>
                                </div>
                            </template>
                        </UPopover>
                    </div>
                </template>

                <!-- Rasm -->
                <div class="mt-2">
                    <div class="rounded-md w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img v-if="user.photo" :src="config.public.apiImgUrl + user.photo" alt="Image"
                            class="object-cover w-full h-full" />
                        <div v-else class="text-gray-400 text-sm">Rasm yo‘q</div>
                    </div>
                </div>

                <!-- Tavsif -->
                <p class="text-sm text-gray-600">{{ user.description || 'Tavsif yo‘q' }}</p>

                <template #footer>
                    <div class="text-xs text-gray-400 text-right">
                        Yangilangan: {{ new Date(user.updated_at).toLocaleString('uz-UZ') }}
                    </div>
                </template>
            </UCard>
        </div>

        <!-- Qo‘shish modal -->
        <UModal v-model="isCreateModalOpen">
            <UCard>
                <template #header>Foydalanuvchi qo‘shish</template>
                <UForm :state="newUser" :schema="schema" @submit="createUser">
                    <UFormGroup name="name" label="Foydalanuvchi nomi">
                        <UInput v-model="newUser.name" placeholder="Foydalanuvchi nomi" />
                    </UFormGroup>
                    <UFormGroup name="username" label="Login">
                        <UInput v-model="newUser.username" placeholder="Login" />
                    </UFormGroup>
                    <UFormGroup name="password" label="Parol">
                        <UInput v-model="newUser.password_hash" placeholder="Parol" />
                    </UFormGroup>
                    <UFormGroup name="photo" label="Rasm">
                        <input type="file" required accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
                    </UFormGroup>

                    <UFormGroup name="description" label="Tavsif">
                        <UTextarea v-model="newUser.description" placeholder="Tavsif" />
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
                <UForm :state="editUser" @submit="saveUser">
                    <UFormGroup name="name" label="Foydalanuvchi nomi">
                        <UInput v-model="editUser.name" placeholder="Foydalanuvchi nomi" />
                    </UFormGroup>
                    <UFormGroup name="username" label="Login">
                        <UInput v-model="editUser.username" placeholder="Login" />
                    </UFormGroup>
                    <UFormGroup name="password" label="Parol">
                        <UInput v-model="editUser.password" placeholder="Parol" />
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
                        <UTextarea v-model="editUser.description" placeholder="Tavsif" />
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
import { z } from "zod"
import { ref, watch } from 'vue'
import { formData } from "~/utils"
const { request } = useApi();
const loading = ref(false)
const search = ref('')
const config = useRuntimeConfig()

const users = ref({
    page: 1,
    page_size: 12,
    total_count: 3,
    total_pages: 1,
    data: []
})

async function getUserList() {
    loading.value = true
    let searchGet = search.value ? `&name=${search.value}` : ''
    const { data, error, refresh } = await request(`/users/all?page=${users.value.page}&page_size=${users.value.page_size}${searchGet}`, 'get')
    users.value = data
    loading.value = false
}
getUserList();
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)

const newUser = ref({
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

const editUser = ref({
    id: 0,
    name: '',
    username: '',
    password: '',
    role: '',
    photo: null,
    status: 'actived'
})

function photoSubmit(event) {
    const file = event.target.files[0]
    if (file) {
        newUser.value.photo = file
        editUser.value.photo = file
    }
}

const createUser = async () => {
    try {
        const { data, error, refresh } = await request(`/users/create`, 'post', formData(newUser.value));
        if (error) return;
        newUser.value = {
            name: '',
            username: "",
            password_hash: '',
            role: 'admin',
            status: true,
            description: '',
            photo: null,
        }
        isCreateModalOpen.value = false
        getUserList();
    } catch { }
}

const saveUser = async () => {
    try {
        editUser.value.status = 'true';
        const { data, error, refresh } = await request(`/users/update`, 'put', formData(editUser.value))
        if (error) return;
        editUser.value = { name: '', description: '', photo: null }
        isEditModalOpen.value = false
        getUserList();

    } catch { }
}

const deleteUser = async (id) => {
    const { data, error, refresh } = await request(`/users/delete?id=${id}`, 'delete')
    users.value.data = users.value.data.filter(u => u.id !== id)
}
const openEditModal = (user) => {
    editUser.value = {
        ...user,
        password: '',
        status: 'actived'

    }
    isEditModalOpen.value = true
}
watch(() => users.value.page, () => {
    getUserList();
});
watch(() => isCreateModalOpen.value, () => {
    newUser.value = {
        name: '',
        username: "",
        password_hash: '',
        role: 'admin',
        status: 'actived',
        description: '',
        photo: null,
    }
})
</script>

<style lang="scss" scoped></style>