'use server';

import { STATE_CATEGORY } from "@/constants/category-constant";
import { createClient } from "@/lib/supabase/server";
import { CategoryFormState } from "@/types/form-states";
import { categoryFormValidate } from "@/validations/category-validation";

export async function categoryStore(prevState: CategoryFormState, formData: FormData | null) {
    if (!formData) {
        return STATE_CATEGORY;
    }
    const validatedFields = categoryFormValidate.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: [],
            },
        };
    }

    const supabase = await createClient();

    const { error } = await supabase.from('categories').insert({
        name: validatedFields.data.name,
    });

    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message],
            },
        };
    }

    return {
        status: 'success',
    };
}

export  async function categoryUpdate(prevState: CategoryFormState, formData: FormData | null) {
    if (!formData) {
        return STATE_CATEGORY;
    }

    const validatedFields = categoryFormValidate.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: [],
            },
        };
    }
    

    
    const supabase = await createClient();

    const { error } = await supabase.from('categories').update({
        name: validatedFields.data.name,
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

export async function categoryDestroy(prevState: CategoryFormState, formData: FormData | null) {
    if (!formData) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: ["Invalid form data"],
            },
        };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", Number(formData.get("id")));

    if (error) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: [error.message],
            },
        };
    }

    return {
        status: "success",
    };
}
