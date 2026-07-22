import { Maximize2, Minus, Plus, Search } from "lucide-react"
import { ButtonGroup } from "./ui/button-group"

import { ShortcutIconButton } from "@/registry/shortcut-icon-button"

export function ShortcutIconButtonDemo() {
  return (
    <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm sm:p-7">
      <div className="mb-8">
        <h2 className="font-semibold">Shortcut Icon Button</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          An icon action with its browser access key shown in the corner.
        </p>
      </div>
      <div className="flex gap-2">
        <ShortcutIconButton aria-label="Search" shortcutKey="S" variant="outline">
          <Search data-icon="inline-start" />
        </ShortcutIconButton>
        <ShortcutIconButton aria-label="Fullscreen" shortcutKey="F11" variant="outline">
          <Maximize2 data-icon="inline-start" />
        </ShortcutIconButton>

        <ButtonGroup>
          <ShortcutIconButton aria-label="Zoom In" shortcutKey="+" variant="outline">
            <Plus data-icon="inline-start" />
          </ShortcutIconButton>
          <ShortcutIconButton aria-label="Zoom out" shortcutKey="-" variant="outline">
            <Minus data-icon="inline-start" />
          </ShortcutIconButton>
        </ButtonGroup>
      </div>
    </section>
  )
}
