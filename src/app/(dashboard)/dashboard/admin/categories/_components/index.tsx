'use client';

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SquarePen, Trash } from "lucide-react";
import { toast } from "sonner";

import DataTable from "@/components/common/datatable";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-datatable";
import { createClient } from "@/lib/supabase/client";
import CreateCategory from "./create";
import DeleteCategory from "./delete";
import UpdateCategory from "./update";
import { Category } from "@/validations/category-validation";
import { TABLE_HEADER_CATEGORY } from "@/tables/header-table";

export default function CategoryManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch
  } = useDataTable();

  const [selectedAction, setSelectedAction] = useState<{
    data: Category;
    type: "update" | "delete";
  } | null>(null);

  const { 
    data: categories, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["categories", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      let query = supabase
        .from("categories")
        .select("*", { count: "exact" })
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1
        )
        .order("created_at", { ascending: true });

      if (currentSearch) {
        query = query.or(
          `name.ilike.%${currentSearch}%`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        toast.error("Failed to fetch categories", { 
          description: error.message 
        });
        throw error;
      }

      return { data, count };
    }
  });

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filterData = useMemo(() => {
    return categories?.data?.map((item: Category, index) => [
      currentLimit * (currentPage - 1) + index + 1,
      item.name,
      <DropdownAction
        key={`action-${item.id}`}
        menu={[
          {
            label: (
              <span className="flex items-center gap-2">
                <SquarePen size={16} />
                Edit
              </span>
            ),
            action: () => setSelectedAction({ data: item, type: "update" }),
            type: "button"
          },
          {
            label: (
              <span className="flex items-center gap-2 text-red-600">
                <Trash size={16} />
                Delete
              </span>
            ),
            action: () => setSelectedAction({ data: item, type: "delete" }),
            variant: "destructive",
            type: "button"
          }
        ]}
      />
    ]) || [];
  }, [categories, currentLimit, currentPage]);

  const totalPages = useMemo(() => {
    return categories?.count ? Math.ceil(categories.count / currentLimit) : 0;
  }, [categories?.count, currentLimit]);

  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      <div className="flex flex-col mb-4 gap-4 justify-between w-full lg:flex-row">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={currentSearch}
            onChange={(e) => handleChangeSearch(e.target.value)}
            placeholder="Search..."
            className="w-full sm:w-64"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="whitespace-nowrap">
                + Create Category
              </Button>
            </DialogTrigger>
            <CreateCategory refetch={refetch} />
          </Dialog>
        </div>
      </div>

      <DataTable
        isLoading={isLoading}
        header={TABLE_HEADER_CATEGORY}
        data={filterData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />

      {selectedAction?.type === 'update' && (
        <UpdateCategory
          open={true}
          handleChangeAction={handleChangeAction}
          refetch={refetch}
          currentData={selectedAction.data}
        />
      )}

      {selectedAction?.type === 'delete' && (
        <DeleteCategory
          open={true}
          handleAction={handleChangeAction}
          refetch={refetch}
          currentData={selectedAction.data}
        />
      )}
    </div>
  );
}