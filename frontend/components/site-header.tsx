"use client"
import { Search, Bell, Gift, PowerOffIcon, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/UserContext"

export function SiteHeader() {

  const { user } = useAuth()
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-4 px-4 lg:gap-6 lg:px-10">
        <SidebarTrigger className="-ml-1 h-9 w-9" />
        <Separator
          orientation="vertical"
          className="mx-0 data-[orientation=vertical]:h-4 bg-slate-200"
        />
        
      
        <div className="ml-auto flex items-center gap-3">
          { user && 
           

            <Button className="h-10 px-5 rounded-2xl bg-[#2D3328] text-white hover:bg-[#1e231b] gap-2 font-semibold">
              <UserRound /> 
              <h2>{user.username}</h2>
                      
          </Button>
          }
        </div>
      </div>
    </header>
  )
}
