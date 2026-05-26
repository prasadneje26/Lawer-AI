import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  role: string
  organization?: string
  specialization?: string
  experience_years?: number
  is_active: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('lawer_token', token)
        localStorage.setItem('lawer_user', JSON.stringify(user))
        set({ user, token })
      },
      clearAuth: () => {
        localStorage.removeItem('lawer_token')
        localStorage.removeItem('lawer_user')
        set({ user: null, token: null })
      },
      isAdmin: () => get().user?.role === 'admin',
    }),
    { name: 'lawer-auth' }
  )
)
