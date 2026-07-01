"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface RangeSliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  className?: string
}

export function RangeSlider({ min, max, step, value, onChange, className }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const percent = ((value - min) / (max - min)) * 100

  const getValueFromEvent = useCallback((clientX: number): number => {
    const track = trackRef.current
    if (!track) return value
    const rect = track.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const raw = min + ratio * (max - min)
    const stepped = Math.round(raw / step) * step
    return Math.max(min, Math.min(max, parseFloat(stepped.toFixed(10))))
  }, [min, max, step, value])

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onChange(getValueFromEvent(e.clientX))
  }, [getValueFromEvent, onChange])

  const handleThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleThumbTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return

    function onMouseMove(e: MouseEvent) {
      onChange(getValueFromEvent(e.clientX))
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches[0]) onChange(getValueFromEvent(e.touches[0].clientX))
    }

    function onEnd() {
      setDragging(false)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onEnd)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onEnd)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onEnd)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onEnd)
    }
  }, [dragging, getValueFromEvent, onChange])

  return (
    <div
      ref={trackRef}
      onClick={(e) => {
        e.stopPropagation()
        handleTrackClick(e)
      }}
      onMouseUp={(e) => e.stopPropagation()}
      className={cn(
        "relative flex h-5 cursor-pointer items-center",
        className
      )}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault()
          onChange(Math.min(max, parseFloat((value + step).toFixed(10))))
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault()
          onChange(Math.max(min, parseFloat((value - step).toFixed(10))))
        }
        if (e.key === "Home") { e.preventDefault(); onChange(min) }
        if (e.key === "End") { e.preventDefault(); onChange(max) }
      }}
    >
      {/* Track background */}
      <div className="absolute inset-x-0 h-1 rounded-full bg-white/10" />

      {/* Teal fill — left of thumb */}
      <div
        className="absolute left-0 h-1 rounded-full bg-teal-accent"
        style={{ width: `${percent}%` }}
      />

      {/* Thumb */}
      <div
        className={cn(
          "absolute size-4 -translate-x-1/2 rounded-full bg-teal-accent transition-shadow",
          dragging
            ? "shadow-[0_0_0_5px_rgba(45,212,191,0.3)] cursor-grabbing"
            : "shadow-[0_0_0_3px_rgba(45,212,191,0.15)] cursor-grab hover:shadow-[0_0_0_5px_rgba(45,212,191,0.25)]"
        )}
        style={{ left: `${percent}%` }}
        onMouseDown={(e) => {
          e.stopPropagation()
          handleThumbMouseDown(e)
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
          handleThumbTouchStart(e)
        }}
        onClick={(e) => e.stopPropagation()}
        aria-hidden="true"
      />
    </div>
  )
}