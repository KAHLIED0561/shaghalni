"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DatePickerProps = {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
} & ButtonProps;
export function DatePicker({ date, onChange, disabled, placeholder, className, ...rest }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          {...rest}
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal w-full bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6 text-black hover:bg-[#F8F8F8] hover:text-garyClr",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
