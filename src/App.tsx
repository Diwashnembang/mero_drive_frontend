import { useEffect } from "react";
import "./App.css";
import { useStore } from "./hooks/useStore";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarTrigger } from "./components/ui/sidebar";
import { FileGallery } from "./components/File-gallery";
import { ProgressToast } from "./components/ui/progress-toast";

function App() {
  const { setIsAuthenticated, uploading } = useStore();
  const nagivation = useNavigate();
  useEffect(() => {
    const token = Cookies.get("access_token");
    console.log(token);
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      nagivation("/login");
    }
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
        <AppSidebar variant="sidebar" />
        <div className="flex-1 relative">
          <div className="sticky top-0 z-10 bg-white border-b px-4 py-2 sm:hidden">
            <SidebarTrigger />
          </div>
          <div className="p-2 sm:p-4">
            <FileGallery />
          </div>
        </div>
      </div>
      {uploading && (
        <ProgressToast
          progress={30}
          fileName="Uploading file..."
          onCancel={() => {
            // Add cancel upload logic here
          }}
        />
      )}
    </>
  );
}

export default App;
