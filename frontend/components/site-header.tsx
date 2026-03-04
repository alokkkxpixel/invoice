import { Search, Bell, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-4 px-4 lg:gap-6 lg:px-10">
        <SidebarTrigger className="-ml-1 h-9 w-9" />
        <Separator
          orientation="vertical"
          className="mx-0 data-[orientation=vertical]:h-4 bg-slate-200"
        />
        
        {/* Header Search - inspired by first screenshot */}
        <div className="relative hidden md:flex items-center w-full max-w-xs">
           <Search className="absolute left-3 h-4 w-4 text-slate-400" />
           <Input 
             placeholder="Search" 
             className="h-10 pl-10 rounded-2xl bg-slate-50/50 border-none focus-visible:ring-1 focus-visible:ring-slate-200"
           />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl border-slate-200 relative group">
            <Bell className="h-5 w-5 text-slate-600 transition-colors group-hover:text-slate-900" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
          </Button>
          <Button className="h-10 px-5 rounded-2xl bg-[#2D3328] text-white hover:bg-[#1e231b] gap-2 font-semibold">
            <Gift className="h-4 w-4 text-[#98E165]" />
            Earn $90
          </Button>
        </div>
      </div>
    </header>
  )
}
