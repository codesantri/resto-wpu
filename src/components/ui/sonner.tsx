"use client"

import { CircleAlert, CircleCheck, CircleX } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
    theme={theme as ToasterProps["theme"]}
    className="toaster group"
    icons={{
      success: <CircleCheck className="h-5 w-5 text-success" />,
      error: <CircleX className="h-5 w-5 text-danger" />,   
      warning: <CircleAlert className="h-5 w-5 text-warning" />,
    }}
    style={
      {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties
    }
    {...props}
  />
  )
}

export { Toaster }
