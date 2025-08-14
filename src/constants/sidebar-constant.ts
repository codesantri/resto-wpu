import { Album, Armchair, LayoutDashboard, SquareMenu, Users } from "lucide-react"

export const SIDEBAR_MENU_LIST = {
    admin: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Orders",
            url: "/dashboard/orders",
            icon: Album,
        },
        {
            title: "Menus",
            url: "/dashboard/admin/menus",
            icon: SquareMenu,
        },
        {
            title: "Tables",
            url: "/dashboard/admin/tables",
            icon: Armchair,
        },
        {
            title: "Users",
            url: "/dashboard/admin/users",
            icon: Users,
        }
    ],

    chasier: [],
    kitchen:[],
};

export type SidebarMenuKey= keyof typeof SIDEBAR_MENU_LIST