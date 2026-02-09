"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-transparent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "bg-transparent border border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]",
      ghost: "bg-transparent text-foreground hover:bg-white/5",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    }

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-8 text-sm",
      lg: "h-14 px-10 text-base",
      icon: "h-10 w-10",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
