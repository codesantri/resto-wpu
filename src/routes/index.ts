import { Album, AppWindow, Armchair, LayoutDashboard, SquareMenu, Users } from "lucide-react"

export const ROUTES = {
    admin: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: AppWindow,
            
        },
        {
            title: "Categories",
            url: "/dashboard/categories",
            icon: LayoutDashboard,
        },
        {
            title: "Menus",
            url: "/dashboard/menus",
            icon: SquareMenu,
        },
        {
            title: "Tables",
            url: "/dashboard/tables",
            icon: Armchair,
        },
        {
            title: "Orders",
            url: "/dashboard/orders",
            icon: Album,
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

export type RoutesKey = keyof typeof ROUTES;