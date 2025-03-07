import { useForm } from "react-hook-form"
import { UserSchema,User } from "./schema"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { json } from "stream/consumers"
export function Login() {
    const form = useForm<User>({
        resolver: zodResolver(UserSchema),
        defaultValues:{
            email:"",
            password:""
        }
    })

    async function login(data:User){
        let formData = {
            email : data.email,
            password : data.password
        }
        console.log(JSON.stringify(formData))
        const url : string = "http://localhost:8000/login"
        try{

         let result = await fetch(url,{
            "method":"POST",
            "headers":{
                "Content-Type":"application/json"
            },
            "body":JSON.stringify(formData),
            credentials: 'include'
        })
        if(result.ok){
                console.log("login success")    
            }
            else{
            
                throw result
            }
        }catch(e){
            console.log(e)
        }

    }
    return (
        <div className="max-w-[600px]  flex-col items-center justify-center mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(login)}>
                <FormField name="email" control={form.control} render= {({field})=>(
                    <FormItem>
                        <FormControl>
                         <input {...field} placeholder="Email" />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField name="password" control={form.control} render= {({field})=>(
                    <FormItem>
                        <FormControl>
                         <input {...field} placeholder="password" type="password"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <Button type="submit">Login</Button>
            </form>
        </Form>
</div>
    )
}