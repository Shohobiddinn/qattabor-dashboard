// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: process.env.BASE_URL || 'default-url', 
      apiImgUrl:process.env.IMG_URL || '',
    },
  },
  build: {
    transpile: ['@nuxt/ui']
  },
  plugins: [
    '~/plugins/axios.ts'
  ]
})