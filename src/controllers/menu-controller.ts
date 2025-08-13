'use server';

import { createClient } from "@/lib/supabase/server";
import { menuSchema } from "@/validations/menu-validation";
import { MenuFormState } from "@/types/form-states";
import { STATE_MENU } from "@/constants/menu-constant";
import Storage from "@/storage";

const storage = await Storage();

export async function menuStore(prevState: MenuFormState, formData: FormData | null) {
    if (!formData) {
        return STATE_MENU;
    }

    let validatedFields = menuSchema.safeParse({
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price') as string),
        discount: parseFloat(formData.get('discount') as string),
        is_available: formData.get('is_available') === 'true' ? true : false,
        image_url: formData.get('image_url'),
        description: formData.get('description'),
    })

    if (!validatedFields.success) {
        return {
            status: 'error',
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: [],
            },
        }
    }
    
    if (validatedFields.data.image_url instanceof File) {
        const { errors, data } = await storage.upload('images', 'menus', validatedFields.data.image_url);
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
                image_url: data.url,
            }
        }
    }
    
    const supabase = await createClient();

    const { error } = await supabase.from('menus').insert({
        name: validatedFields.data.name,
        category: validatedFields.data.category,
        price: validatedFields.data.price,
        discount: validatedFields.data.discount,
        is_available: validatedFields.data.is_available,
        image_url: validatedFields.data.image_url,
        description: validatedFields.data.description,
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

export  async function menuUpdate(prevState: MenuFormState, formData: FormData | null) {
    if (!formData) {
        return STATE_MENU;
    }

    let validatedFields = menuSchema.safeParse({
         name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price') as string),
        discount: parseFloat(formData.get('discount') as string),
        is_available: formData.get('is_available') === 'true' ? true : false,
        image_url: formData.get('image_url'),
        description: formData.get('description'),
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
    
    if (validatedFields.data.image_url instanceof File) {
        const oldVatarUrl = formData.get('old_image_url') as string;

        const { errors, data } = await storage.upload('images', 'menus', validatedFields.data.image_url, oldVatarUrl.split('/images/')[1]);
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
                image_url:data.url,
            }
        }
    }
    
    const supabase = await createClient();

    const { error } = await supabase.from('menus').update({
        name: validatedFields.data.name,
        category: validatedFields.data.category,
        price: validatedFields.data.price,
        discount: validatedFields.data.discount,
        is_available: validatedFields.data.is_available,
        image_url: validatedFields.data.image_url,
        description: validatedFields.data.description,
    }).eq('id', formData.get('id'));

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


export async function menuDestroy(prevState: MenuFormState, formData: FormData | null) {
    const supabase = await createClient();
    const image = formData?.get('image_url') as string;
    const {status, errors} = await storage.remove('images', image.split('/images/')[1]);

    if (status=== "error") {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [errors?._form?.[0]?? 'Unknown'],
            },
        };  
    }
    

    const { error } = await supabase.from("menus").delete().eq('id', formData.get('id'));

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


// export async function deleteUser(prevState: UserFormState, formData: FormData | null) {
//     const supabase = await createClient({ isAdmin: true });
//     const image = formData?.get('image_url') as string;
//     const {status, errors} = await deleteFile('images', image.split('/images/')[1]);

//     if (status=== "error") {
//         return {
//             status: 'error',
//             errors: {
//                 ...prevState.errors,
//                 _form: [errors?._form?.[0]?? 'Unknown'],
//             },
//         };  
//     }
    
//     const { error } = await supabase.auth.admin.deleteUser(
//         formData?.get('id') as string,
//     );

//     if (error) {
//         return {
//             status: 'error',
//             errors: {
//                 ...prevState.errors,
//                 _form: [error.message]
//             },
//         };  
//       }
    
//     return {
//         status: 'success',
//     };

// }
