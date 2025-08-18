"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { cn, IDR } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, ChevronLeft, Printer } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");

  const { data: order } = useQuery({
    queryKey: ["order", order_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          customer_name,
          status,
          payment_token,
          tables(id, name),
          transactions (
            payment_method,
            subtotal,
            total_payment,
            tax,
            service,
            discount,
            cash,
            cash_back
          )
        `)
        .eq("order_id", order_id)
        .single();

      if (error) {
        toast.error("Failed to fetch order", { description: error.message });
        throw error;
      }
      return data;
    },
    enabled: !!order_id,
  });

  // ✅ Mutation update status
const { mutate } = useMutation({
  mutationKey: ["mutateUpdateStatusOrder"],
  mutationFn: async (id: string) => {
    // 1️⃣ Update order jadi settled
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .update({ status: "settled" })
      .eq("order_id", id)
      .select("tables(id)")
      .single();

    if (orderError) throw orderError;

    // 2️⃣ Update table jadi available
    if (order?.tables?.id) {
      const { error: tableError } = await supabase
        .from("tables")
        .update({ status: "available" })
        .eq("id", orderData.tables?.id);

      if (tableError) throw tableError;
    }
  },
  onSuccess: () => {
    toast.success("Payment Success");
  },
  onError: (error: Error) => {
    toast.error("Failed to update order/table", { description: error.message });
  },
});


  // ✅ Auto update status ketika order sukses di-fetch
  useEffect(() => {
    if (order?.status !== "settled" && order_id) {
      mutate(order_id);
    }
  }, [order, order_id, mutate]);

  // ✅ Ambil transaksi pertama (karena 1 order biasanya 1 transaksi)
  const transaction = order?.transactions?.[0];

  return (
    <div>
      <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg bg-muted print:shadow-none print:border-none print:bg-transparent">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex flex-col justify-center items-center">
            <CheckCircle className="text-teal-500 size-12 print:text-black" />
            <h2 className="text-2xl">Payment Success</h2>
          </CardTitle>

          <Separator />
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Order ID:</p>
              <p className="text-sm font-medium">Customer:</p>
              <p className="text-sm font-medium">Table:</p>
              <p className="text-sm font-medium">Payment Method:</p>
            </div>
            <div className="space-y-1 text-end">
              <p className="text-sm text-muted-foreground">{order_id}</p>
              <p className="text-sm font-medium">{order?.customer_name}</p>
              <p className="text-sm font-medium">{(order?.tables as unknown as { name: string })?.name}</p>
              <p
                className={cn(
                  `text-sm font-medium ${
                    transaction?.payment_method === "cash" ? "text-info" : "text-success"
                  }`
                )}
              >
                {transaction?.payment_method?.toUpperCase()}
              </p>
            </div>
          </div>
          <Separator />
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm font-bold">
              {IDR(transaction?.subtotal ?? 0)}
            </span>
          </div>
          {transaction?.payment_method === "cash" && (
            <>
              <div className="flex justify-between">
                <span className="text-sm">Cash</span>
                <span className="text-sm font-bold">{IDR(transaction?.cash ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Change</span>
                <span className="text-sm font-bold">{IDR(transaction?.cash_back ?? 0)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-sm">Tax (11%)</span>
            <span className="text-sm font-bold">{IDR(transaction?.tax ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Service (5%)</span>
            <span className="text-sm font-bold">{IDR(transaction?.service ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Discount</span>
            <span className="text-sm font-bold">- {IDR(transaction?.discount ?? 0)}</span>
          </div>
          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{IDR(transaction?.total_payment ?? 0)}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-3 print:hidden">
          <Link href={`/dashboard/orders`} className="w-1/2">
            <Button variant="outline" className="cursor-pointer w-full">
              <ChevronLeft className="mr-1 size-4" /> Back
            </Button>
          </Link>
          <Button variant="destructive" className="cursor-pointer w-1/2">
            Print <Printer className="ml-1 size-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
