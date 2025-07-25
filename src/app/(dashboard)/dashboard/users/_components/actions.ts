'use server';
import { ISTATE_CREATE_USER } from "@/constants/user-constans";
import { uploadFile } from "@/actions/storage-actions";
import { createClient } from "@/lib/supabase/server";
import { UserFormState } from "@/types/user";
import { userFormSchema } from "@/validations/user-validation";

export default async function createUser(prevState: UserFormState, formData: FormData | null) {
    if (!formData) {
        return ISTATE_CREATE_USER;
    }

    let validatedFields = userFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
        role: formData.get('role'),
        avatar_url: formData.get('avatar_url'),

    })

     if (!validatedFields.success) {
        return {
            status: 'error',
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form:[],
            },
        }
     }
    
    if (validatedFields.data.avatar_url instanceof File) {
        const { errors, data } = await uploadFile('images', 'users', validatedFields.data.avatar_url);
        if (errors) {
            return {
                status: 'error',
                errors: {
                    ...prevState.errors,
                _form: [...errors._form],
                },
                }
            }
        validatedFields = {
            ...validatedFields,
            data: {
                ...validatedFields.data,
                avatar_url:data.url,
            }
        }
    }
    
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        options: {
            data: {
                name: validatedFields.data.name,
                role:validatedFields.data.role,
                avatar_url:validatedFields.data.avatar_url,
            },
        },
    });

      if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message]
            },
        };  
      }
    
    return {
        status: 'success',
    };
    
}