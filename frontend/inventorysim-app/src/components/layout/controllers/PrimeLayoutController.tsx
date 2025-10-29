"use client"
import type React from "react"

export class PrimeLayoutController {
  open: boolean
  side: "left" | "right"
  sidebarWidth: number
  collapsedWidth: number
  variant: "sidebar" | "floating" | "inset"
  isMobile: boolean
  draggable: boolean

  // For drag/pin state
  minWidth = 6
  maxWidth = 28
  width: number
  pinned = true
  isDragging = false

  private listeners: Set<() => void> = new Set()

  constructor({
    open = true,
    side = "left",
    sidebarWidth = 16,
    collapsedWidth = 6,
    variant = "sidebar",
    draggable = true,
  }: {
    open?: boolean
    side?: "left" | "right"
    sidebarWidth?: number
    collapsedWidth?: number
    variant?: "sidebar" | "floating" | "inset"
    draggable?: boolean
  } = {}) {
    this.open = open
    this.side = side
    this.sidebarWidth = sidebarWidth
    this.collapsedWidth = collapsedWidth
    this.variant = variant
    this.isMobile = false
    this.draggable = draggable
    this.width = sidebarWidth
  }

  // Reactivity system
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  private notify() {
    this.listeners.forEach((fn) => fn())
  }

  // Actions
  toggle() {
    this.open = !this.open
    this.notify()
  }
  setOpen(open: boolean) {
    this.open = open
    this.notify()
  }
  setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile
    this.notify()
  }

  // Pin toggle
  togglePin() {
   this.pinned = !this.pinned
  // If pinned, disable dragging
    this.draggable = !this.pinned
    this.notify()
  }

  // --- Drag logic ---
  startDrag() {
    if (this.isMobile || this.pinned) return // can't drag if pinned
    this.isDragging = true
    this.notify()
  }
  stopDrag() {
    if (!this.draggable) return
    this.isDragging = false
    this.sidebarWidth = this.width // sync back
    this.notify()
  }
  updateWidth(deltaX: number) {
    if (this.isMobile || this.pinned) return
    const newWidth = Math.min(Math.max(this.width + deltaX / 16, this.minWidth), this.maxWidth)
    this.width = newWidth
    this.sidebarWidth = newWidth
    this.notify()
  }

  // Styles
  getSidebarStyle(): React.CSSProperties {
    const width = this.open ? this.width : this.collapsedWidth
    return {
      flexBasis: `${width}rem`,
      transition: this.isDragging ? "none" : "flex-basis 0.25s ease-in-out",
      order: this.side === "left" ? 0 : 1,
    }
  }

  getMainStyle(): React.CSSProperties {
    const sidebarWidth = this.open ? this.width : this.collapsedWidth
    const marginProp = this.side === "left" ? "marginLeft" : "marginRight"

    return {
      flex: 1,
      transition: "margin 0.25s ease-in-out",
      [marginProp]: `${sidebarWidth}rem`,
    }
  }

  getVariant() {
    return this.variant
  }
}
