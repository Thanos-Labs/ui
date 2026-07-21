import { DualRangeSliderDemo } from "@/components/dual-range-slider-demo"
import { ShortcutIconButtonDemo } from "@/components/shortcut-icon-button-demo"

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col px-4 py-12 sm:py-20">
      <header className="mb-10 flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Component registry
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Thanos Labs Registry</h1>
        <p className="text-muted-foreground">
          A custom registry for distributing code using shadcn.
        </p>
      </header>
      <div className="flex flex-col gap-8">
        <DualRangeSliderDemo />
        <ShortcutIconButtonDemo />
      </div>
    </main>
  )
}
