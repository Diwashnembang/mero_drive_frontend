import { useRef } from "react";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { joinServerAndPath } from "@/utils/joinPath";

export function UploadDropDown() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const formData = new FormData();
      // formData.append("userId", user.userId)
      for (let i = 0; i < files.length; i++) {
        formData.append("uploads", files[i]);
      }

      const url: string = joinServerAndPath("upload");
      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: Cookies.get("access_token") || "",
          },
        });
        if (response.ok) {
          console.log("upload success");
        } else {
          throw await response.text();
        }
      } catch (error) {
        console.log(error);
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
