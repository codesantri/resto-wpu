'use client';

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SquarePen, Trash } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import DataTable from "@/components/common/datatable";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-datatable";
import { createClient } from "@/lib/supabase/client";
import { Table } from "@/validations/table-validation";
import CreateMenu from "./create";
import UpdateMenu from "./update";
import DeleteMenu from "./delete";
import { TABLE_HEADER_TABLE } from "@/tables/header-table";

export default function TableManagement() {
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
    data: Table;
    type: "update" | "delete";
  } | null>(null);

  const { 
    data: tables, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["tables", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      let query = supabase
        .from("tables")
        .select("*", { count: "exact" })
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1
        )
        .order("created_at", { ascending: true });

      if (currentSearch) {
        query = query.or(
          `name.ilike.%${currentSearch}%,status.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        toast.error("Failed to fetch tables", { 
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
    return tables?.data?.map((item: Table, index) => [
      currentLimit * (currentPage - 1) + index + 1,
      item.name,
      item.description,
      item.capacity,
      <span
        key={`status-${item.id}`}
        className={cn(
          "px-2 py-1 rounded-full text-white w-fit capitalize",
          {
            "bg-success": item.status === "available",
            "bg-danger": item.status === "unavailable",
            "bg-warning": item.status === "reserved"
          }
        )}
      >
        {item.status}
      </span>,
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
  }, [tables, currentLimit, currentPage]);

  const totalPages = useMemo(() => {
    return tables?.count ? Math.ceil(tables.count / currentLimit) : 0;
  }, [tables?.count, currentLimit]);

  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      <div className="flex flex-col mb-4 gap-4 justify-between w-full lg:flex-row">
        <h1 className="text-2xl font-bold">Table Management</h1>
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
                + Create Table
              </Button>
            </DialogTrigger>
            <CreateMenu refetch={refetch} />
          </Dialog>
        </div>
      </div>

      <DataTable
        isLoading={isLoading}
        header={TABLE_HEADER_TABLE}
        data={filterData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />

      {selectedAction?.type === 'update' && (
        <UpdateMenu
          open={true}
          handleChangeAction={handleChangeAction}
          refetch={refetch}
          currentData={selectedAction.data}
        />
      )}

      {selectedAction?.type === 'delete' && (
        <DeleteMenu
          open={true}
          handleAction={handleChangeAction}
          refetch={refetch}
          currentData={selectedAction.data}
        />
      )}
    </div>
  );
}