"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { schema as invoiceSchema } from "@/components/data-table"
import { z } from "zod"



export default function Page() {
//   const invoices = [
//   {
//     id: "1",
//     invoiceNumber: "INV-001",
//     client: "Acme Corp",
//     created: "2024-03-01",
//     amount: "$1,200.00",
//     lastUpdated: "2 hours ago",
//     status: "Success",
//   },
//   {
//     id: "2",
//     invoiceNumber: "INV-002",
//     client: "Global Tech",
//     created: "2024-03-02",
//     amount: "$850.50",
//     lastUpdated: "5 hours ago",
//     status: "Pending",
//   },
//   {
//     id: "3",
//     invoiceNumber: "INV-003",
//     client: "Stark Ind",
//     created: "2024-03-03",
//     amount: "$3,400.00",
//     lastUpdated: "1 day ago",
//     status: "Unpaid",
//   },
//   {
//     id: "4",
//     invoiceNumber: "INV-004",
//     client: "Wayne Ent",
//     created: "2024-03-04",
//     amount: "$500.00",
//     lastUpdated: "2 days ago",
//     status: "Failed",
//   },
//   {
//     id: "5",
//     invoiceNumber: "INV-005",
//     client: "Oscorp",
//     created: "2024-03-05",
//     amount: "$2,100.00",
//     lastUpdated: "3 days ago",
//     status: "Draft",
//   },
//    {
//     id: "6",
//     invoiceNumber: "INV-001",
//     client: "Acme Corp",
//     created: "2024-03-01",
//     amount: "$1,200.00",
//     lastUpdated: "2 hours ago",
//     status: "Success",
//   },
//   {
//     id: "7",
//     invoiceNumber: "INV-002",
//     client: "Global Tech",
//     created: "2024-03-02",
//     amount: "$850.50",
//     lastUpdated: "5 hours ago",
//     status: "Pending",
//   },
//   {
//     id: "8",
//     invoiceNumber: "INV-003",
//     client: "Stark Ind",
//     created: "2024-03-03",
//     amount: "$3,400.00",
//     lastUpdated: "1 day ago",
//     status: "Unpaid",
//   },
//   {
//     id: "9",
//     invoiceNumber: "INV-004",
//     client: "Wayne Ent",
//     created: "2024-03-04",
//     amount: "$500.00",
//     lastUpdated: "2 days ago",
//     status: "Failed",
//   },
//   {
//     id: "10",
//     invoiceNumber: "INV-005",
//     client: "Oscorp",
//     created: "2024-03-05",
//     amount: "$2,100.00",
//     lastUpdated: "3 days ago",
//     status: "Draft",
//   },
//    {
//     id: "11",
//     invoiceNumber: "INV-001",
//     client: "Acme Corp",
//     created: "2024-03-01",
//     amount: "$1,200.00",
//     lastUpdated: "2 hours ago",
//     status: "Success",
//   },
//   {
//     id: "12",
//     invoiceNumber: "INV-002",
//     client: "Global Tech",
//     created: "2024-03-02",
//     amount: "$850.50",
//     lastUpdated: "5 hours ago",
//     status: "Pending",
//   },
//   {
//     id: "13",
//     invoiceNumber: "INV-003",
//     client: "Stark Ind",
//     created: "2024-03-03",
//     amount: "$3,400.00",
//     lastUpdated: "1 day ago",
//     status: "Unpaid",
//   },
//   {
//     id: "14",
//     invoiceNumber: "INV-004",
//     client: "Wayne Ent",
//     created: "2024-03-04",
//     amount: "$500.00",
//     lastUpdated: "2 days ago",
//     status: "Failed",
//   },
//   {
//     id: "15",
//     invoiceNumber: "INV-005",
//     client: "Oscorp",
//     created: "2024-03-05",
//     amount: "$2,100.00",
//     lastUpdated: "3 days ago",
//     status: "Draft",
//   },
// ]
  const [invoices, setInvoices] = React.useState<z.infer<typeof invoiceSchema>[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/invoices", {
           cache: 'no-store'
        })
        const data = await response.json()
        
        // Map backend fields to the DataTable schema
        const mappedData = Array.isArray(data) ? data.map((inv: any) => ({
          id: inv._id,
          invoiceNumber: inv.invoiceNumber || "INV-000",
          client: inv.customerName || "Unknown",
          created: inv.issueDate ? new Date(inv.issueDate).toLocaleDateString() : "N/A",
          amount: inv.total ? `$${inv.total.toLocaleString()}` : "$0.00",
          lastUpdated: "Recently", 
          status: inv.status || "DRAFT",
        })) : []
        
        setInvoices(mappedData)
      } catch (error) {
        console.error("Error fetching invoices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

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
      <SidebarInset className="bg-slate-50/50">
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 lg:p-6">
          <div className="@container/main flex flex-1 flex-col">
             {loading ? (
                <div className="flex flex-1 items-center justify-center">
                   <span className="text-slate-500 font-medium">Loading invoices...</span>
                </div>
             ) : (
                <DataTable data={invoices} />
             )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
