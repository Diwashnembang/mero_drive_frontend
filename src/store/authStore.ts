import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

// In a real app, you would connect this to a backend
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Mock login - in a real app, this would call your API
        if (email && password) {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          // For demo purposes, any non-empty email/password works
          set({
            user: {
              id: "1",
              name: email.split("@")[0],
              email,
            },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      signup: async (name, email, password) => {
        // Mock signup - in a real app, this would call your API
        if (name && email && password) {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          set({
            user: {
              id: "1",
              name,
              email,
            },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
