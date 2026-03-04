import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "./date-picker"

export interface InvoicePreviewProps {
  customer: {
    name: string
    email: string
    address: string
    invoiceNumber: string
    dueDate: string
  }
  items: Array<{
    id: number
    description: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  discount: number
  tax: number
  grandTotal: number
}

export function InvoicePreview({
  customer,
  items,
  subtotal,
  discount,
  tax,
  grandTotal,
}: InvoicePreviewProps) {
  return (
    <Card className="rounded-[40px] border-none shadow-xl overflow-hidden bg-white min-h-[700px] relative">
      <CardContent className="p-10 flex flex-col gap-12 h-full">
        {/* Brand Header */}
        <div className="flex items-center justify-center mb-[-2rem]">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            Uxerflow Platform Invoice
          </span>
        </div>

        {/* Invoice Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 italic">
              Invoice
            </h1>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                Invoice Number
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {customer.invoiceNumber || "N/A"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#98E165] flex items-center justify-center p-2 shadow-sm">
              <div className="grid grid-cols-2 grid-rows-2 gap-[2px]">
                <div className="h-2 w-2 rounded-sm bg-black/40"></div>
                <div className="h-2 w-2 rounded-sm bg-black"></div>
                <div className="h-2 w-2 rounded-sm bg-black"></div>
                <div className="h-2 w-2 rounded-sm bg-black/40"></div>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              UXERFLOW LLC
            </span>
          </div>
        </div>

        {/* Billing Info Grid */}
        <div className="grid grid-cols-2 rounded-3xl border border-slate-100 p-8 gap-8 bg-slate-50/50">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                Billed to
              </span>
              <span className="font-black text-slate-900 text-sm mt-1">
                {customer.name || "Customer Name"}
              </span>
              <span className="text-xs font-bold text-slate-400 mt-0.5">
                {customer.email || "Customer Email"}
              </span>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                Address
              </span>
              <span className="text-xs font-medium text-slate-500 leading-relaxed max-w-[180px] mt-1">
                {customer.address || "Customer Address"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
              Due date
            </span>
            <span className="font-black text-slate-900 text-sm italic mt-1">
              {formatDate(customer.dueDate ? new Date(customer.dueDate) : undefined)}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-6 px-2">
          <div className="grid grid-cols-12 gap-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4 mb-2">
            <div className="col-span-8">Items</div>
            <div className="col-span-1 text-center">QTY</div>
            <div className="col-span-1 text-right">Rate</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 items-center text-sm font-bold text-slate-900 leading-none"
              >
                <div className="col-span-8 overflow-hidden text-ellipsis whitespace-nowrap text-slate-700">
                  {item.description || "Item description"}
                </div>
                <div className="col-span-1 text-center font-medium bg-slate-50 py-1 rounded-md">
                  {item.quantity}
                </div>
                <div className="col-span-1 text-right text-slate-400 font-medium">
                  ${item.price}
                </div>
                <div className="col-span-2 text-right">
                  ${item.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="mt-auto self-end w-full max-w-[240px] flex flex-col gap-4 px-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Subtotal</span>
            <span className="text-slate-900 font-black">
              ${subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Discount</span>
            <span className="text-slate-900 font-black">
              ${discount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Tax</span>
            <span className="text-slate-900 font-black">
              ${tax.toLocaleString()}
            </span>
          </div>
          <Separator className="bg-slate-200 my-2" />
          <div className="flex items-center justify-between text-base font-black text-slate-900 italic">
            <span className="uppercase tracking-widest text-[10px] text-slate-400 not-italic">
              Total Due
            </span>
            <span className="text-2xl leading-none text-slate-900 tracking-tighter">
              ${grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#98E165]"></div>
      </CardContent>
    </Card>
  )
}
