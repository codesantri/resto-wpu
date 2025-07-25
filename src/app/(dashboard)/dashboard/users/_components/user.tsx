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
import { useMemo } from "react";
import { toast } from "sonner";
import CreateUser from "./create-user";
import Image from "next/image";
import AvatarName from "@/components/common/avatar-name";

export default function UserManagement() {
    const supabase = createClient();
    const { currentPage, currentLimit, currentSearch, handleChangePage, handleChangeLimit, handleChangeSearch } = useDataTable();
    const {data:users, isLoading, }= useQuery({
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
    

    const filterData = useMemo(() => {
        return (users?.data || []).map((user, index) => {
            // const nameAvatar = (
            // <div className="flex items-center gap-2">
            //         <Image src={user.avatar_url} alt={user.name} width={50} height={50}
            //             className="w-10 h-10 rounded-full object-cover border"
            //     />
            //     <span>{user.name}</span>
            // </div>
            // );
            return [
                index + 1,
                <AvatarName role="" url={user.avatar_url} name={user.name} />,
                user.role,
               <DropdownAction
                    menu={[
                        {
                            label: (
                                <span className="flex items-center gap-2">
                                <SquarePen />
                                Edit
                                </span>
                            ),
                            action: () => alert("Edit clicked"),
                            type: "button",
                        },
                       {
                             label: (
                                <span className="flex items-center gap-2">
                                <Trash className="text-red-600" />
                                Delete
                                </span>
                            ),
                            action: () => confirm("Are you sure?"),
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
    },[users])

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
                        <CreateUser/>
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
        </div>
    )
}