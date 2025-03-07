import {z } from 'zod';


export const UserSchema = z.object({
    name: z.string().optional(),
    email : z.string().email('invalid email'),
    password: z.string()
})

export type User = z.infer<typeof UserSchema>