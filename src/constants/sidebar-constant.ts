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
            url: "/orders",
            icon: Album,
        },
        {
            title: "Menus",
            url: "/dashboard/menu",
            icon: SquareMenu,
        },
        {
            title: "Tables",
            url: "/dashboard/table",
            icon: Armchair,
        },
        {
            title: "Users",
            url: "/dashboard/users",
            icon: Users,
        }
    ],

    chasier: [],
    kitchen:[],
};

export type SidebarMenuKey= keyof typeof SIDEBAR_MENU_LIST