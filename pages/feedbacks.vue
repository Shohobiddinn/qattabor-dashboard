<script setup>
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
    feedbacks.value = data
    console.log(feedbacks.value);

}
getAll();
</script>

<template>
    <div class="p-4 max-w-4xl mx-auto">
        <table  class="w-full" v-if="feedbacks?.data?.length">
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
                    <th><Urating :value="2" max="5" readonly /></th>
                    <th></th>
                    <th></th>
                </tr>
            </tbody>
        </table>
    </div>
</template>
