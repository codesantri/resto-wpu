"use client";

import { Button } from "@/components/ui/button";
import useDataTable from "@/hooks/use-datatable";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import OrderCart from "./cart";
import { Input } from "@/components/ui/input";
import CardMenu from "./card-menu";
import LoadingCardMenu from "./loading-card-menu";
import { useState } from "react";
import { Cart } from "@/types/order-cart";
import { Menu } from "@/validations/menu-validation";

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
        .select("id, customer_name, status, payment_url, tables(name, id)")
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

  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      <div className="flex items-center justify-between w-full gap-4 mb-4">
        <h1 className="text-2xl font-bold">Menu Lists</h1>
        <Input
        className="lg:w-2/3"
              placeholder="Search a menu..."
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="space-y-4 lg:w-2/3">
          {/* Filter & Search */}
          <div className="flex flex-col lg:flex-row items-center gap-4 w-full justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button
                className="cursor-pointer"
                onClick={() => handleChangeFilter("")}
                variant={currentFilter === "" ? "default" : "outline"}
              >
                All
              </Button>
              {!isLoadingCategory &&
                categories.map((category) => (
                  <Button
                    className="cursor-pointer"
                    key={category.id}
                    onClick={() => handleChangeFilter(category.id)}
                    variant={currentFilter === category.id ? "default" : "outline"}
                  >
                    {category.name}
                  </Button>
                ))}
            </div>
            
          </div>

          {/* Menus Grid */}
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
          <OrderCart order={order} carts={carts} setCarts={setCarts} onAddToCart={handleAddToCart} />
        </div>
      </div>
    </div>
  );
}
