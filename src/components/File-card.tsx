import { useEffect, useRef, useState } from "react";
import { Download, File, Maximize2, X, Play } from "lucide-react";
import { joinServerAndPath } from "@/utils/joinPath";
import Cookies from "js-cookie";

export interface FileCardProps {
  file: {
    id: string;
    name: string;
    url: string;
    type: string;
    size?: string;
  };
}
export function FileCard({ file }: FileCardProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(true);
  const videoRef = useRef(null);

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isPdf = file.type === "application/pdf";
  const isAudio = file.type.startsWith("audio/");

  useEffect(()=>{
    if(videoRef.current){
      handlePlay()
    }
  },[expanded])
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking the buttons
    if ((e.target as HTMLElement).closest("button")) return;
    toggleExpand();
  };

  const handlePlay = async () => {
    console.log(videoRef.current)
    if (videoRef.current) {
      const videoElement = videoRef.current as HTMLVideoElement;
      videoElement.pause();
      console.log(file.url)
      const url: string = joinServerAndPath(`getTempToken/${file.id}`);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: Cookies.get("access_token") || "",
          },
        });
        if (!response.ok) {
          throw "not allow to play";
        }
        const token:string = await response.text();
        const videoUrl : string = token; 
        videoElement.src = joinServerAndPath(videoUrl);
        videoElement.load();
        videoElement.play();
      } catch (e) {
        alert(e);
      }
    }
  };

  const renderThumbnail = () => {
      if (isImage) {
        return (
          <>
            {mediaLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={file.url}
              alt={file.name}
              className={`h-full w-full object-cover transition-transform group-hover:scale-105 ${
                mediaLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setMediaLoading(false)}
            />
          </>
        );
      }
      if (isVideo) {
        return (
          <div className="relative h-full w-full bg-gray-900 flex items-center justify-center">
            <video
              className="h-full w-full object-cover"
              poster={`${file.url}#t=0.1`}
            >
              <source type={file.type} />
            </video>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
              className="absolute hover:scale-110 transition-transform"
              aria-label="Play video"
            >
              <Play className="h-12 w-12 text-white opacity-70" />
            </button>
          </div>
        );
      }
      if (isPdf) {
        return (
          <div className="flex h-full w-full items-center justify-center bg-red-50">
            <File className="h-12 w-12 sm:h-16 sm:w-16 text-red-400" />
          </div>
        );
      }
      if (isAudio) {
        return (
          <div className="flex h-full w-full items-center justify-center bg-blue-50">
            <Play className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400" />
          </div>
        );
      }
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-50">
          <File className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
        </div>
      );
    };

    const renderExpandedContent = () => {
      if (isImage) {
        return (
          <img
            src={file.url}
            alt={file.name}
            className="w-full max-h-[85vh] sm:max-h-[80vh] object-contain"
          />
        );
      }
      if (isVideo) {
        return (
          <>
          <video
            controls
            ref={videoRef}
            preload="none"
            className="w-full max-h-[85vh] sm:max-h-[80vh]"
          >
            <source  type={file.type} />
            Your browser does not support the video tag.
          </video>
          </>
        );
      }
      if (isPdf) {
        return (
          <object
            data={file.url}
            type="application/pdf"
            className="w-full h-[85vh] sm:h-[80vh]"
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <File className="h-16 sm:h-24 w-16 sm:w-24 text-red-500" />
              <p className="text-center">
                Unable to display PDF. Click below to download.
              </p>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>
            </div>
          </object>
        );
      }
      if (isAudio) {
        return (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <audio controls className="w-full max-w-md">
              <source src={file.url} type={file.type} />
              Your browser does not support the audio element.
            </audio>
            <p className="text-center text-lg font-medium mt-4">{file.name}</p>
          </div>
        );
      }
      return (
        <div className="flex h-[85vh] sm:h-96 w-full flex-col items-center justify-center gap-4 p-4 sm:p-8" >
          <File className="h-16 sm:h-24 w-16 sm:w-24 text-gray-400"  />
          <p className="text-center text-base sm:text-lg font-medium">
            {file.name}
          </p>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            Download File
          </button>
        </div>
      );
    };

    return (
      <>
        <div
          className="relative group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          aria-label={`Open ${file.name}`}
        >
          <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
            {renderThumbnail()}
          </div>
          <div className="p-2 sm:p-3">
            <h3 className="truncate text-xs sm:text-sm font-medium">
              {file.name}
            </h3>
            <p className="text-xs text-gray-500">{file.size}</p>
          </div>
          <div className="absolute right-1 top-1 sm:right-2 sm:top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 touch-device:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
              className="rounded-full bg-white/90 p-1 sm:p-1.5 text-gray-700 shadow-sm hover:bg-gray-100"
              aria-label="Expand"
            >
              <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="rounded-full bg-white/90 p-1 sm:p-1.5 text-gray-700 shadow-sm hover:bg-gray-100"
              aria-label="Download"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
            <div className="relative w-full max-h-[95vh] sm:max-h-[90vh] max-w-4xl overflow-auto rounded-lg bg-white p-2">
              <div className="absolute right-1 top-1 sm:right-2 sm:top-2 flex gap-1 sm:gap-2 z-10">
                <button
                  onClick={handleDownload}
                  className="rounded-full bg-white/80 backdrop-blur p-2 text-gray-700 shadow-sm hover:bg-gray-100"
                  aria-label="Download"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={toggleExpand}
                  className="rounded-full bg-white/80 backdrop-blur p-2 text-gray-700 shadow-sm hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              {renderExpandedContent()}
            </div>
          </div>
        )}
      </>
    );
}
