import { alertWarning } from "@/utils"
export const useGeolocation = () => {
  const coords = ref<{ latitude: number; longitude: number } | null>(null)
  const error = ref<string | null>(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      alertWarning('warning', 'Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi.')
      error.value = 'Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi.'
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      },
      (err) => {
        error.value = 'Geolokatsiya aniqlanmadi: ' + err.message
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return {
    coords,
    error,
    getLocation,
  }
}
