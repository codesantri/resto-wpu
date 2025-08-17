"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import {useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccess() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const order_id = searchParams.get('order_id')


    const { mutate } = useMutation({
        mutationKey: ['mutateUpdateStatusOrder'],
        mutationFn: async () => {
            await supabase.from('orders').update({
                status: 'settled',
            }).eq('order_id', order_id);
        }
    })

    
    useEffect(() => {
        mutate();
    },[order_id])
    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full">
            <CheckCircle className="text-teal-500 size-32" />
            <h2 className="text-3xl">Payment Success</h2>
            <Link href={'/dashboard/orders'}>
                <Button 
                    className="cursor-pointer"
                >
                    Go Back To Order
                </Button>
            </Link>
        </div>
    );
}
