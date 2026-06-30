"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface ScrollbarProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
  offsetBottom?: number
  className?: string
}

export function Scrollbar({ scrollRef, offsetBottom, className }: ScrollbarProps) {
  const thumbRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStartY = useRef(0)
  const dragStartScrollTop = useRef(0)

  const update = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const trackEl = trackRef.current
    const trackHeight = trackEl ? trackEl.clientHeight : el.clientHeight
    const ratio = el.clientHeight / el.scrollHeight
    if (ratio >= 1) {
      setVisible(false)
      return
    }
    setVisible(true)
    setThumbHeight(Math.max(ratio * trackHeight, 32))
    setThumbTop((el.scrollTop / el.scrollHeight) * trackHeight)
  }, [scrollRef])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [scrollRef, update])

  // Drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const el = scrollRef.current
    if (!el) return
    setDragging(true)
    dragStartY.current = e.clientY
    dragStartScrollTop.current = el.scrollTop
  }, [scrollRef])

  useEffect(() => {
    if (!dragging) return
    const el = scrollRef.current
    if (!el) return

    function onMouseMove(e: MouseEvent) {
      const delta = e.clientY - dragStartY.current
      const scrollRatio = el!.scrollHeight / el!.clientHeight
      el!.scrollTop = dragStartScrollTop.current + delta * scrollRatio
    }

    function onMouseUp() {
      setDragging(false)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [dragging, scrollRef])

  if (!visible) return null

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-3 top-2 w-1 rounded-full",
        className
      )}
      style={{ bottom: offsetBottom ? `${offsetBottom + 8}px` : "8px" }}
    >
      {/* Track */}
      <div className="absolute inset-0 rounded-full bg-white/[6%]" />
      {/* Thumb */}
      <div
        ref={thumbRef}
        onMouseDown={onMouseDown}
        className={cn(
          "absolute w-full rounded-full transition-colors duration-150",
          dragging
            ? "cursor-grabbing bg-white/40 pointer-events-auto"
            : "cursor-grab bg-white/20 hover:bg-white/30 pointer-events-auto"
        )}
        style={{
          height: `${thumbHeight}px`,
          top: `${thumbTop}px`,
        }}
      />
    </div>
  )
}