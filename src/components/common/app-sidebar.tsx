'use client';
import AppLogo from "./app-logo";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "../ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "../ui/sidebar";
import {
    EllipsisVertical,
    LogOut,
    Slack
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import AvatarName from "./avatar-name";
import { signOut } from "@/controllers/auth-controller";
import Link from "next/link";
import { ROUTES, RoutesKey } from "@/routes";

export default function AppSidebar() {
    const { isMobile } = useSidebar();
    const pathname = usePathname();
    const profile = useAuthStore((state)=>state.profile)
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu className="w-full">
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center gap-2 self-center font-medium">
                                <div className="bg-teal-500 flex p-2 items-center justify-center rounded-md">
                                    <Slack className="size-4" />
                                </div>
                                <span className="text-2xl font-semibold">RESTOKU</span>
                            </div>
                            
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {/* <SidebarMenu >
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <AvatarName role={profile.role} name={profile.name} url={profile.avatar_url} />
                                    <EllipsisVertical className="ml-auto size-4"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <AvatarName role={profile.role} name={profile.name} url={profile.avatar_url} />
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={()=>signOut()}>
                                        <LogOut />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu> */}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            {ROUTES[profile.role as RoutesKey]?.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}
                                            className={cn('px-4 py-3 h-auto', {
                                                'bg-teal-500 text-white hover:bg-teal-500 hover:text-white':pathname===item.url
                                            })}
                                        > 
                                            {item.title && <item.icon className="h-50 size-20 text-2xl" />}
                                            <span className="font-bold tracking-wide [letter-spacing:0.05em]">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                
            </SidebarFooter>
        </Sidebar>
    )
}