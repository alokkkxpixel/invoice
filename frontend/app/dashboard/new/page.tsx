import { AppSidebar } from "@/components/app-sidebar"
import { InvoiceCreation } from "@/components/invoice-creation"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-slate-50">
        <SiteHeader />
        <div className="flex flex-1 flex-col ">
             <InvoiceCreation />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
