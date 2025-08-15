'use client';
import AppSidebar from "@/components/common/app-sidebar";
import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import DashboardBreadcrumb from "./_components/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AvatarName from "@/components/common/avatar-name";
import { EllipsisVertical, LogOut } from "lucide-react";
import { signOut } from "@/controllers/auth-controller";
import { useAuthStore } from "@/stores/auth-store";


export default function DashboardLayout({ children }: { children: ReactNode }) {
        // const pathname = usePathname();
        const profile = useAuthStore((state)=>state.profile)
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden">
                <header className="flex justify-between fixed top-0 right-0 left-0 bg-muted shadow h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collabsible=icon]/sidebar-wrapper:h-12">
                    <div className="gap-4 mx-10 flex ml-auto items-center">
                        <DarkModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                                    <AvatarName role={profile.role} name={profile.name} url={profile.avatar_url} />
                                    <EllipsisVertical className="ml-auto size-4"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="min-w-56 rounded-lg"  align="end" sideOffset={4}>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <AvatarName role={profile.role} name={profile.name} url={profile.avatar_url} />
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="cursor-pointer" onClick={()=>signOut()}>
                                        <LogOut />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="flex flex-1 flex-col items-start gap-4 p-4 pt-20">
                    <div className="flex items-center gap-6 px-4">
                        <SidebarTrigger className="ml-5 cursor-pointer bg-accent" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <DashboardBreadcrumb/>
                    </div>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}