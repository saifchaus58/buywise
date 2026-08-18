import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
        secondary:
          "border-transparent bg-[#F3F4F6] text-[#0B0F19] hover:bg-[#E5E7EB]",
        destructive:
          "border-transparent bg-[#EF4444] text-white hover:bg-[#DC2626]",
        outline: "border-[#E5E7EB] text-[#0B0F19] bg-white",
        glow: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1E40AF] shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
