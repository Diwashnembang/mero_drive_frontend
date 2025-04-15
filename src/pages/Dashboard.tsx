import type React from "react"

import { useState, useRef } from "react"
import { useAuthStore } from "../store/authStore"
import { useFileStore, type File } from "../store/fileStore"
import { FolderIcon, DocumentIcon, DownloadIcon, TrashIcon, LogOutIcon, UploadIcon } from "../components/icons"

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const { files, addFile, deleteFile } = useFileStore()
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return

    Array.from(uploadedFiles).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newFile: File = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: new Date().toISOString(),
          content: reader.result,
        }
        addFile(newFile)
      }
      reader.readAsDataURL(file)
    })

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDownload = (file: File) => {
    if (!file.content) return

    const link = document.createElement("a")
    link.href = file.content as string
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Mero Drive</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.name || "User"}</span>
            <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100" title="Logout">
              <LogOutIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Upload Button */}
        <div className="mb-6">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Upload Files
          </button>
        </div>

        {/* Files List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">My Files</h3>
          </div>

          {files.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FolderIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2">No files yet. Upload some files to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Modified
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className={`hover:bg-gray-50 ${selectedFile === file.id ? "bg-gray-50" : ""}`}
                      onClick={() => setSelectedFile(file.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {file.type.includes("image") ? (
                            <img
                              src={(file.content as string) || "/placeholder.svg"}
                              alt={file.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <DocumentIcon className="h-10 w-10 text-gray-400" />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-500">{file.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatFileSize(file.size)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(file.lastModified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDownload(file)}
                          className="text-teal-600 hover:text-teal-900 mr-4"
                          title="Download"
                        >
                          <DownloadIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
