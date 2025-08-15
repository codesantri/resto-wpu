"use client";

import DataTable from "@/components/common/datatable";
import { Button } from "@/components/ui/button";
import useDataTable from "@/hooks/use-datatable";
import { createClient } from "@/lib/supabase/client";
import { cn, IDR } from "@/lib/utils";
import { TABLE_HEADER_ORDER_DETAIL } from "@/tables/header-table";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import Summary from "./summary";

export default function OrderDetail({ id }: { id: string; }) {
    const supabase = createClient();
    const {currentPage,currentLimit,handleChangePage,handleChangeLimit} = useDataTable();

    const { data: order } = useQuery({
        queryKey: ["order", id],
        queryFn: async () => {
            const result = await supabase
                .from("orders")
                .select('id, customer_name, status, payment_url, tables(name, id)')
                .eq('order_id', id)
                .single();
            
            if (result.error) {
                toast.error("Failed to fetch orders", {
                    description: result.error.message,
                });
                throw result.error;
            }

            return result.data;
        },
        enabled:!!id,
    });

    const { data: orderMenu, isLoading:isLoadingOrderMenu } = useQuery({
        queryKey: ["order_menu", order?.id, currentPage, currentLimit],
        queryFn: async () => {
            const result = await supabase
                .from("order_menus")
                .select('*, menus(id,name,image_url, price, discount)', { count: "exact" })
                .eq('order_id', order?.id)
                .order('status');
            
            if (result.error) {
                toast.error("Failed to fetch order detail", {
                    description: result.error.message,
                });
                throw result.error;
            }

            return result;
        },
        enabled:!!order?.id,
    });

    const filterData = useMemo(() => {
        return (
            orderMenu?.data?.map((item, index) => [
                currentLimit * (currentPage - 1) + index + 1,
                <div className="flex items-center gap-2">
                    <Image src={item.menus.image_url} alt={item.menus.name} width={50} height={50} className="rounded" />
                    <div className="flex flex-col">
                        {item.menus.name} x <span className="">{item.quantity}</span>
                        <span className="text-xs text-muted-foreground">
                            {item.notes|| ''}
                        </span>
                    </div>
                </div>,
                IDR(item.menus.price * item.quantity),
                <span
                    key={`status-${item.id}`}
                    className={cn("px-2 py-1 rounded-full text-white w-fit capitalize",
                          {
                            "bg-success": item.status === "served",
                            "bg-info": item.status === "process",
                            "bg-warning": item.status === "pending",
                            "bg-blue": item.status === "ready",
                
                          }
                        )}
                      >
                        {item.status}
                </span>,
                '',
            ]) || []
        );
    }, [orderMenu?.data, currentLimit, currentPage]);

    const totalPages = useMemo(
        () => (orderMenu?.count ? Math.ceil(orderMenu.count / currentLimit) : 0),
        [orderMenu?.count, currentLimit]
    );

    return (
        <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="flex items-center justify-between w-full gap-4 mb-4">
                <h1 className="text-2xl font-bold">Order Detail</h1>
                {id && (
                <Link href={`/dashboard/orders/${id}/add`}>
                    <Button className="cursor-pointer">Add Order Item</Button>
                </Link>
                )}

            </div>
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="lg:w-2/3">
                    <DataTable
                        isLoading={isLoadingOrderMenu}
                        header={TABLE_HEADER_ORDER_DETAIL}
                        data={filterData}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        currentLimit={currentLimit}
                        onChangePage={handleChangePage}
                        onChangeLimit={handleChangeLimit}
                    />
                </div>
                <div className="lg:w-1/3">
                    <Summary order={order} orderMenu={orderMenu?.data} id={id} />
                </div>
            </div>
        </div>
    )
}