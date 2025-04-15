import { useEffect } from "react";
import "./App.css";
import { useStore } from "./hooks/useStore";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { AppSidebar } from "./components/app-sidebar";
import {
  SidebarTrigger,
} from "./components/ui/sidebar";
import { FileGallery } from "./components/File-gallery";
function App() {
  const {  setIsAuthenticated  } = useStore();
  const nagivation = useNavigate();
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      nagivation("/login");
    }
  }, []);
  return (
    <>
      <div className="text-4xl flex spacebetween items-center ">
        {/* {isAuthenticated ? <AppSidebar  collapsible='icon' ></AppSidebar> : 'Please log in'} */}
        <AppSidebar variant="sidebar"></AppSidebar>
          <SidebarTrigger></SidebarTrigger>
        <div className="min-h-screen bg-gray-50 py-8  px-1">
          <div className="container mx-auto px-4" >
            <FileGallery />
          </div>
        </div>
        {/* <Input type='file'placeholder='file upload'></Input> */}
      </div>
    </>
  );
}

export default App;
