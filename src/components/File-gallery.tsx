import { FileCard } from "./File-card"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState , useRef} from "react"
import { useStore } from "@/hooks/useStore"
import { FileCardProps } from "./File-card"
import { joinServerAndPath } from "@/utils/joinPath"
import Cookies from "js-cookie"

interface FileMeta {
  name: string;
  size: number;
  type: string;
  lastModified: string;
  id: string
  file?: File; // optional blob
}

const fetchFilesIDS = async (): Promise<string[]>=> {
  let ids:string[] = []
  const url = joinServerAndPath(`getAllID`)
  try{
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers:{
      Authorization: Cookies.get("access_token") || "",
    }
  })
  if (!response.ok) {
    let e = await response.text()
    console.log("this is e", e)
    throw e 
  }
    ids = await response.json()
    console.log(ids)
}catch(e){
  console.log(e)
}
  return ids 
}

const fetchFile = async (fileId: string): Promise<FileMeta> => {
  const url = joinServerAndPath(`file/${fileId}`);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: Cookies.get("access_token") || "",
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = res.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      const meta = await res.json();
      return {
        name: meta.name || fileId,
        size: meta.size || 0,
        type: meta.type || "",
        id: fileId,
        lastModified: new Date(meta.lastModified || Date.now()).toISOString(),
      };
    }

    const blob = await res.blob();
    const file = new File([blob], fileId, { type: contentType });

    return {
      name: fileId,
      size: blob.size,
      type: contentType,
      id: fileId,
      lastModified: new Date().toISOString(),
      file,
    };
  } catch (e) {
    return {
      name: fileId,
      size: 0,
      type: "",
      lastModified: new Date().toISOString(),
      id: fileId,
    };
  }
};
const fetchFiles = async (fileIds:string[]): Promise<FileMeta[]>=> {
    let promises : any = []
    let files : FileMeta[] = []
    try{

    fileIds.forEach(id =>{
        promises.push(fetchFile(id))
    })
    let result : any = await Promise.allSettled(promises)
    result.forEach((res:any) => {
    if(res.status !== "fulfilled"){
        throw new Error(result.reason)
    }
        files.push(res.value)
    })

    }catch (e){
        console.log(e)
    }
    return files

}

function LoadingCard() {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="aspect-square w-full bg-gray-100 animate-pulse" />
      <div className="p-2 sm:p-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  )
}

export function FileGallery() {
    const imgUriRef = useRef<string[]>([])
    const { data: fileIds } = useQuery<string[]>({
        queryKey: ["files"],
        queryFn: fetchFilesIDS,
        staleTime: Infinity, // prevents refetching unless explicitly invalidated
        refetchOnWindowFocus: false // prevents refetch when window regains focus
    })
    const batch = useMemo(() => {
        if (!fileIds) return [] as string[][]
        let arr: string[][] =[]
        for (let i = 0; i < fileIds.length; i += 3) {
            arr.push(fileIds.slice(i, i + 3))
        }
        return arr
    }, [fileIds])
    const [batchIndex, setBatchIndex] = useState<number>(0)
    const currentBatch: string[]= batch[batchIndex] ?? [] 
    const { data: fetchedFiles, isSuccess : gotFile, isLoading } = useQuery<FileMeta[]>({
        queryKey: ["files", currentBatch],
        queryFn: () => fetchFiles(currentBatch),
        enabled: currentBatch.length > 0,
        staleTime: Infinity, // prevents refetching unless explicitly invalidated
        refetchOnWindowFocus: false // prevents refetch when window regains focus
    })
    const {files, setFiles, isAuthenticated} = useStore() 
    const [loadingCards, setLoadingCards] = useState<number>(3) // number of cards per batch

    useEffect(()=>{
      if(!fetchedFiles && !gotFile) return 
      let files:FileCardProps[] = []
      fetchedFiles.forEach((file) => {
        if(file.file){
        let filecard: FileCardProps={
          file:{
          url: URL.createObjectURL(file.file),
          id: file.name,
          name: file.name,
          type: file.type,
          size: String(file.size),
          }
        }
        files.push(filecard)
        imgUriRef.current.push(filecard.file.url)
      }else{
        let filecard: FileCardProps={
          file:{
          url: file.id,
          id: file.id,
          name: file.name,
          type: file.type,
          size: String(file.size),
          }
        }
        files.push(filecard)
      }
      })
      setFiles(files)
      if (batchIndex < batch.length - 1) {
        setBatchIndex((prev) => prev + 1)
        setLoadingCards(3) // Reset loading cards for next batch
      }
    },[fetchedFiles, gotFile])
    useEffect(()=>{
      return () => {
        // Cleanup on unmount
        if(!isAuthenticated){
          imgUriRef.current.forEach((uri) => URL.revokeObjectURL(uri))
        }
        setBatchIndex(0) // Reset batch index when component unmounts
      }
    }, [isAuthenticated])
  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 sm:gap-6">
        {Array.isArray(files) && files.map((f) => {
          const file = f.file;
          return <FileCard key={file?.id} file={file} />;
        })}
        {isLoading && Array.from({ length: loadingCards }).map((_, index) => (
          <LoadingCard key={`loading-${batchIndex}-${index}`} />
        ))}
      </div>
    </div>
  )
}

