"use client";

import { Button } from "@/components/ui/button";
import { Ban, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {

    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full">
            <Ban className="text-danger size-32" />
            <h2 className="text-3xl">Payment Failed</h2>
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
