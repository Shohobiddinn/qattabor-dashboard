// import handleError from "~/utils/handle"

// // composables/useApi.ts
// export const useApi = () => {
//     const { $api } = useNuxtApp()
  
//     const request = async (url: string, method:string = 'get', data: any = null) => {
//       try {
//         const response = await $api.request({
//           url,
//           method,
//           data
//         })
//         return response.data
//       } catch (err) {
//         handleError(err)
//         throw err
//       }
//     }
  
//     return { request }
//   }
  

import { ref } from 'vue'
import handleError from "~/utils/handle"

export const useApi = () => {
  const data = ref<any>(null)
  const error = ref<any>(null)
  const loading = ref<boolean>(false)
  const { $api } = useNuxtApp()
  const request = async (url: string, method: string = 'get', requestData: any = null) => {
    loading.value = true
    data.value = null
    error.value = null

    try {
      const response = await $api.request({
        url,
        method,
        data: requestData
      })
      data.value = response.data
      loading.value = false
      return { data: data.value, error: null, refresh }
    } catch (err) {
      handleError(err)
      error.value = err
      loading.value = false
      return { data: null, error: error.value, refresh }
    }
  }
  // refresh funksiyasi - so'rovni qayta yuborish
  const refresh = async (url: string, method: string = 'get', requestData: any = null) => {
    return request(url, method, requestData)
  }

  return { request }
}
