import { environment } from "@/config/environment";
import { createClient } from "@/lib/supabase/client";
import { FormState } from "@/types/general";

import midtrans from "midtrans-client";

export async function generatePaymentToken(prevState: FormState, formData: FormData) {
    const supabase = await createClient();

    const orderId = formData.get("id") as string | null;
    const grossAmount = formData.get("gross_amount") as string | null;
    const customerName = formData.get("customer_name") as string | null;

    if (!orderId || !grossAmount || !customerName) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: ["Missing required fields"],
            },
            data: {
                payment_token: "",
            },
        };
    }

    const snapPay = new midtrans.Snap({
        isProduction: false,
        serverKey: environment.MIDTRANS_SERVER_KEY,
    });

    const params = {
        transaction_details: {
            order_id: orderId,
            gross_amount: parseFloat(grossAmount), // ✅ pakai gross_amount
        },
        customer_details: {
            first_name: customerName,
        },
    };

    try {
        const result = await snapPay.createTransaction(params);

        if (result.error_messages) {
            return {
                status: "error",
                errors: {
                    ...prevState.errors,
                    _form: [result.error_messages],
                },
                data: {
                    payment_token: "",
                },
            };
        }

        // ✅ update token ke Supabase
        await supabase
            .from("orders")
            .update({ payment_token: result.token })
            .eq("order_id", orderId);

        return {
            status: "success",
            data: {
                payment_token: result.token, // ✅ pakai ":" bukan "="
            },
        };
    } catch (error: any) {
        return {
            status: "error",
            errors: {
                ...prevState.errors,
                _form: [error.message || "Unexpected error occurred"],
            },
            data: {
                payment_token: "",
            },
        };
    }
}
