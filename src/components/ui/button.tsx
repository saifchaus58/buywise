import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#2563EB] text-white shadow-xs hover:bg-[#1D4ED8] active:scale-[0.98]",
        glow: "bg-[#0B0F19] text-white hover:bg-[#1F2937] shadow-md border border-[#374151] hover:border-[#4B5563] active:scale-[0.98]",
        destructive:
          "bg-[#DC2626] text-white shadow-xs hover:bg-[#B91C1C]",
        outline:
          "border border-[#E5E7EB] bg-white text-[#0B0F19] hover:bg-[#F7F8FA] hover:border-[#D1D5DB] shadow-2xs",
        secondary:
          "bg-[#F3F4F6] text-[#0B0F19] hover:bg-[#E5E7EB]",
        ghost: "hover:bg-[#F7F8FA] hover:text-[#0B0F19] text-[#5F6673]",
        link: "text-[#2563EB] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-[8px] px-3 text-xs",
        lg: "h-11 rounded-[12px] px-6 text-sm font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
