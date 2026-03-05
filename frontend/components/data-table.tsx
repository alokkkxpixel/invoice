"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconSearch,
  IconTrendingUp,
} from "@tabler/icons-react"
import { Download } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"

export const schema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  client: z.string(),
  created: z.string(),
  amount: z.string(),
  lastUpdated: z.string(),
  status: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
    cell: ({ row }) => (
      <Link 
        href={`/invoices/${row.original.id}`}
        className="font-bold text-[#98E165] hover:text-[#86c95a] hover:underline leading-none capitalize"
      >
        {row.original.invoiceNumber}
      </Link>
    ),
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <span className="font-medium text-slate-700">{row.original.client}</span>
    ),
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-slate-500 text-sm whitespace-nowrap">{row.original.created}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-bold text-slate-900 leading-none">{row.original.amount}</span>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => (
      <span className="text-slate-500 text-sm">{row.original.lastUpdated}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase()
      let variantClasses = "bg-slate-100 text-slate-700"
      
      if (status === "success") variantClasses = "bg-emerald-100 text-emerald-700"
      else if (status === "pending") variantClasses = "bg-orange-100 text-orange-700"
      else if (status === "failed") variantClasses = "bg-rose-100 text-rose-700"
      else if (status === "draft") variantClasses = "bg-slate-100 text-slate-700"
      else if (status === "unpaid") variantClasses = "bg-indigo-100 text-indigo-700"

      return (
        <Badge className={`${variantClasses} hover:${variantClasses} border-none px-3 py-1 font-medium rounded-lg`}>
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-slate-400"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 rounded-xl">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-rose-600 focus:bg-rose-50 focus:text-rose-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)

  // Sync state if initialData prop changes (e.g. from a fetch)
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Table Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 gap-2 rounded-xl border-slate-200">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button asChild className="h-10 gap-2 rounded-xl bg-[#98E165] text-black hover:bg-[#86c95a]">
            <Link href="/invoices/new">
              <IconPlus className="h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2">
            {["All", "Paid"].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab.toLowerCase()}
                className="px-6 py-2 rounded-xl border border-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-slate-200 text-slate-600 data-[state=active]:text-slate-900"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex flex-col gap-4 px-4 lg:px-6 mt-2">
          {/* Search and Filters Toolbar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search invoice..." 
                className="h-10 pl-10 rounded-xl bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-300"
                value={(table.getColumn("invoiceNumber")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("invoiceNumber")?.setFilterValue(event.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-10 gap-2 rounded-xl border-slate-200 bg-white">
                <IconLayoutColumns className="h-4 w-4" />
                Customize Columns
              </Button>
              <Button variant="outline" className="h-10 gap-2 rounded-xl border-slate-200 bg-white">
                <IconPlus className="h-4 w-4" />
                Add Filter
              </Button>
            </div>
          </div>

          <TabsContent
            value="all"
            className="m-0 relative flex flex-col gap-4"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                id={sortableId}
              >
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-100">
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id} colSpan={header.colSpan} className="py-4 text-slate-500 font-medium tracking-wide">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody className="**:data-[slot=table-cell]:first:w-8">
                    {table.getRowModel().rows?.length ? (
                      <SortableContext
                        items={dataIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {table.getRowModel().rows.map((row) => (
                          <DraggableRow key={row.id} row={row} />
                        ))}
                      </SortableContext>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DndContext>
            </div>

            {/* Pagination Section */}
            <div className="flex items-center justify-between p-2 text-sm text-slate-500">
              <div className="flex items-center gap-8 font-medium">
                <div>
                   Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl border-slate-200 shadow-sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                   <Button variant="secondary" size="sm" className="h-9 w-9 rounded-xl bg-[#98E165] text-black font-bold border-none shadow-sm">
                      {table.getState().pagination.pageIndex + 1}
                   </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl border-slate-200 shadow-sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          {/* Other TabsContent can be added here or defaulted to 'all' */}
        </div>
      </Tabs>
    </div>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left font-bold text-slate-900 leading-none capitalize">
          {item.invoiceNumber}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md ml-auto h-full rounded-l-3xl border-l border-slate-200 shadow-2xl">
        <DrawerHeader className="gap-1 border-b border-slate-100 p-8">
          <Badge className="w-fit mb-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 font-medium rounded-lg">
             {item.status}
          </Badge>
          <DrawerTitle className="text-2xl font-black text-slate-900 italic">#{item.invoiceNumber}</DrawerTitle>
          <DrawerDescription className="text-slate-500 font-medium whitespace-pre-wrap">
            Showing details for invoice issued on {item.created}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-8 overflow-y-auto p-8 text-sm">
           <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-1.5">
                 <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Client</span>
                 <span className="text-base font-bold text-slate-900">{item.client}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right">
                 <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Amount</span>
                 <span className="text-base font-black text-[#98E165]">{item.amount}</span>
              </div>
           </div>

           <Separator className="bg-slate-100" />

           <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-slate-900">Payment Activity</span>
                 <Button variant="ghost" size="sm" className="text-[#98E165] font-bold hover:text-[#86c95a] hover:bg-slate-50">View all</Button>
              </div>
              
              <div className="flex flex-col gap-4">
                 {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                             <IconTrendingUp className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col leading-none">
                             <span className="font-bold text-slate-900">Partial Payment</span>
                             <span className="text-[10px] text-slate-400 mt-1 font-bold">12 Oct 2024</span>
                          </div>
                       </div>
                       <span className="font-bold text-slate-900">$250.00</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="mt-4 flex flex-col gap-3">
              <Button className="h-12 w-full rounded-2xl bg-[#2D3328] text-white hover:bg-[#1e231b] font-bold">
                 Email Invoice
              </Button>
              <Button variant="outline" className="h-12 w-full rounded-2xl border-slate-200 text-slate-700 font-bold bg-white">
                 Download PDF
              </Button>
           </div>
        </div>
        <DrawerFooter className="p-8 border-t border-slate-100">
          <DrawerClose asChild>
            <Button variant="ghost" className="h-12 rounded-2xl font-bold text-slate-500 hover:bg-slate-50">Close Details</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
