"use client";

import useDataTable from "@/hooks/use-datatable";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import OrderCart from "./cart";
import { Input } from "@/components/ui/input";
import CardMenu from "./card-menu";
import LoadingCardMenu from "./loading-card-menu";
import { Cart } from "@/types/order-cart";
import { Menu } from "@/validations/menu-validation";
import { Separator } from "@radix-ui/react-dropdown-menu";
import CategoryFilter from "./category-filter";
import { startTransition, useActionState, useState } from "react";
import { IS_ACTION } from "@/constants/global-constant";
import { orderAddMenu } from "@/controllers/order-controller";

export default function OrderAdd({ id }: { id: string }) {
  const supabase = createClient();
  const {
    currentSearch,
    currentFilter,
    handleChangeSearch,
    handleChangeFilter,
  } = useDataTable();

  // Query categories
  const { data: categories = [], isLoading: isLoadingCategory } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Get categories failed", { description: error.message });
        return [];
      }
      return data;
    },
  });

  // Query menus
  const { data: menus = [], isLoading: isLoadingMenu } = useQuery({
    queryKey: ["menus", currentSearch, currentFilter],
    queryFn: async () => {
      let query = supabase
        .from("menus")
        .select("*", { count: "exact" })
        .eq("is_available", true)
        .order("created_at", { ascending: true });

      if (currentSearch) {
        query = query.ilike("name", `%${currentSearch}%`);
      }
      if (currentFilter) {
        query = query.eq("category_id", currentFilter);
      }

      const { data, error } = await query;
      if (error) {
        toast.error("Get menus failed", { description: error.message });
        return [];
      }
      return data;
    },
  });

  // Query order
  const {data:order, isLoading:isLoadingOrder}=useQuery({
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

  const [carts, setCarts] = useState<Cart[]>([]);
  

  const handleAddToCart = (menu: Menu, action: 'inc' | 'dec') => {
    const existingItem = carts.find((item) => item.menu_id === menu.id);
    if (existingItem) {
      if (action==='dec') {
        if (existingItem.quantity>1) {
          setCarts(carts.map((item)=>item.menu_id===menu.id ? {...item, quantity:item.quantity - 1, total:item.total - menu.price}:item))
        } else {
          setCarts(carts.filter((item) => item.menu_id !== menu.id))
        }
      } else {
          setCarts(carts.map((item)=>item.menu_id===menu.id ? {...item, quantity:item.quantity + 1, total:item.total + menu.price}:item))
      }
    } else {
      setCarts([...carts, {menu_id:menu.id, quantity:1, total:menu.price, notes:'', menu}])
    }
  }

  const handleRemoveItemCart = (id: string) => {
    setCarts((prevCarts) => prevCarts.filter((item) => item.menu_id !== id));
  };

   const [orderAddState, addOrderAction, isAddOrderPending] = useActionState(orderAddMenu, IS_ACTION);
  
    const handleAddOrder = async () => {
      const data = {
        order_id: id,
        items: carts.map((item) => ({
          order_id:order?.id ??'',
          ...item,
          status: "pending",
        })),
      };

      startTransition(() => {
        addOrderAction(data);
      });
    };


  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      <div className="flex items-center justify-between w-full gap-4 mb-4">
        <h1 className="text-2xl font-bold">Menu Lists</h1>
        {/* <Input
        className="lg:w-2/3"
              placeholder="Search a menu..."
              onChange={(e) => handleChangeSearch(e.target.value)}
            /> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full lg:justify-between">
        <div className="space-y-4 lg:w-2/3">
          {/* Filter */}
         <div className="flex flex-col lg:flex-row items-center gap-4 w-full justify-between">
          {/* Filter Categories */}
            <CategoryFilter
              categories={categories}
              currentFilter={currentFilter}
              onChangeFilter={handleChangeFilter}
            />
          <Input
            className="lg:w-1/3"
            placeholder="Search a menu..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
        </div>



          {/* Menus Grid */}
          <Separator className="w-full my-5 bg-muted"/>
          <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-4">
            {isLoadingMenu ? (
              <LoadingCardMenu />
            ) : menus.length > 0 ? (
              menus.map((menu) => <CardMenu key={menu.id} menu={menu} onAddToCart={handleAddToCart} />)
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No menus found
              </p>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:w-1/3">
          <OrderCart
            order={order}
            carts={carts}
            setCarts={setCarts}
            onAddToCart={handleAddToCart}
            removeItemCart={handleRemoveItemCart}
            isLoading={isAddOrderPending}
            onAddOrder={handleAddOrder}
          />
        </div>
      </div>
    </div>
  );
}
