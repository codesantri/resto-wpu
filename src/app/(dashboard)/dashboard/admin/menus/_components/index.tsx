'use client';

import DataTable from "@/components/common/datatable";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-datatable";
import { createClient } from "@/lib/supabase/client";
import { SquarePen, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { cn, IDR } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { useQuery } from "@tanstack/react-query";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import CreateMenu from "./create";
import UpdateMenu from "./update";
import DeleteMenu from "./delete";
import { TABLE_HEADER_MENU } from "@/tables/header-table";

export default function MenuManagement() {
  const supabase = createClient();
  const {currentPage,currentLimit,currentSearch,handleChangePage,handleChangeLimit,handleChangeSearch} = useDataTable();

  const { data: menus, isLoading, refetch } = useQuery({
    queryKey: ["menus", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      let query = supabase
        .from("menus")
        .select("*, categories(name, id)", { count: "exact" })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1
        );


      if (currentSearch) {
        query = query.or(
          `name.ilike.%${currentSearch}%,category.ilike.%${currentSearch}%`
        );
      }

      const result = await query;

      if (result.error) {
        toast.error("Get data failed", { description: result.error.message });
      }

      return result;
    }
  });

  // State untuk Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  // Ambil data gambar
  const images = (menus?.data || []).map((menu: Menu) => ({
    src: menu.image_url as string,
    title: menu.name
  }));

  const [selectedAction, setSelectedAction] = useState<{
    data: Menu;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filterData = useMemo(() => {
    return (menus?.data || []).map((menu, index) => [
      currentLimit * (currentPage - 1) + index + 1,
      <div
        className="flex items-center gap-2 cursor-pointer"
        key={`image-${menu.id}`}
        onClick={() => setLightboxIndex(index)}
      >
        <Image
          src={menu.image_url as string || ""}
          alt={menu.name || "Menu image"}
          width={60}
          height={60}
          className="rounded object-cover"
          style={{ height: 'auto', width: 'auto' }}
        />

        {menu.name}
      </div>,
      (menu.categories as unknown as {name:string}).name,
      IDR(menu.price),
      `${menu.discount}%`,
      <span
        className={cn(
          "px-2 py-1 rounded-full text-white w-fit",
          menu.is_available ? "bg-success" : "bg-danger"
        )}
      >
        {menu.is_available ? "Available" : "Unavailable"}
      </span>,
      <DropdownAction
        menu={[
          {
            label: (
              <span className="flex items-center gap-2">
                <SquarePen />
                Edit
              </span>
            ),
            action: () =>
              setSelectedAction({ data: menu, type: "update" }),
            type: "button"
          },
          {
            label: (
              <span className="flex items-center gap-2">
                <Trash className="text-danger" />
                Delete
              </span>
            ),
            action: () =>
              setSelectedAction({ data: menu, type: "delete" }),
            variant: "destructive",
            type: "button"
          }
        ]}
      />
    ]);
  }, [menus, currentLimit, currentPage]);

  const totalPages = useMemo(() => {
    return menus?.count
      ? Math.ceil(menus.count / currentLimit)
      : 0;
  }, [menus, currentLimit]);

  return (
    <div className="w-full px-13">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <div className="flex gap-2">
          <Input
            onChange={(e) => handleChangeSearch(e.target.value)}
            placeholder="Search...."
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">+Create</Button>
            </DialogTrigger>
            <CreateMenu refetch={refetch} />
          </Dialog>
        </div>
      </div>

      <DataTable
        isLoading={isLoading}
        header={TABLE_HEADER_MENU}
        data={filterData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />

      <UpdateMenu
        open={selectedAction !== null && selectedAction.type === 'update'}
        handleChangeAction={handleChangeAction}
        refetch={refetch}
        currentData={selectedAction?.data}
      />

      <DeleteMenu
        open={selectedAction !== null && selectedAction.type === 'delete'}
        handleAction={handleChangeAction}
        refetch={refetch}
        currentData={selectedAction?.data}
      />

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <Lightbox
          mainSrc={images[lightboxIndex].src}
          imageTitle={images[lightboxIndex].title}
          nextSrc={images[(lightboxIndex + 1) % images.length]?.src}
          prevSrc={images[(lightboxIndex + images.length - 1) % images.length]?.src}
          onCloseRequest={() => setLightboxIndex(-1)}
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % images.length)
          }
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + images.length - 1) % images.length
            )
          }
        />
      )}
    </div>
  );
}
