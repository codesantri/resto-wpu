'use server';

import { STATE_ORDER } from "@/constants/order-constant";
import { createClient } from "@/lib/supabase/server";
import { OrderFormState} from "@/types/form-states";
import { FormState } from "@/types/general";
import { Cart } from "@/types/order-cart";
import { orderFormValidate } from "@/validations/order-validation";
import { redirect } from "next/navigation";

export async function orderStore(prevState: OrderFormState, formData: FormData | null) {
    if (!formData) {
        return STATE_ORDER;
    }
    
    const validatedFields = orderFormValidate.safeParse({
        customer_name: formData.get('customer_name'),
        table_id: formData.get('table_id'),
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
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const { data, error } = await supabase.from('orders').select('order_id').like('order_id', `ORD-${today}-%`).order('order_id', { ascending: false }).limit(1);
    let nextNum = 1;
    if (data?.length) {
    const lastNum = parseInt(data[0].order_id.split('-').pop(), 10);
    nextNum = lastNum + 1;
    }
    const orderId = `ORD-${today}-${String(nextNum).padStart(3, '0')}`;
    const [orderResult, tableResult] = await Promise.all([
        supabase.from('orders').insert({
            order_id:orderId,
            customer_name: validatedFields.data.customer_name,
            table_id:validatedFields.data.table_id,
            status: validatedFields.data.status,
        }),
        supabase.from('tables').update({
            status: validatedFields.data.status==='reserved'?'reserved':'unavailable',
        }).eq('id', validatedFields.data.table_id),
    ]);

    const orderError = orderResult.error;
    const tableError = tableResult.error;

    if (orderError|| tableError) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [
                    ...(orderError ? [orderError.message] : []),
                    ...(tableError ? [tableError.message] : []),
                ],
            },
        };
    }

    return {
        status: 'success',
        orderId,
    };
}

export async function orderStatusUpdate(prevState: FormState, formData: FormData | null) {
    const supabase = await createClient();

    const [orderResult, tableResult] = await Promise.all([
        supabase.from('orders').update({
            status: formData?.get('status'),
        }).eq('id', formData?.get('id')),

        supabase.from('tables').update({
            status: formData?.get('status')==='process'? 'unavailable':'available',
        }).eq('id', formData?.get('table_id')),
    ]);

    const orderError = orderResult.error;
    const tableError = tableResult.error;

    if (orderError|| tableError) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [
                    ...(orderError ? [orderError.message] : []),
                    ...(tableError ? [tableError.message] : []),
                ],
            },
        };
    }

    return {
        status: 'success',
    };
}

export async function orderAddMenu(prevState: FormState, data: { order_id: string; items: Cart[] }) {
    const supabase = await createClient();
    const payload = data.items.map(({ total, menu, ...item }) => ({ ...item }));
    const { error } = await supabase.from("order_menus").insert(payload);
    if (error) {
        console.error("Insert failed:", error.message);
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: [error.message],
            },
        };
    }
    return redirect(`/dashboard/orders/${data.order_id}`);
}

export async function orderUpdateStatusItem(prevState: FormState, formData: FormData) {
    const supabase = await createClient();
    
    const { error } = await supabase.from('order_menus').update({
        status: formData.get('status'),
    }).eq('id', formData.get('id'));

    if (error) {
        console.error("Insert failed:", error.message);
        return {
            status: "error",
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
