"use server";
import { environment } from "@/config/environment";
import { createClient } from "@/lib/supabase/server";
import { FormState } from "@/types/general";
import midtrans from "midtrans-client";
import { redirect } from "next/navigation";

export async function generatePaymentToken(prevState: FormState, formData: FormData) {
    const supabase = await createClient();

    const id = (formData.get("id") as string) ?? null;
    const orderId = (formData.get("order_id") as string) ?? null;
    const discount = parseInt((formData.get("discount") as string) ?? "0", 10);
    const tax = parseInt((formData.get("tax") as string) ?? "0", 10);
    const service = parseInt((formData.get("service") as string) ?? "0", 10);
    const subtotal = parseInt((formData.get("subtotal") as string) ?? "0", 10);
    const totalPayment = parseInt((formData.get("total_payment") as string) ?? "0", 10);
    const customerName = (formData.get("customer_name") as string) ?? "Guest";

    if (!orderId || !id) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: ["Missing required fields"],
            },
            data: { payment_token: "" },
        };
    }

    const snapPay = new midtrans.Snap({
        isProduction: false,
        serverKey: environment.MIDTRANS_SERVER_KEY,
    });

    const params = {
        transaction_details: {
            order_id: orderId,
            gross_amount: totalPayment,
        },
        customer_details: {
            first_name: customerName,
        },
    };

    try {
        const result = await snapPay.createTransaction(params);

        if (result?.error_messages) {
            return {
                status: "error",
                errors: {
                    ...prevState.errors,
                    _form: [result.error_messages].flat(),
                },
                data: { payment_token: "" },
            };
        }

        const [{ error: orderError }, { error: transactionError }] = await Promise.all([
            supabase.from("orders").update({ payment_token: result.token }).eq("order_id", orderId),
            supabase.from("transactions").insert({
                order_id: id,
                cash: 0,
                cash_back: 0,
                subtotal:subtotal,
                discount,
                tax,
                service,
                total_payment: totalPayment,
                payment_method: "online",
            }),
        ]);

        if (orderError || transactionError) {
            return {
                status: "error",
                errors: {
                    ...prevState.errors,
                    _form: [
                        orderError?.message,
                        transactionError?.message,
                    ].filter(Boolean) as string[],
                },
                data: { payment_token: "" },
            };
        }

        return {
            status: "success",
            data: { payment_token: result.token },
        };
    } catch (error: any) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: [error.message ?? "Unexpected error"],
            },
            data: { payment_token: "" },
        };
    }
}



export async function cashPayment(prevState: FormState, formData: FormData) {
    const supabase = await createClient();

    const id = (formData.get("id") as string) ?? null;
    const orderId = (formData.get("order_id") as string) ?? null;

    const cash = parseInt((formData.get("cash") as string) ?? "0", 10);
    const cashBack = parseInt((formData.get("cash_back") as string) ?? "0", 10);
    const discount = parseInt((formData.get("discount") as string) ?? "0", 10);
    const tax = parseInt((formData.get("tax") as string) ?? "0", 10);
    const service = parseInt((formData.get("service") as string) ?? "0", 10);
    const subtotal = parseInt((formData.get("subtotal") as string) ?? "0", 10);
    const totalPayment = parseInt((formData.get("total_payment") as string) ?? "0", 10);

    if (!id || !orderId) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: ["Missing required fields"],
            },
        };
    }

    const { error: transactionError } = await supabase.from("transactions").insert({
        order_id: id,
        cash,
        subtotal:subtotal,
        cash_back: cashBack,
        discount,
        tax,
        service,
        total_payment: totalPayment,
        payment_method: "cash",
    });

    if (transactionError) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: [transactionError.message].filter(Boolean),
            },
        };
    }

    return redirect(`/payment/success?order_id=${orderId}`);
}
