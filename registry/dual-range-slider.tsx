"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type RangeValue = [number, number]

type DualRangeSliderProps = {
  min?: number
  max?: number
  step?: number
  value?: RangeValue
  defaultValue?: RangeValue
  onValueChange?: (value: RangeValue) => void
  formatValue?: (value: number) => React.ReactNode
  disabled?: boolean
  className?: string
}

function DualRangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [25, 75],
  onValueChange,
  formatValue = (value) => value,
  disabled = false,
  className,
}: DualRangeSliderProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<RangeValue>(defaultValue)
  const [a, b] = isControlled ? value : internalValue

  const trackRef = React.useRef<HTMLDivElement>(null)
  const dragStart = React.useRef<{ x: number; a: number; b: number } | null>(null)
  const trackDragHandle = React.useRef<"min" | "max" | null>(null)
  const [activeHandle, setActiveHandle] = React.useState<"min" | "max" | "range" | null>(null)

  const commit = React.useCallback(
    (next: RangeValue) => {
      if (!isControlled) setInternalValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const round = React.useCallback(
    (next: number) => {
      const stepped = Math.round((next - min) / step) * step + min
      return Math.min(max, Math.max(min, stepped))
    },
    [min, max, step]
  )

  const clientXToValue = React.useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return min
      const percentage = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      return round(min + percentage * (max - min))
    },
    [min, max, round]
  )

  const handleThumbDown = (which: "min" | "max") =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return
      event.stopPropagation()
      event.currentTarget.setPointerCapture(event.pointerId)
      setActiveHandle(which)
    }

  const handleThumbMove = (which: "min" | "max") =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || activeHandle !== which) return
      const next = clientXToValue(event.clientX)
      commit(which === "min" ? [Math.min(next, b), b] : [a, Math.max(next, a)])
    }

  const handleThumbUp = () => setActiveHandle(null)

  const handleRangeDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStart.current = { x: event.clientX, a, b }
    setActiveHandle("range")
  }

  const handleRangeMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || activeHandle !== "range" || !dragStart.current || !trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    let delta = ((event.clientX - dragStart.current.x) / rect.width) * (max - min)
    const { a: initialA, b: initialB } = dragStart.current

    if (initialA + delta < min) delta = min - initialA
    if (initialB + delta > max) delta = max - initialB
    commit([round(initialA + delta), round(initialB + delta)])
  }

  const handleRangeUp = () => {
    setActiveHandle(null)
    dragStart.current = null
  }

  const handleTrackDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const next = clientXToValue(event.clientX)
    const which = Math.abs(next - a) <= Math.abs(next - b) ? "min" : "max"
    commit(which === "min" ? [Math.min(next, b), b] : [a, Math.max(next, a)])
    trackDragHandle.current = which
    setActiveHandle(which)
  }

  const handleTrackMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !trackDragHandle.current) return
    const next = clientXToValue(event.clientX)
    commit(trackDragHandle.current === "min" ? [Math.min(next, b), b] : [a, Math.max(next, a)])
  }

  const handleTrackUp = () => {
    trackDragHandle.current = null
    setActiveHandle(null)
  }

  const handleKeyDown = (which: "min" | "max") =>
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return
      const direction = event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0
      if (!direction) return
      event.preventDefault()
      commit(
        which === "min"
          ? [round(Math.min(a + direction * step, b)), b]
          : [a, round(Math.max(b + direction * step, a))]
      )
    }

  if (max <= min || step <= 0) {
    throw new Error("DualRangeSlider requires max greater than min and a positive step.")
  }
  if (a < min || b > max || a > b) {
    throw new Error("DualRangeSlider values must be ordered and within the configured range.")
  }

  const percentageA = ((a - min) / (max - min)) * 100
  const percentageB = ((b - min) / (max - min)) * 100
  const thumbClassName =
    "absolute top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-sm outline-none ring-ring/50 transition-shadow hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none"

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="mb-2 flex justify-between text-sm font-medium text-foreground tabular-nums">
        <span>{formatValue(a)}</span>
        <span>{formatValue(b)}</span>
      </div>
      <div
        ref={trackRef}
        className={cn(
          "relative h-2 w-full rounded-full bg-muted",
          disabled ? "opacity-50" : "cursor-pointer"
        )}
        onPointerDown={handleTrackDown}
        onPointerMove={handleTrackMove}
        onPointerUp={handleTrackUp}
        onPointerCancel={handleTrackUp}
      >
        <div
          className={cn(
            "absolute top-0 h-2 rounded-full bg-primary",
            !disabled && (activeHandle === "range" ? "cursor-grabbing" : "cursor-grab")
          )}
          style={{ left: `${percentageA}%`, width: `${percentageB - percentageA}%` }}
          onPointerDown={handleRangeDown}
          onPointerMove={handleRangeMove}
          onPointerUp={handleRangeUp}
          onPointerCancel={handleRangeUp}
        />
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label="Minimum value"
          aria-disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={b}
          aria-valuenow={a}
          aria-orientation="horizontal"
          className={cn(thumbClassName, !disabled && "cursor-grab active:cursor-grabbing")}
          style={{ left: `${percentageA}%` }}
          onPointerDown={handleThumbDown("min")}
          onPointerMove={handleThumbMove("min")}
          onPointerUp={handleThumbUp}
          onPointerCancel={handleThumbUp}
          onKeyDown={handleKeyDown("min")}
        />
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label="Maximum value"
          aria-disabled={disabled}
          aria-valuemin={a}
          aria-valuemax={max}
          aria-valuenow={b}
          aria-orientation="horizontal"
          className={cn(thumbClassName, !disabled && "cursor-grab active:cursor-grabbing")}
          style={{ left: `${percentageB}%` }}
          onPointerDown={handleThumbDown("max")}
          onPointerMove={handleThumbMove("max")}
          onPointerUp={handleThumbUp}
          onPointerCancel={handleThumbUp}
          onKeyDown={handleKeyDown("max")}
        />
      </div>
    </div>
  )
}

export { DualRangeSlider, type DualRangeSliderProps, type RangeValue }
