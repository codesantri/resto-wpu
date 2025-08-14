'use server';

import { STATE_TABLE } from "@/constants/table-constant";
import { createClient } from "@/lib/supabase/server";
import { TableFormState } from "@/types/form-states";
import { tableFormValidate } from "@/validations/table-validation";

export async function tableStore(prevState: TableFormState, formData: FormData | null) {
    if (!formData) {
        return STATE_TABLE;
    }
    const validatedFields = tableFormValidate.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        capacity: formData.get('capacity'),
        status: formData.get('status'),
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

    const { error } = await supabase.from('tables').insert({
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        capacity: validatedFields.data.capacity,
        status: validatedFields.data.status,
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

export  async function tableUpdate(prevState: TableFormState, formData: FormData | null) {
    if (!formData) {
        return STATE_TABLE;
    }


    const validatedFields = tableFormValidate.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        capacity: formData.get('capacity'),
        status: formData.get('status'),
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

    const { error } = await supabase.from('tables').update({
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        capacity: validatedFields.data.capacity,
        status: validatedFields.data.status,
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

export async function tableDestroy(prevState: TableFormState, formData: FormData | null) {
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
        .from("tables")
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
