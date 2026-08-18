import React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const mockupVariants = cva(
  "flex relative z-10 overflow-hidden shadow-2xl border border-[#E5E7EB] bg-white",
  {
    variants: {
      type: {
        mobile: "rounded-[40px] max-w-[350px]",
        responsive: "rounded-xl",
      },
    },
    defaultVariants: {
      type: "responsive",
    },
  }
);

export interface MockupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mockupVariants> {}

const Mockup = React.forwardRef<HTMLDivElement, MockupProps>(
  ({ className, type, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(mockupVariants({ type, className }))}
      {...props}
    />
  )
);
Mockup.displayName = "Mockup";

const frameVariants = cva(
  "bg-[#F7F8FA]/80 p-2 border border-[#E5E7EB] flex relative z-10 overflow-hidden rounded-2xl shadow-xl",
  {
    variants: {
      size: {
        small: "p-2 sm:p-3",
        large: "p-3 sm:p-5",
      },
    },
    defaultVariants: {
      size: "small",
    },
  }
);

export interface MockupFrameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frameVariants> {}

const MockupFrame = React.forwardRef<HTMLDivElement, MockupFrameProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(frameVariants({ size, className }))}
      {...props}
    />
  )
);
MockupFrame.displayName = "MockupFrame";

export { Mockup, MockupFrame };
