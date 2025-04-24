import { useRef } from "react";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { joinServerAndPath } from "@/utils/joinPath";
import { useStore } from "@/hooks/useStore";
import { FileCardProps } from "./File-card";
import { useQueryClient } from "@tanstack/react-query";
import { set } from "react-hook-form";

export function UploadDropDown() {
  const { setFiles ,setUploading} = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const formData = new FormData();
      // Store files for later use
      const uploadedFiles: FileCardProps[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("uploads", file);
        uploadedFiles.push({
          file: {
            id: file.name, // Using name as temporary ID
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
            size: String(file.size),
          }
        });
      }

      const url: string = joinServerAndPath("upload");
      try {
        setUploading(true)
        const response = await fetch(url, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: Cookies.get("access_token") || "",
          },
        });
        if (response.ok) {
          // Update files state with the uploaded files
          setUploading(false)
          setFiles(uploadedFiles);
          // Clear the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          console.log("upload success");
        } else {
          throw await response.text();
        }
      } catch (error) {
        console.log(error);
        // Clean up any created object URLs on error
        uploadedFiles.forEach(file => {
          if (file.file.url.startsWith('blob:')) {
            URL.revokeObjectURL(file.file.url);
          }
        });
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>Upload</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={openDialog}>file upload</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
        multiple={true} // Allow multiple file selection
      />
    </>
  );
}
