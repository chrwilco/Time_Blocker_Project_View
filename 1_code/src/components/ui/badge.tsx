import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive hover:bg-destructive/80",
        outline: "text-foreground",
        red: "border-transparent bg-red-400 hover:bg-red-900/80 text-white",
        orange:
          "border-transparent bg-orange-400 hover:bg-orange-900/80 text-white",
        yellow:
          "border-transparent bg-yellow-400 hover:bg-yellow-900/80 text-white",
        green:
          "border-transparent bg-green-400  hover:bg-green-900/80 text-white",
        blue: "border-transparent bg-blue-400  hover:bg-blue-900/80 text-white",
        purple:
          "border-transparent bg-purple-400 hover:bg-purple-900/80 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
