import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.tsx'
import Login from './components/Login.tsx';
import Signup from './components/Signup.tsx';
import { SidebarProvider } from './components/ui/sidebar.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login/> },
{ path: "/Signup", element: <Signup/> }
]);

const queryClient= new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <QueryClientProvider client={queryClient}>
    <SidebarProvider >

    <RouterProvider router={router}></RouterProvider>

    </SidebarProvider>
    </QueryClientProvider>
  </StrictMode>,
)
