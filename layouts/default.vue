<template>
    <div class="flex">
      <!-- Sidebar -->
      <DashboardSidebar />
  
      <!-- Asosiy kontent -->
      <div class="flex-1 md:ml-64 px-2 w-full">
        <DashboardNavbar />
        <main class="py-4">
          <NuxtPage />
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped></style>
  