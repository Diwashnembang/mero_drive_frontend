import { create } from "zustand"

export interface File {
  id: string
  name: string
  url: string
  type: string
  size?: string
}

interface FileState {
  files: File[]
  addFile: (file: File) => void
  removeFile: (id: string) => void
  clearFiles: () => void
}

export const useFileStore = create<FileState>((set) => ({
  files: [
    {
      id: "1",
      name: "mountain.jpg",
      url: "src/assets/placeholder.svg?height=400&width=400",
      type: "image/jpeg",
      size: "1.2 MB",
    },
    {
      id: "2",
      name: "document.pdf",
      url: "#",
      type: "application/pdf",
      size: "2.5 MB",
    },
    {
      id: "3",
      name: "beach.jpg",
      url: "/placeholder.svg?height=400&width=400",
      type: "image/jpeg",
      size: "3.1 MB",
    },
    {
      id: "4",
      name: "presentation.pdf",
      url: "#",
      type: "application/pdf",
      size: "4.7 MB",
    },
    {
      id: "5",
      name: "forest.jpg",
      url: "/placeholder.svg?height=400&width=400",
      type: "image/jpeg",
      size: "2.8 MB",
    },
    {
      id: "6",
      name: "report.pdf",
      url: "#",
      type: "application/pdf",
      size: "1.5 MB",
    },
  ],
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (id) => set((state) => ({ files: state.files.filter((file) => file.id !== id) })),
  clearFiles: () => set({ files: [] }),
}))
