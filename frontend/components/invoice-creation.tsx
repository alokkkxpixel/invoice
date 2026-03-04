"use client"

import * as React from "react"
import { Plus, Trash2, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DatePickerInput } from "./date-picker"
import { InvoicePreview } from "./invoice-preview"

export function InvoiceCreation() {
  const [showPreview, setShowPreview] = React.useState(true)
  const [customer, setCustomer] = React.useState({
    name: "Acme Enterprise",
    email: "cmo@enterprise.com",
    address: "1901 Thornridge Cir. Shiloh, Hawaii, USA. 81063",
    invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
    dueDate: "2024-08-27"
  })
  const [items, setItems] = React.useState([
    { id: Date.now(), description: "Web Design", quantity: 2, price: 500, total: 1000 },
  ])

  const handleSendInvoice = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: customer.invoiceNumber,
          customerName: customer.name,
          customerEmail: customer.email,
          customerAddress: customer.address,
          issueDate: new Date().toISOString(),
          dueDate: new Date(customer.dueDate).toISOString(),
          lineItems: items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.price
          }))
        })
      })
      
      if (response.ok) {
        alert("Invoice created successfully!")
        window.location.href = "/dashboard"
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to send invoice")
    }
  }

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: "", quantity: 1, price: 0, total: 0 },
    ])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          updatedItem.total = updatedItem.quantity * updatedItem.price
          return updatedItem
        }
        return item
      })
    )
  }

  const subtotal = items.reduce((acc, item) => acc + item.total, 0)
  const discount = 0
  const tax = 0
  const grandTotal = subtotal - discount + tax

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-10 bg-slate-50 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
         <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">New Invoice</h1>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-200">
               <Label htmlFor="show-preview" className="text-sm font-medium text-slate-600">Show Preview</Label>
               <Switch 
                 id="show-preview" 
                 checked={showPreview} 
                 onCheckedChange={setShowPreview}
                 className="data-[state=checked]:bg-[#98E165]"
               />
            </div>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl px-6 font-semibold bg-white border-slate-200 text-slate-700">Save as Draft</Button>
            <Button className="h-11 rounded-xl px-8 font-bold bg-[#98E165] text-black hover:bg-[#86c95a]">Send Invoice</Button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Left Side: Form */}
        <div className="flex flex-col gap-8">
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                 <h2 className="text-xl font-bold text-slate-900 px-1">Invoice details</h2>
                 
                 <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2.5">
                          <Label className="text-sm font-semibold text-slate-500 ml-1">Customer Name</Label>
                          <Input 
                            className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 font-semibold text-slate-900" 
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            placeholder="e.g. Acme Enterprise"
                          />
                       </div>
                       <div className="flex flex-col gap-2.5">
                          <Label className="text-sm font-semibold text-slate-500 ml-1">Customer Email</Label>
                          <Input 
                            type="email"
                            className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 font-semibold text-slate-900" 
                            value={customer.email}
                            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            placeholder="e.g. cmo@enterprise.com"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2.5">
                          <Label className="text-sm font-semibold text-slate-500 ml-1">Invoice number</Label>
                          <Input 
                            className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 font-semibold text-slate-900" 
                            value={customer.invoiceNumber}
                            onChange={(e) => setCustomer({ ...customer, invoiceNumber: e.target.value })}
                          />
                       </div>
                       <div className="flex flex-col gap-2.5">
                          <Label className="text-sm font-semibold text-slate-500 ml-1">Due date</Label>
                         <DatePickerInput 
                           date={customer.dueDate ? new Date(customer.dueDate) : undefined}
                           onChange={(date) => {
                             if (date) {
                               const dateString = date.toISOString().split('T')[0]
                               setCustomer({ ...customer, dueDate: dateString })
                             }
                           }}
                         />
                       </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                       <Label className="text-sm font-semibold text-slate-500 ml-1">Address</Label>
                       <Input 
                         className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 text-slate-700" 
                         value={customer.address}
                         onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                         placeholder="1901 Thornridge Cir. Shiloh, Hawaii, USA. 81063"
                       />
                    </div>
                 </div>
              </div>

              <Separator className="bg-slate-100" />

              <div className="flex flex-col gap-6">
                 <h2 className="text-xl font-bold text-slate-900 px-1">Invoice items</h2>
                 
                 <div className="grid gap-6">
                     <div className="flex flex-col gap-2.5">
                       <Label className="text-sm font-semibold text-slate-500 ml-1">Currency</Label>
                       <Select defaultValue="usd">
                          <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 font-medium text-slate-900">
                             <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">🇺🇸</span>
                                <SelectValue placeholder="US Dollar" />
                             </div>
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100">
                             <SelectItem value="usd">US Dollar ($)</SelectItem>
                             <SelectItem value="eur">Euro (€)</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    {/* Table of items */}
                    <div className="flex flex-col gap-4">
                       <div className="grid grid-cols-12 gap-4 px-1 text-sm font-semibold text-slate-500 uppercase tracking-tight">
                          <div className="col-span-6">Items</div>
                          <div className="col-span-2 text-center">QTY</div>
                          <div className="col-span-2 text-right">Rate</div>
                          <div className="col-span-2 text-right">Total</div>
                       </div>
                       
                       <div className="flex flex-col gap-3">
                          {items.map((item) => (
                             <div key={item.id} className="grid grid-cols-12 gap-4 items-center group animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="col-span-6 flex items-center gap-2 relative">
                                   <Button 
                                     variant="ghost" 
                                     size="icon" 
                                     className="h-8 w-8 text-slate-300 hover:text-rose-500 absolute -left-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                     onClick={() => handleRemoveItem(item.id)}
                                   >
                                      <Trash2 className="h-4 w-4" />
                                   </Button>
                                   <Input 
                                     className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 font-medium text-slate-900" 
                                     value={item.description}
                                     onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                     placeholder="Item description"
                                   />
                                </div>
                                <div className="col-span-2">
                                   <Input 
                                     type="number"
                                     className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 text-center font-bold text-slate-900" 
                                     value={item.quantity}
                                     onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                   />
                                </div>
                                <div className="col-span-2">
                                   <Input 
                                     type="number"
                                     className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-2 text-right font-bold text-slate-900" 
                                     value={item.price}
                                     onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                   />
                                </div>
                                <div className="col-span-2">
                                   <div className="h-12 flex items-center justify-end px-2 font-bold text-slate-400">
                                      {item.total.toLocaleString()}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>

                       <Button 
                         variant="ghost" 
                         className="h-12 rounded-xl text-slate-900 font-bold justify-start gap-2 hover:bg-slate-100/50 px-4 mt-2"
                         onClick={handleAddItem}
                       >
                          <Plus className="h-4 w-4" />
                          Add Item
                       </Button>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Preview */}
        <div className={`transition-all duration-500 ${showPreview ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
          <div className="sticky top-10 flex flex-col gap-6">
             <h2 className="text-xl font-bold text-slate-900 px-2">Preview</h2>
             <InvoicePreview 
               customer={customer}
               items={items}
               subtotal={subtotal}
               discount={discount}
               tax={tax}
               grandTotal={grandTotal}
             />
          </div>
        </div>
      </div>
    </div>
  )
}
