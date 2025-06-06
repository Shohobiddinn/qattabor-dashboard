import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const accessCookie = useCookie<string>('access_token') || '';
  const refreshCookie = useCookie<string>('refresh_token') || '';
  const authStore = useAuthStore() || null;

  const apiClient: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
  })

  let isRefreshing = false
  let refreshSubscribers: ((token: string) => void)[] = []

  function onRefreshed(token: string) {
    refreshSubscribers.forEach((callback) => callback(token))
    refreshSubscribers = []
  }

  function addRefreshSubscriber(callback: (token: string) => void) {
    refreshSubscribers.push(callback)
  }

  apiClient.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
    const token = accessCookie.value
    if (token) {
      requestConfig.headers.set('Authorization', `Bearer ${token}`)
    }
    return requestConfig
  })


  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        if (isRefreshing) {
          return new Promise((resolve) => {
            addRefreshSubscriber((newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              resolve(apiClient(originalRequest))
            })
          })
        }

        isRefreshing = true
        try {
          const response = await axios.post(`${config.public.apiBase}/refresh_token`, {
            token: refreshCookie.value,
          })
          useCookie('access_token').value = response.data.access_token
          useCookie('refresh_token').value = response.data.refresh_token
          const newToken: string = response.data.access_token
          accessCookie.value = newToken
          authStore.setUser(response.data);

          onRefreshed(newToken)
          isRefreshing = false

          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          useCookie('access_token').value = null
          navigateTo('/sign-in')
          isRefreshing = false
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )

  nuxtApp.provide('api', apiClient)
})
