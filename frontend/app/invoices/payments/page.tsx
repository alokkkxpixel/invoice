"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconReceipt2, IconWallet } from "@tabler/icons-react"
import { useAuth } from "@/context/UserContext"
import { AddPaymentModal } from "../../../components/add-payment-modal"

interface PaymentData {
  _id: string
  amount: number
  paymentDate: string
  invoiceId: {
    _id: string
    invoiceNumber: string
    customerName: string
  }
}

export default function PaymentsPage() {
  const { token } = useAuth()
  const [payments, setPayments] = React.useState<PaymentData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const fetchPayments = async () => {
    try {
      const storedToken = localStorage.getItem("token") || token
      if (!storedToken) return

      const response = await fetch("http://localhost:5000/api/invoices/payments/all", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        cache: 'no-store'
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setPayments(data)
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPayments()
  }, [token])

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
        <div className="flex flex-1 flex-col p-4 lg:p-10 gap-8">
          {/* Header section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <IconWallet size={28} stroke={2.5} />
                </div>
                Payments
              </h1>
              <p className="text-slate-500 font-medium mt-1">Manage all your client payments and transactions</p>
            </div>
            <Button 
                onClick={() => setIsModalOpen(true)}
                className="h-11 rounded-xl px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm gap-2"
            >
              <IconPlus size={18} stroke={3} />
              Add Payment
            </Button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <IconReceipt2 className="text-slate-400" size={20} />
                  Payment History
                </h3>
                <Badge variant="outline" className="rounded-lg bg-white border-slate-200 text-slate-500 font-bold px-3 py-1">
                  {payments.length} Records
                </Badge>
             </div>
             
             {loading ? (
                <div className="flex items-center justify-center p-20">
                  <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                </div>
             ) : payments.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-center gap-4">
                  <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                    <IconWallet size={48} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">No payments yet</h4>
                    <p className="text-slate-500 max-w-xs">When you add a payment to an invoice, it will appear here.</p>
                  </div>
                  <Button variant="outline" onClick={() => setIsModalOpen(true)} className="rounded-xl mt-2 font-bold transition-all hover:bg-primary hover:text-white hover:border-primary">
                    Record your first payment
                  </Button>
                </div>
             ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4 pl-8">Invoice</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4">Client</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4">Date</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4">Status</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] py-4 text-right pr-8">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment._id} className="group border-slate-50 hover:bg-slate-50/30 transition-colors">
                          <TableCell className="font-bold text-slate-900 py-5 pl-8">
                            {payment.invoiceId?.invoiceNumber || "N/A"}
                          </TableCell>
                          <TableCell className="font-medium text-slate-600 py-5">
                            {payment.invoiceId?.customerName || "Unknown Client"}
                          </TableCell>
                          <TableCell className="text-slate-500 font-medium py-5">
                            {new Date(payment.paymentDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="py-5">
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-lg font-bold uppercase text-[10px] px-2.5 py-1">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-5 pr-8">
                            <span className="font-black text-slate-900 text-lg">
                              ${payment.amount.toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
             )}
          </div>
        </div>

        <AddPaymentModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
                setIsModalOpen(false)
                fetchPayments()
            }}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
