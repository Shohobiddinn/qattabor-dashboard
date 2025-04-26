<script setup>
import Swal from 'sweetalert2'
import { watch, ref } from 'vue'
const { request } = useApi()
const columns = [
    { key: 'name', label: '№' },
    { key: 'email', label: 'Fikr' },
    { key: 'status', label: 'Holat' },
    { key: 'actions', label: 'Amallar' }
]

const deleteRow = (id) => {
    rows.value = rows.value.filter(row => row.id !== id)
}
const feedbacks = ref({
    page: 1,
    page_size: 12
})
async function getAll() {
    const { data, error } = await request(`/feedbacks/all?page=${feedbacks.value.page}&page_size=${feedbacks.value.page_size}`,);
    feedbacks.value = data;

}
getAll();
const deleteFeedback = async (item) => {
    Swal.fire({
        title: "Fikrni o'chirmoqchimisiz ?",
        showCancelButton: true,
        confirmButtonText: "Ha",
        cancelButtonText: "Yo'q",

    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            const { data, error } = request(`/feedbacks/delete?id=${item.id}`,'delete');
            if (!error) {
                getAll();
            }
        }
    });
}

watch(() => feedbacks.value.page, () => {
    getAll();
});
</script>

<template>
    <div class="p-4 max-w-4xl mx-auto" v-if="feedbacks?.data?.length">
        <table class="w-full" v-if="feedbacks?.data?.length">
            <thead>
                <tr>
                    <th v-for="(item, index) in columns" :key="index">
                        {{ item?.label }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in feedbacks.data" :key="index">
                    <th>{{ index + 1 }}</th>
                    <th>{{ item?.feedback }}</th>
                    <th>{{ item?.star_count }}</th>
                    <th>
                        <UButton @click="deleteFeedback(item)" color="red"
                            icon="material-symbols:restore-from-trash-outline"></UButton>
                    </th>
                    <th></th>
                </tr>
            </tbody>
        </table>
        <UPagination v-model="feedbacks.page" :page-count="12" :total="feedbacks.total_count" />
    </div>
    <div>
        <h2 class="text-center"> Ma'lumot topilmadi !</h2>
    </div>
</template>
