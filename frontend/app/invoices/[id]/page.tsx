"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/UserContext"

interface InvoiceData {
  invoice: {
    _id: string
    invoiceNumber: string
    customerName: string
    customerEmail: string
    customerAddress: string
    issueDate: string
    dueDate: string
    status: string
    total: number
    amountPaid: number
    balanceDue: number
    userId: {
      username: string
      email: string
    }
  }
  lineItems: Array<{
    _id: string
    description: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }>
  payments: Array<{
    _id: string
    amount: number
    paymentDate: string
  }>
}

export default function InvoiceDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const [data, setData] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const storedToken = localStorage.getItem("token") || token
        if (!storedToken) {
          console.error("No token available")
          return
        }

        const response = await fetch(`http://localhost:5000/api/invoices/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch invoice details")
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchInvoiceDetails()
    }
  }, [id, token])

  if (loading) {
    return (
      <SidebarProvider className="bg-[#FAF9F6]">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center p-10">
            <p className="text-slate-500 font-medium">Loading invoice...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!data || !data.invoice) {
    return (
      <SidebarProvider className="bg-[#FAF9F6]">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col items-center justify-center p-10 gap-4">
            <h2 className="text-xl font-bold text-slate-800">Invoice not found</h2>
            <Button onClick={() => router.push("/invoices")}>Go Back</Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const { invoice, lineItems, payments } = data

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-emerald-100 text-emerald-700"
      case "draft":
        return "bg-slate-200 text-slate-700"
      default:
        return "bg-orange-100 text-orange-700"
    }
  }

  return (
    <SidebarProvider className="bg-[#FAF9F6]">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/invoices" className="font-bold text-slate-600 hover:text-slate-900">
                    Invoices
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-black text-slate-900">Invoice #{invoice.invoiceNumber}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
          {/* Header Action Row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-slate-900">Invoice {invoice.invoiceNumber}</h1>
              <span className={`px-3 py-1 rounded-lg text-sm font-bold uppercase ${getStatusBadgeColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-slate-200 font-bold shadow-sm">
                Download PDF
              </Button>
              <Button className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-sm">
                Record Payment
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Invoice Bill */}
            <div className="md:col-span-2 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-8 items-start">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">From</h3>
                    <p className="text-lg font-bold text-slate-900">{invoice.userId.username}</p>
                    <p className="text-sm text-slate-500">{invoice.userId.email}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Billed To</h3>
                    <p className="text-lg font-bold text-slate-900">{invoice.customerName}</p>
                    <p className="text-sm text-slate-500">{invoice.customerEmail}</p>
                    {invoice.customerAddress && (
                      <p className="text-sm text-slate-500 whitespace-pre-wrap mt-1">
                        {invoice.customerAddress}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 text-right">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Date of Issue</h3>
                    <p className="text-base font-bold text-slate-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Due Date</h3>
                    <p className="text-base font-bold text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-2 bg-slate-100" />

              {/* Line Items */}
              <div className="flex flex-col">
                <div className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                <div className="flex flex-col gap-4 py-4">
                  {lineItems.map((item) => (
                    <div key={item._id} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 font-medium text-slate-900">{item.description}</div>
                      <div className="col-span-2 text-right text-slate-500">${item.unitPrice.toFixed(2)}</div>
                      <div className="col-span-2 text-right text-slate-500">{item.quantity}</div>
                      <div className="col-span-2 text-right font-bold text-slate-900">${item.lineTotal.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Totals Box */}
              <div className="flex justify-end pt-2">
                <div className="flex flex-col gap-3 w-64">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="font-medium">Subtotal</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="font-medium">Discount</span>
                    <span>$0.00</span>
                  </div>
                  <Separator className="bg-slate-100" />
                  <div className="flex justify-between items-center text-xl font-black text-slate-900">
                    <span>Total</span>
                    <span className="text-primary">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Stats and Payments */}
            <div className="md:col-span-1 flex flex-col gap-6">
              {/* Payment Summary Box */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-[#2D3328] text-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#86c95a] uppercase tracking-widest mb-4">Summary</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-slate-300 font-medium">Billed Amount</span>
                    <span className="font-bold">${invoice.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-slate-300 font-medium">Amount Paid</span>
                    <span className="font-bold">${invoice.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white font-bold text-lg">Balance Due</span>
                    <span className="font-black text-2xl text-primary">${invoice.balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payments History lists */}
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Payment History</h3>
                {payments && payments.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {payments.map((payment) => (
                      <div key={payment._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-900">Payment Processed</span>
                          <span className="text-xs text-slate-500 font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                        </div>
                        <span className="font-bold text-emerald-600">+${payment.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-slate-500 font-medium">
                    No payments recorded yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
