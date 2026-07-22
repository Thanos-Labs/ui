import * as React from "react"

import { Button } from "@/registry/ui/button"
import { cn } from "@/lib/utils"

type ShortcutIconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "aria-label" | "asChild" | "children" | "size"
> & {
  "aria-label": string
  shortcutKey: string
  children: React.ReactNode
}

function ShortcutIconButton({
  "aria-label": ariaLabel,
  shortcutKey,
  children,
  className,
  ...props
}: ShortcutIconButtonProps) {
  const key = shortcutKey.toUpperCase()

  return (
    <Button
      {...props}
      size="icon"
      accessKey={key.toLowerCase()}
      aria-label={ariaLabel}
      title={`${ariaLabel} (${key})`}
      className={cn("relative size-12", className)}
    >
      {children}
      <kbd
        aria-hidden="true"
        className="pointer-events-none absolute right-1 bottom-1 font-mono text-[9px] leading-none opacity-60"
      >
        {key}
      </kbd>
    </Button>
  )
}

export { ShortcutIconButton, type ShortcutIconButtonProps }
