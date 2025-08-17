"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import Summary from "./summary";
import { cn, IDR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useDataTable from "@/hooks/use-datatable";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import DataTable from "@/components/common/datatable";
import { IS_ACTION } from "@/constants/global-constant";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { TABLE_HEADER_ORDER_DETAIL } from "@/tables/header-table";
import { orderUpdateStatusItem } from "@/controllers/order-controller";
import { startTransition, useActionState, useEffect, useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

export default function OrderDetail({ id }: { id: string }) {
  const supabase = createClient();
  const { currentPage, currentLimit, handleChangePage, handleChangeLimit } = useDataTable();

  // Track item id yang lagi di-update
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await supabase
        .from("orders")
        .select("id, customer_name, status, payment_token, tables(name, id)")
        .eq("order_id", id)
        .single();

      if (result.error) {
        toast.error("Failed to fetch orders", {
          description: result.error.message,
        });
        throw result.error;
      }
      return result.data;
    },
    enabled: !!id,
  });

  const {
    data: orderMenu,
    isLoading: isLoadingOrderMenu,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ["order_menu", order?.id, currentPage, currentLimit],
    queryFn: async () => {
      const result = await supabase
        .from("order_menus")
        .select("*, menus(id,name,image_url, price, discount)", { count: "exact" })
        .eq("order_id", order?.id)
        .order("status");

      if (result.error) {
        toast.error("Failed to fetch order detail", {
          description: result.error.message,
        });
        throw result.error;
      }
      return result;
    },
    enabled: !!order?.id,
  });

  const [updateStatusOrderState, updateStatusOrderAction, isLoadingUpdateStatus] =
    useActionState(orderUpdateStatusItem, IS_ACTION);

  const handleUpdateStatusOrder = (data: { id: string; status: string }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    setLoadingItemId(data.id); // 🚀 mark item lagi di-update

    startTransition(() => {
      updateStatusOrderAction(formData);
    });
  };

  useEffect(() => {
    if (updateStatusOrderState?.status === "error") {
      toast.error("Update status failed", {
        description: updateStatusOrderState.errors?._form?.[0],
      });
      setLoadingItemId(null);
    }
    if (updateStatusOrderState?.status === "success") {
      toast.success("Update status success");
      refetchStatus();
      setLoadingItemId(null);
    }
  }, [updateStatusOrderState, refetchStatus]);

  const filterData = useMemo(() => {
    return (
      orderMenu?.data?.map((item, index) => [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2">
          <Image
            src={item.menus.image_url}
            alt={item.menus.name}
            width={50}
            height={50}
            className="rounded"
          />
          <div className="flex flex-col">
            {item.menus.name} x{" "}
            <span className="text-muted-foreground">{IDR(item.menus.price)}</span>
            <span className="text-xs text-muted-foreground">{item.notes || ""}</span>
          </div>
        </div>,
        item.quantity,
        IDR(item.menus.price * item.quantity),
        <span
          key={`status-${item.id}`}
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit capitalize flex items-center gap-2",
            {
              "bg-success": item.status === "served",
              "bg-info": item.status === "process",
              "bg-warning": item.status === "pending",
              "bg-gray": item.status === "ready",
            }
          )}
        >
          {loadingItemId === item.id && isLoadingUpdateStatus ? (
                <Loader2 className="animate-spin w-4 h-4" />
            ) : (
                item.status
        )}
        </span>,
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                "data-[state=open]:bg-muted text-muted-foreground flex size-8",
                "cursor-pointer",
                { hidden: item.status === "served" }
              )}
              size="icon"
              variant="ghost"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {["pending", "process", "ready"].map((status, i) => {
              const nextStatus = ["process", "ready", "served"][i];
              return (
                item.status === status && (
                  <DropdownMenuItem
                    key={i}
                    className="capitalize"
                    onClick={() =>
                      handleUpdateStatusOrder({ id: item.id, status: nextStatus })
                    }
                  >
                    {nextStatus}
                  </DropdownMenuItem>
                )
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>,
      ]) || []
    );
  }, [orderMenu?.data, currentLimit, currentPage, loadingItemId, isLoadingUpdateStatus]);

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
  );
}