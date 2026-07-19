"use client"

import * as React from "react"

import { DualRangeSlider, type RangeValue } from "@/registry/dual-range-slider"

const formatCurrency = (value: number) => `$${value.toLocaleString()}`

export function DualRangeSliderDemo() {
  const [range, setRange] = React.useState<RangeValue>([2_000, 7_500])

  return (
    <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm sm:p-7">
      <div className="mb-8">
        <h2 className="font-semibold">Dual Range Slider</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag either handle, or drag the selected range to move both.
        </p>
      </div>
      <p className="mb-3 text-sm font-medium">Monthly budget</p>
      <DualRangeSlider
        min={0}
        max={10_000}
        step={250}
        value={range}
        onValueChange={setRange}
        formatValue={formatCurrency}
      />
      <div className="mt-6 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Output</span>
        <code className="font-mono text-foreground">
          [{range[0].toLocaleString()}, {range[1].toLocaleString()}]
        </code>
      </div>
    </section>
  )
}
