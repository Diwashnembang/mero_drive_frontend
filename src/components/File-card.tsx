import { useState } from "react"
import { Download, File, Maximize2, X } from "lucide-react"

export interface FileCardProps {
  file: {
    id: string
    name: string
    url: string
    type: string
    size?: string
  }
}

export function FileCard({ file }: FileCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isImage = file.type.startsWith("image/")
  const isPdf = file.type === "application/pdf"

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="relative group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
        <div className="aspect-square w-full overflow-hidden bg-gray-100">
          {isImage ? (
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <File className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate text-sm font-medium">{file.name}</h3>
          <p className="text-xs text-gray-500">{file.size}</p>
        </div>
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={toggleExpand}
            className="rounded-full bg-white p-1.5 text-gray-700 shadow-sm hover:bg-gray-100"
            aria-label="Expand"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="rounded-full bg-white p-1.5 text-gray-700 shadow-sm hover:bg-gray-100"
            aria-label="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-lg bg-white p-2">
            <div className="absolute right-2 top-2 flex gap-2 z-10">
              <button
                onClick={handleDownload}
                className="rounded-full bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-100"
                aria-label="Download"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={toggleExpand}
                className="rounded-full bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {isImage ? (
              <img src={file.url || "src\assets\placeholder.svg"} alt={file.name} className="max-h-[80vh] object-contain" />
            ) : isPdf ? (
              <div className="flex h-96 w-full flex-col items-center justify-center gap-4 p-8">
                <File className="h-24 w-24 text-red-500" />
                <p className="text-center text-lg font-medium">{file.name}</p>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </button>
              </div>
            ) : (
              <div className="flex h-96 w-full flex-col items-center justify-center gap-4 p-8">
                <File className="h-24 w-24 text-gray-400" />
                <p className="text-center text-lg font-medium">{file.name}</p>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Download className="h-5 w-5" />
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
