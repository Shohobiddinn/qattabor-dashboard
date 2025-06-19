<template>
    <div>
        <div class="flex flex-wrap gap-4 mb-2">
            <div class="flex-1">
            </div>

            <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true" class="w-full sm:w-auto">
                Reklama qo‘shish
            </UButton>
        </div>
    </div>
    <div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="loading">
            <UiSkeleton v-for="(item, index) in 6" :key="index" />

        </div>
        <!-- Kategoriyalar ro'yxati -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="ads?.data?.length && !loading">
            <UCard v-for="item in ads?.data" :key="item.id">
                <template #header>
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold truncate">{{ item?.title }}</span>

                        <!-- Popover menyu -->
                        <UPopover :popper="{ placement: 'bottom-end' }">
                            <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost" />
                            <template #panel>
                                <div class="flex flex-col gap-1 p-2 w-40">
                                    <UButton icon="i-heroicons-pencil-square" variant="ghost"
                                        @click="openEditModal(item)" class="justify-start">
                                        Tahrirlash
                                    </UButton>
                                    <UButton icon="material-symbols:360" variant="ghost" @click="sendAds(item.id)"
                                        class="justify-start">
                                        Botga reklama jo'natish
                                    </UButton>
                                    <UButton icon="i-heroicons-trash" color="red" variant="ghost"
                                        @click="deleteAds(item.id)" class="justify-start">
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
                        <img v-if="item.media_url" :src="item.media_url" alt="Image"
                            class="object-cover w-full h-full" />
                        <div v-else class="text-gray-400 text-sm">Rasm yo‘q</div>
                    </div>
                </div>

                <!-- Kategoriya tavsifi -->
                <p class="text-sm text-gray-600">{{ item.body || 'Tavsif yo‘q' }}</p>



                <template #footer>
                    <div class="flex flex-col gap-2">
                        <div class="text-xs text-gray-400 text-right">
                            Boshlanish sanasi: {{ new Date(item.start_date).toLocaleString('uz-UZ') }} <br>
                            Tugash sanasi: {{ new Date(item.expire_date).toLocaleString('uz-UZ') }}
                        </div>
                    </div>
                </template>
            </UCard>

        </div>
        <UPagination v-model="ads.page" :page-count="12" :total="ads.total_count" v-if="ads?.data?.length" />
        <div v-else-if="!loading && !ads?.data?.length" class="flex justify-center">
            <h1>Ma'lumot topilmadi !</h1>
        </div>
    </div>
    <!-- Qo‘shish modal -->
    <UModal v-model="isCreateModalOpen">
        <UCard>
            <template #header>Reklama qo‘shish</template>
            <UForm :state="newAds" :schema="adsSchema" @submit="createAds">
                <UFormGroup name="title" label="Reklama nomi">
                    <UInput v-model="newAds.title" placeholder="Reklama nomi" />
                </UFormGroup>
                <UFormGroup name="start_date" label="Boshlanish sanasi">
                    <UInput type="date" v-model="newAds.start_date" placeholder="Boshlanish sanasi" />
                </UFormGroup>
                <UFormGroup name="expire_date" label="Tugash sanasi">
                    <UInput type="date" v-model="newAds.expire_date" placeholder="Tugash sanasi" />
                </UFormGroup>
                <UFormGroup name="photo" label="Reklama rasmi">
                    <input type="file" required accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
                </UFormGroup>
                <UFormGroup name="url" label="Reklama manzili">
                    <UInput v-model="newAds.url" placeholder="Reklama manzili" />
                </UFormGroup>
                <UFormGroup name="body" label="Tavsif">
                    <UTextarea v-model="newAds.body" placeholder="Tavsif" />
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
            <template #header>Reklama tahrirlash</template>
            <UForm :state="editAds" :schema="adsSchema" @submit="updateAds">
                <UFormGroup name="title" label="Reklama nomi">
                    <UInput v-model="editAds.title" placeholder="Reklama nomi" />
                </UFormGroup>
                <UFormGroup name="start_date" label="Boshlanish sanasi">
                    <UInput type="date" v-model="editAds.start_date" placeholder="Boshlanish sanasi" />
                </UFormGroup>
                <UFormGroup name="expire_date" label="Tugash sanasi">
                    <UInput type="date" v-model="editAds.expire_date" placeholder="Tugash sanasi" />
                </UFormGroup>
                <UFormGroup name="photo" label="Reklama rasmi">
                    <input type="file" accept="image/*" @change="photoSubmit($event)" class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100" />
                </UFormGroup>
                <UFormGroup name="url" label="Reklama manzili">
                    <UInput v-model="editAds.url" placeholder="Reklama manzili" />
                </UFormGroup>
                <UFormGroup name="body" label="Tavsif">
                    <UTextarea v-model="editAds.body" placeholder="Tavsif" />
                </UFormGroup>

                <UButton type="submit" color="primary" block>
                    Saqlash
                </UButton>
            </UForm>
        </UCard>
    </UModal>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
const { request } = useApi();
import { adsSchema } from '~/schemas';
const loading = ref(false);
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const newAds = ref({
    title: '',
    body: '',
    media_url: null,
    url: '',
    start_date: '',
    expire_date: '',
    status: "true"
})
const editAds = ref({
    title: '',
    body: '',
    media_url: null,
    url: '',
    start_date: '',
    expire_date: '',
    status: "true"
})
const ads = ref({
    page: 1,
    page_size: 12,
    total_count: 3,
    total_pages: 1,
    data: []
})
async function getAll() {
    loading.value = true;
    const { data, error, refetch } = await request(`/ads?page=${ads.value.page}&page_size=${ads.value.page_size}`)
    if (error) return;
    ads.value = data
    loading.value = false;
}
getAll();
function photoSubmit(event) {
    const file = event.target.files[0]
    if (file) {
        newAds.value.media_url = file;
        editAds.value.media_url = file;
    }

}

const createAds = async () => {
    const { data, error, refetch } = await request(`/ads/create`, 'post', formData(newAds.value))
    if (!error) {
        isCreateModalOpen.value = false;
        getAll();

    }
}
const updateAds = async () => {
    const { data, error, refetch } = await request(`/ads/update`, 'put', formData(editAds.value))
    if (!error) {
        isEditModalOpen.value = false;
        getAll();

    }
}
const deleteAds = async (id) => {

    const { data, error, refetch } = await request(`/ads/delete?id=${id}`, 'delete')
    if (!error) {
        getAll();

    }
}
const openEditModal = (item) => {
    editAds.value = { ...item }
    isEditModalOpen.value = true
}
const sendAds =  (id) => {
    Swal.fire({
        title: "Reklama botga jo'natilsinmi ?",
        cancelButtonText: "Yo'q",
        confirmButtonText: "Ha",
        showCloseButton: true,
        showConfirmButton: true,
        showCancelButton: true,
    }).then((res) => {
        if (res.isConfirmed) { request(`/ads/resend?id=${id}`, 'post').then((r)=>{
                getAll();
            })
        }
    });
}
watch(() => ads.value.page, () => {
    getAll();
});
watch(() => isCreateModalOpen.value, () => {
    newAds.value = {
        title: '',
        body: '',
        media_url: null,
        url: '',
        start_date: '',
        expire_date: '',
        status: "true"
    }
})

</script>

<style lang="scss" scoped></style>