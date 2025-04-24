import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import {create} from 'zustand';
import { FileCardProps } from '../components/File-card';

interface StoreState {
  isAuthenticated: boolean; 
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  user : any
  setUser: (user: any) => void;
  files : FileCardProps[]
  setFiles: (files: FileCardProps[]) => void;
  uploading: boolean 
  setUploading: (uploading: boolean) => void;
}

const token : string | undefined = Cookies.get('access_token')
export const useStore = create<StoreState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated : boolean) => set({ isAuthenticated }), 
  user : token ? jwtDecode(token) : {},
  setUser: (user : any) => set({ user}),
  files : [] as FileCardProps[],
  setFiles: (files : FileCardProps[]) => set((prev)=>( {files : [...prev.files,...files]})),
  uploading: false,
  setUploading: (uploading : boolean) => set({ uploading})
})) 
