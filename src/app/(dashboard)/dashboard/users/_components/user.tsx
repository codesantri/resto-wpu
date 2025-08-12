'use client';

import DataTable from "@/components/common/datatable";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TABLE_HEADER_USER } from "@/constants/datatabel-constant";
import useDataTable from "@/hooks/use-datatable";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SquarePen, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CreateUser from "./create-user";
import Image from "next/image";
import AvatarName from "@/components/common/avatar-name";
import { capitalize } from "@/lib/utils";
import { Profile } from "@/types/auth";
import UpdateUser from "./update-user";
import DeleteUser from "./delete-user";

export default function UserManagement() {
    const supabase = createClient();
    const { currentPage, currentLimit, currentSearch, handleChangePage, handleChangeLimit, handleChangeSearch } = useDataTable();
    const {data:users, isLoading, refetch }= useQuery({
        queryKey: ['users', currentPage, currentLimit, currentSearch],
        queryFn: async () => {
            const result = await supabase
                .from('profiles')
                .select('*', { count: 'exact' })
                .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
                .order('created_at')
                .ilike('name', `%${currentSearch}%`);
            if (result.error) toast.error('Get data failed', {
                description: result.error.message
            });

            return result;
        },
    });
    
    const [selectedAction, setSelectedAction] = useState<{
        data: Profile,
        type: 'update' | 'delete'
    } | null>(null);

    const handleChangeAction = (open: boolean) => {
        if (!open) setSelectedAction(null);
    }
    

    // user-management.tsx (only key changes)
    const filterData = useMemo(() => {
    return (users?.data || []).map((user, index) => {
        return [
        currentLimit * (currentPage-1) + index + 1,
        <AvatarName role="" url={user.avatar_url} name={user.name} />,
        capitalize(user.role),
        <DropdownAction
            menu={[
            {
                label: (
                <span className="flex items-center gap-2">
                    <SquarePen />
                    Edit
                </span>
                ),
                action: () => setSelectedAction({
                data: user,
                type: 'update'
                }),
                type: "button",
            },
            {
                label: (
                <span className="flex items-center gap-2">
                    <Trash className="text-red-600" />
                    Delete
                </span>
                ),
               action: () => setSelectedAction({
                data: user,
                type: 'delete'
                }),
                variant: "destructive",
                type: "button",
            },
            ]}
        />
        ]
    })
    }, [users]);

    const totalPages = useMemo(() => {
        return users && users.count !== null ? Math.ceil(users.count / currentLimit) : 0;
    }, [users])
    


    return (
        <div className="w-full px-13">
            <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="flex gap-2">
                    <Input onChange={(e)=>handleChangeSearch(e.target.value)} placeholder="Search...." />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default">+Create</Button>
                        </DialogTrigger>
                        <CreateUser refetch={refetch} />
                    </Dialog>
                </div>
            </div>
            <DataTable
                isLoading={isLoading}
                header={TABLE_HEADER_USER}
                data={filterData}
                totalPages={totalPages}
                currentPage={currentPage}
                currentLimit={currentLimit}
                onChangePage={handleChangePage}
                onChangeLimit={handleChangeLimit}
            />
            <UpdateUser
                open={selectedAction !== null && selectedAction.type === 'update'}
                handleChangeAction={handleChangeAction}
                refetch={refetch}
                currentData={selectedAction?.data}
            />
            <DeleteUser
                open={selectedAction !== null && selectedAction.type === 'delete'}
                handleAction={handleChangeAction}
                refetch={refetch}
                currentData={selectedAction?.data}
            />
        </div>
    )
}