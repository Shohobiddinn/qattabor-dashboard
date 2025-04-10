// composables/useAuth.ts
export const useAuth = () => {
    const user = useState('user', () => null)
    const accessToken = useCookie('access_token')
    const refreshToken = useCookie('refresh_token')
    const { request } = useApi()
  
    const login = async (payload: { email: string; password: string }) => {
      const data = await request('/auth/login', 'post', payload)
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token
      user.value = data.user
    }
  
    const logout = () => {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
    }
  
    return { user, login, logout }
  }
3  