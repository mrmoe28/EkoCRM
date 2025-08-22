import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[var(--button-hover)] hover:text-foreground shadow-sm",
        modern: "modern-button text-primary-foreground",
        glass: "bg-background text-foreground border border-input",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[var(--button-hover)] hover:text-destructive shadow-sm",
        outline:
          "border border-input bg-background hover:bg-[var(--button-hover)] hover:text-accent-foreground shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[var(--button-hover)] hover:text-foreground shadow-sm",
        ghost: "hover:bg-[var(--button-hover)] hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg",
        floating: "bg-card border border-glass-border shadow-xl",
        orange: "bg-accent-orange text-white hover:bg-accent-orange-hover shadow-lg",
        purple: "bg-accent-purple text-white hover:bg-accent-purple-hover shadow-lg",
        "gradient-orange": "bg-gradient-to-r from-accent-orange to-accent-orange-hover text-white shadow-lg",
        "gradient-purple": "bg-gradient-to-r from-accent-purple to-accent-purple-hover text-white shadow-lg",
        "gradient-sunset": "bg-gradient-to-r from-accent-orange to-accent-purple text-white shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }