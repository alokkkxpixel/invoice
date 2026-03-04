import * as React from "react"
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
    <div className="flex flex-col bg-white p-6 shadow-sm border border-slate-100 rounded-xl w-full">
      {/* Header section combining Invoice Number and Platform Name */}
      <div className="flex justify-between items-start mb-8">
         <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice</h1>
            <span className="text-sm font-medium text-slate-500">UXERFLOW LLC</span>
         </div>
         <div className="flex flex-col gap-1 text-right">
            <span className="text-sm text-slate-500">Invoice Number</span>
            <span className="text-sm font-semibold text-slate-900">
              {customer.invoiceNumber || "N/A"}
            </span>
         </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Billing and Due Date Grid */}
        <div className="grid grid-cols-2 rounded-md border border-slate-200">
          <div className="flex flex-col border-r border-slate-200">
            <div className="flex flex-col gap-1 p-5 border-b border-slate-200">
              <span className="text-xs text-slate-500 mb-1">Billed to</span>
              <span className="text-sm font-semibold text-slate-900">
                {customer.name || "Customer Name"}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {customer.email || "Customer Email"}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-5">
              <span className="text-xs text-slate-500 mb-1">Address</span>
              <span className="text-sm font-semibold text-slate-900 leading-relaxed">
                {customer.address || "Customer Address"}
              </span>
            </div>
          </div>
          <div className="flex flex-col p-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 mb-1">Due date</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatDate(customer.dueDate ? new Date(customer.dueDate) : undefined)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="rounded-md border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#fafafa]">
              <tr className="border-b border-slate-200">
                <th className="py-3 px-5 text-left font-medium text-slate-500">Items</th>
                <th className="py-3 px-5 text-center font-medium text-slate-500 border-l border-slate-200 w-24">QTY</th>
                <th className="py-3 px-5 text-left font-medium text-slate-500 border-l border-slate-200 w-32">Rate</th>
                <th className="py-3 px-5 text-right font-medium text-slate-500 border-l border-slate-200 w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 px-5 font-semibold text-slate-900">{item.description || "-"}</td>
                  <td className="py-4 px-5 text-center font-semibold text-slate-900 border-l border-slate-200">{item.quantity}</td>
                  <td className="py-4 px-5 text-left font-semibold text-slate-900 border-l border-slate-200">${item.price}</td>
                  <td className="py-4 px-5 text-right font-semibold text-slate-900 border-l border-slate-200">${item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="w-72 ml-auto rounded-md border border-slate-200 p-5 bg-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-slate-500">Subtotal</span>
            <span className="text-sm font-semibold text-slate-900">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-slate-500">Discount</span>
            <span className="text-sm font-semibold text-slate-900">${discount}</span>
          </div>
          <div className="flex justify-between items-center mb-5">
            <span className="text-sm text-slate-500">Tax</span>
            <span className="text-sm font-semibold text-slate-900">${tax}</span>
          </div>
          <div className="border-t border-slate-200 pt-5 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Total</span>
            <span className="text-base font-bold text-slate-900">${grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
