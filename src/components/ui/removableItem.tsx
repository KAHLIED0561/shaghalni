import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "./button";

type RemovableItemProps = {
  value: string | number;
  className?: string;
  onRemove: (value: string | number) => void;
} & ButtonProps;
export default function RemovableItem({ value, onRemove, className, ...props }: RemovableItemProps) {
  return (
    <Button
      {...props}
      type="button"
      variant="outline"
      onClick={(e) => {
        onRemove(value);
        e.stopPropagation();
      }}
      className={cn("flex gap-2 justify-between items-center px-2 py-0.5 rounded-3xl h-auto", className)}
    >
      {value}
      <XIcon size={18} />
    </Button>
  );
}
