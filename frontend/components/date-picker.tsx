"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

export function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DatePickerInput({
  date,
  onChange,
}: {
  date?: Date
  onChange?: (date: Date | undefined) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  React.useEffect(() => {
    setValue(formatDate(date))
    setMonth(date)
  }, [date])

  return (
    <Field className="w-full">
      <InputGroup className="h-12 rounded-2xl border-slate-200 bg-slate-50/50">
        <InputGroupInput
          id="date-required"
          value={value}
          placeholder="Select date"
          className="h-full px-5 font-semibold text-slate-900"
          onChange={(e) => {
            const newDate = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(newDate)) {
              onChange?.(newDate)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end" className="pr-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-sm"
                aria-label="Select date"
                className="text-slate-400 hover:text-slate-600"
              >
                <CalendarIcon className="size-5" />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(selectedDate) => {
                  onChange?.(selectedDate)
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
