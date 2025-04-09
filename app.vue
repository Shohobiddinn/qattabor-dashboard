<template>
    <div class=" bg-gray-50 dark:bg-gray-950">
        <div class="continer max-w-[1400px] mx-auto my-2">
            <NuxtLayout />
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();

onMounted(() => {
  setTimeout(() => {
    console.log(config.public.baseURL); // .env faylidan o'qish
  }, 1000)
});
</script>


<style scoped></style>