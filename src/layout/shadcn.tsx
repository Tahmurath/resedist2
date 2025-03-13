import {SidebarInput, SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {Outlet} from "react-router";
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import {Navigate, NavLink, useNavigate, useLocation} from "react-router";
import {getAuthToken, getUser, setAuthToken} from "@/services/authService.ts";
import { useTranslation } from "react-i18next";
import UserMenu from "@/components/UserMenu.tsx";
import {useState} from "react";


const Navlayout = () =>{

    const location = useLocation();

    const navigate = useNavigate();

    const token = getAuthToken()
    if (!token) {
        return <Navigate to="/login" />;
    }

    const { t } = useTranslation();

    const [sidebarOpen, setSidebarOpen] = useState(true)

    const handleNavLinkClick = () => {
        setSidebarOpen(false);
    };

    return (

        // <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SidebarProvider >
        <AppSidebar  />
        <SidebarInset>


        <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background gap-2 h-16">
        <div className="flex h-[--header-height] w-full items-center gap-2 px-4">

            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>


            <form className="w-full sm:ml-auto sm:w-auto" >

                <div className="relative">
                    <Label htmlFor="search" className="sr-only">
                    Search
                    </Label>
                    <SidebarInput
                    id="search"
                    placeholder="Type to search..."
                    className="h-8 pl-7"
                    />
                    <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                </div>
            </form>
            <div className="relative">
                <div className="">
                <UserMenu />
                </div>
                </div>
            </div>

        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
                <Outlet />
            </div>
        </SidebarInset>
    </SidebarProvider>
      )
}


export default Navlayout
