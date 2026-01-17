import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:from-primary/95 hover:to-primary/85 border border-primary/20 rounded-xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-md",
        outline:
          "border-2 border-border bg-transparent hover:bg-muted hover:border-primary/50 text-foreground rounded-xl",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl shadow-sm",
        ghost:
          "hover:bg-muted hover:text-foreground rounded-xl",
        link:
          "text-primary underline-offset-4 hover:underline",
        accent:
          "bg-gradient-to-br from-accent to-accent/90 text-accent-foreground shadow-md hover:shadow-lg rounded-xl border border-accent/20",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-base font-semibold",
        icon: "h-11 w-11 rounded-xl",
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
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
