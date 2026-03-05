"use client"

import * as React from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useAuth } from "@/context/UserContext"
import { toast } from "sonner"
import { IconWallet, IconCheck, IconAlertCircle } from "@tabler/icons-react"

interface Invoice {
  _id: string
  invoiceNumber: string
  customerName: string
  balanceDue: number
  total: number
}

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddPaymentModal({ isOpen, onClose, onSuccess }: AddPaymentModalProps) {
  const { token } = useAuth()
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState<string>("")
  const [amount, setAmount] = React.useState<string>("")
  const [loading, setLoading] = React.useState(false)
  const [fetchingInvoices, setFetchingInvoices] = React.useState(false)

  const selectedInvoice = invoices.find(inv => inv._id === selectedInvoiceId)

  React.useEffect(() => {
    if (isOpen) {
      fetchInvoices()
    } else {
      // Reset form on close
      setSelectedInvoiceId("")
      setAmount("")
    }
  }, [isOpen])

  const fetchInvoices = async () => {
    setFetchingInvoices(true)
    try {
      const storedToken = localStorage.getItem("token") || token
      const response = await fetch("http://localhost:5000/api/invoices", {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        // Only show invoices that have a balance due
        setInvoices(data.filter(inv => inv.balanceDue > 0))
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setFetchingInvoices(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoiceId || !amount) return

    const paymentAmount = parseFloat(amount)
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (selectedInvoice && paymentAmount > selectedInvoice.balanceDue) {
      toast.error(`Amount exceeds balance due ($${selectedInvoice.balanceDue.toFixed(2)})`)
      return
    }

    setLoading(true)
    try {
      const storedToken = localStorage.getItem("token") || token
      const response = await fetch(`http://localhost:5000/api/invoices/${selectedInvoiceId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify({ amount: paymentAmount })
      })

      if (response.ok) {
        toast.success("Payment recorded successfully", {
          icon: <IconCheck className="text-emerald-500" />
        })
        onSuccess()
      } else {
        const err = await response.json()
        toast.error(err.message || "Failed to add payment")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md border-l-0 shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
          <div className="p-3 bg-primary w-fit rounded-2xl text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <IconWallet size={24} stroke={2.5} />
          </div>
          <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight">Record Payment</SheetTitle>
          <SheetDescription className="text-slate-500 font-medium text-sm">
            Record a new payment for an outstanding invoice.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-8 flex flex-col gap-8">
            {/* Select Invoice */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-bold text-slate-700 ml-1">Select Invoice</Label>
              <Select value={selectedInvoiceId} onValueChange={setSelectedInvoiceId}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 px-5 font-bold text-slate-900 focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder={fetchingInvoices ? "Loading invoices..." : "Choose an invoice"} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  {invoices.map((inv) => (
                    <SelectItem key={inv._id} value={inv._id} className="rounded-xl py-3 px-4 font-medium focus:bg-primary/5 focus:text-primary">
                      <div className="flex flex-col">
                        <span className="font-bold">{inv.invoiceNumber} — {inv.customerName}</span>
                        <span className="text-xs text-slate-400">Due: ${inv.balanceDue.toFixed(2)}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {invoices.length === 0 && !fetchingInvoices && (
                    <div className="p-4 text-center text-sm text-slate-400 font-medium">
                      No unpaid invoices found.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Invoice Stats */}
            {selectedInvoice && (
              <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col gap-4 shadow-xl shadow-slate-200 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Balance Due</span>
                  <span className="text-2xl font-black text-primary">${selectedInvoice.balanceDue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-medium">Total Amount</span>
                  <span className="font-bold">${selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-bold text-slate-700 ml-1">Payment Amount</Label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                <Input 
                  type="number"
                  step="0.01"
                  className="h-16 pl-10 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-2xl font-black text-slate-900 focus-visible:ring-primary/20 focus-visible:border-primary"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!selectedInvoiceId}
                />
              </div>
              {selectedInvoice && (
                 <p className="text-[11px] font-bold text-slate-400 ml-1 flex items-center gap-1">
                   <IconAlertCircle size={14} className="text-primary" />
                   Max allowed: ${selectedInvoice.balanceDue.toFixed(2)}
                 </p>
              )}
            </div>
          </div>

          <SheetFooter className="p-8 bg-slate-50/50 border-t border-slate-100 mt-auto">
            <div className="flex flex-col w-full gap-3">
              <Button 
                type="submit" 
                disabled={loading || !selectedInvoiceId || !amount}
                className="h-14 w-full rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </Button>
              <Button 
                 type="button" 
                 variant="ghost" 
                 onClick={onClose}
                 className="h-12 w-full rounded-xl text-slate-500 font-bold hover:bg-slate-100"
              >
                Cancel
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
