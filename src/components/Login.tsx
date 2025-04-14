import { LoginForm } from "@/forms/login-form";

export default function Login() { 
 return ( 
    <div className=" h-screen  flex justify-center w-full items-center bg-gray-100">
        <LoginForm className=" w-full max-w-[400px]"  ></LoginForm>
    </div>
 )
} 