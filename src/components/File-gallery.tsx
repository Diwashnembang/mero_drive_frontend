import { FileCard } from "./File-card"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useStore } from "@/hooks/useStore"
import { FileCardProps } from "./File-card"
import { joinServerAndPath } from "@/utils/joinPath"
import Cookies from "js-cookie"


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
const fetchFile = async(fileId:string): Promise<File>=> {
  const url = joinServerAndPath(`file/${fileId}`)
  let file:File = {} as File
    try{
    const response = await fetch(url, {
        method: "GET",
    headers:{
      Authorization: Cookies.get("access_token") || "",
    }
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
       const contentType = response.headers.get("Content-Type") || "application/octet-stream";
        const data:Blob = await response.blob()
        file = new File([data], fileId, { type:  contentType})
    }catch(e){
        console.log(e)
    }
      return file 
}
const fetchFiles = async (fileIds:string[]): Promise<File[]>=> {
    let promises : any = []
    let files : File[] = []
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
    console.log(files)
    return files

}

export function FileGallery() {
    const { data: fileIds } = useQuery<string[]>({
        queryKey: ["files"],
        queryFn: fetchFilesIDS,
    })

    const { data: fetchedFiles } = useQuery<File[]>({
        queryKey: ["files", fileIds],
        queryFn: () => fetchFiles(fileIds ?? []),
        enabled: !!fileIds,
    })
    const {files, setFiles} = useStore() 
    useEffect(()=>{
      if(!fetchedFiles) return 
      let files:FileCardProps[] = []
      fetchedFiles.forEach((file) => {
        let filecard: FileCardProps={
          file:{
          url: URL.createObjectURL(file),
          id: file.name,
          name: file.name,
          type: file.type,
          size: String(file.size),
          }
        }
        files.push(filecard)
      })
      setFiles(files)
      return () => {
        files.forEach((file) => URL.revokeObjectURL(file.file.url))
      }
    },[fetchedFiles])
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.isArray(files) && files.map((f) => {
          const file = f.file;
          return <FileCard key={file?.id} file={file} />;
        })}
      </div>
    </div>
  )
}