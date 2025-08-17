"use client";

import { useState, useMemo, useEffect, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { EllipsisVertical, Loader2 } from "lucide-react";

import Summary from "./summary";
import DataTable from "@/components/common/datatable";
import { Button } from "@/components/ui/button";
import {DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent} from "@/components/ui/dropdown-menu";

import { cn, IDR } from "@/lib/utils";
import useDataTable from "@/hooks/use-datatable";
import createClientRealtime from "@/lib/supabase/realtime";
import { orderUpdateStatusItem } from "@/controllers/order-controller";
import { IS_ACTION } from "@/constants/global-constant";
import { TABLE_HEADER_ORDER_DETAIL } from "@/tables/header-table";

import { useActionState } from "react";

// ==========================
// Order Detail Page
// ==========================
export default function OrderDetail({ id }: { id: string }) {
  const supabase = createClientRealtime();
  const { currentPage, currentLimit, handleChangePage, handleChangeLimit } =
    useDataTable();

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  // ==========================
  // Query: Order
  // ==========================
  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, status, payment_token, tables(name, id)")
        .eq("order_id", id)
        .single();

      if (error) {
        toast.error("Failed to fetch orders", { description: error.message });
        throw error;
      }
      return data;
    },
    enabled: !!id,
  });

  // ==========================
  // Query: Order Menu
  // ==========================
  const {
    data: orderMenu,
    isLoading: isLoadingOrderMenu,
    refetch: refetchOrderMenu,
  } = useQuery({
    queryKey: ["order_menu", order?.id, currentPage, currentLimit],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("order_menus")
        .select("*, menus(id,name,image_url, price, discount)", { count: "exact" })
        .eq("order_id", order?.id)
        .order("status");

      if (error) {
        toast.error("Failed to fetch order detail", {
          description: error.message,
        });
        throw error;
      }
      return { data, count };
    },
    enabled: !!order?.id,
  });

  // ==========================
  // Action: Update Order Item Status
  // ==========================
  const [
    updateStatusOrderState,
    updateStatusOrderAction,
    isLoadingUpdateStatus,
  ] = useActionState(orderUpdateStatusItem, IS_ACTION);

  const handleUpdateStatusOrder = (payload: { id: string; status: string }) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) =>
      formData.append(key, value)
    );

    setLoadingItemId(payload.id);

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
      refetchOrderMenu();
      setLoadingItemId(null);
    }
  }, [updateStatusOrderState, refetchOrderMenu]);

  // ==========================
  // Transform Data for Table
  // ==========================
  const filterData = useMemo(() => {
    return (
      orderMenu?.data?.map((item, index) => [
        currentLimit * (currentPage - 1) + index + 1,

        // Menu Detail
        <div key={`menu-${item.id}`} className="flex items-center gap-2">
          <Image
            src={item.menus.image_url as string}
            alt={item.menus.name}
            width={50}
            height={50}
            className="h-[50px] w-[50px] rounded"
            priority={true}
          />
          <div className="flex flex-col">
            <span>{item.menus.name}</span>
            <span className="text-muted-foreground">{IDR(item.menus.price)}</span>
            <span className="text-xs text-muted-foreground">
              {item.notes || ""}
            </span>
          </div>
        </div>,

        item.quantity,
        IDR(item.menus.price * item.quantity),

        // Status
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

        // Action
        <DropdownMenu key={`menu-action-${item.id}`}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "data-[state=open]:bg-muted text-muted-foreground flex size-8",
                { hidden: item.status === "served" }
              )}
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
  }, [
    orderMenu?.data,
    currentLimit,
    currentPage,
    loadingItemId,
    isLoadingUpdateStatus,
  ]);

  // ==========================
  // Pagination
  // ==========================
  const totalPages = useMemo(
    () => (orderMenu?.count ? Math.ceil(orderMenu.count / currentLimit) : 0),
    [orderMenu?.count, currentLimit]
  );

  // ==========================
  // Realtime Listener
  // ==========================
  useEffect(() => {
    if (!order?.id) return;

    const channel = supabase
      .channel("change-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_menus",
          filter: `order_id=eq.${order.id}`,
        },
        () => {
          refetchOrderMenu();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id, supabase, refetchOrderMenu]);

  // ==========================
  // Render
  // ==========================
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
