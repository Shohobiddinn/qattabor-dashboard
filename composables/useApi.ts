// composables/useApi.ts
export const useApi = () => {
    const { $api } = useNuxtApp()
  
    const request = async (url: string, method:string = 'get', data: any = null) => {
      try {
        const response = await $api.request({
          url,
          method,
          data
        })
        return response.data
      } catch (err) {
        throw err
      }
    }
  
    return { request }
  }
  