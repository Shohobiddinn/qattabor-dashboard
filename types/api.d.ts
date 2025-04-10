// types/nuxt.d.ts
import type { AxiosInstance } from 'axios'

export interface NuxtApp {
  $api: AxiosInstance
}

declare module '#app' {
  interface NuxtApp {
    $api: AxiosInstance
  }

  interface NuxtPluginContext {
    $api: AxiosInstance
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: AxiosInstance
  }
}
