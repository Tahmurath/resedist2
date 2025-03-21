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
import {Toaster} from "@/components/ui/toaster.tsx";
import Isloggedin from "@/components/Isloggedin";


const Navlayout = () =>{

    const location = useLocation();

    const navigate = useNavigate();

    const token = getAuthToken()
    if (!token) {
        return <Navigate to="/login" />;
    }

    const { t } = useTranslation();
    const pathnames = location.pathname.split('/').filter((x) => x);
  
    

    const handleSearch = (e) => {
      e.preventDefault();
      const query = e.target.search.value;
      alert(query)
  };
  

    return (

        
        <Isloggedin>
        <SidebarProvider >
        <AppSidebar  />
        <SidebarInset>


        <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background gap-2 h-16">
        <div className="flex h-[--header-height] w-full items-center gap-2 px-4">

            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="hidden sm:block">
  <BreadcrumbList>
    {pathnames.map((value, index) => {
      const last = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;

      return (
        <BreadcrumbItem key={to}>
          {last ? (
            <BreadcrumbPage>{value}</BreadcrumbPage>
            // <BreadcrumbPage>{t(`site.${value}`)}</BreadcrumbPage>
          ) : (
            <>
              <BreadcrumbLink asChild>
                <NavLink to={to}>{value}</NavLink>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </>
          )}
        </BreadcrumbItem>
      );
    })}
  </BreadcrumbList>
</Breadcrumb>


            <form onSubmit={handleSearch} className="w-full sm:ml-auto sm:w-auto" >

                <div className="relative">
                    <Label htmlFor="search" className="sr-only">
                    Search
                    </Label>
                    <SidebarInput
                        id="search"
                        placeholder={t("site.typetosearch")}
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
            <Toaster />
            </div>
        </SidebarInset>
    </SidebarProvider>
    </Isloggedin>
      )
}


export default Navlayout
