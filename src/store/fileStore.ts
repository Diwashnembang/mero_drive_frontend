import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface File {
  id: string
  name: string
  type: string
  size: number
  lastModified: string
  content?: string | ArrayBuffer | null // For demo purposes
}

interface FileState {
  files: File[]
  addFile: (file: File) => void
  deleteFile: (id: string) => void
  getFile: (id: string) => File | undefined
}

export const useFileStore = create<FileState>()(
  persist(
    (set, get) => ({
      files: [],
      addFile: (file) => {
        set((state) => ({
          files: [...state.files, file],
        }))
      },
      deleteFile: (id) => {
        set((state) => ({
          files: state.files.filter((file) => file.id !== id),
        }))
      },
      getFile: (id) => {
        return get().files.find((file) => file.id === id)
      },
    }),
    {
      name: "file-storage",
    },
  ),
)
