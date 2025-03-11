import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {Outlet} from "react-router";



const Navlayout = () =>{

    return (
        <SidebarProvider>
          <AppSidebar />
          <main className="relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow">
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <SidebarTrigger />
            <Outlet />
            </div>
          </main>
        </SidebarProvider>
      )
}


export default Navlayout
