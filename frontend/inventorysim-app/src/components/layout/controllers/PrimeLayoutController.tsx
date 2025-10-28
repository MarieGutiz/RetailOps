"use client"
import type React from "react"

export class PrimeLayoutController {
 
  open: boolean
  side: "left" | "right"
  sidebarWidth: number
  collapsedWidth: number
  variant: "sidebar" | "floating" | "inset"
  isMobile: boolean

  private listeners: Set<() => void> = new Set()

  constructor({
    open = true,
    side = "left",
    sidebarWidth = 16,
    collapsedWidth = 6,
    variant = "sidebar",
  }: {
    open?: boolean
    side?: "left" | "right"
    sidebarWidth?: number
    collapsedWidth?: number
    variant?: "sidebar" | "floating" | "inset"
  } = {}) {
    this.open = open
    this.side = side
    this.sidebarWidth = sidebarWidth
    this.collapsedWidth = collapsedWidth
    this.variant = variant
    this.isMobile = false
  }

  // Subscribe for reactivity (Provider will use this)
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((fn) => fn())
  }

  // --- Actions ---
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

  // --- Derived styles ---
  getSidebarStyle(): React.CSSProperties {
    const width = this.open ? this.sidebarWidth : this.collapsedWidth
    return {
      flexBasis: `${width}rem`,
      transition: "flex-basis 0.25s ease-in-out",
      order: this.side === "left" ? 0 : 1,
    }
  }

  getMainStyle(): React.CSSProperties {
    const sidebarWidth = this.open ? this.sidebarWidth : this.collapsedWidth
    const marginProp = this.side === "left" ? "marginLeft" : "marginRight"

    return {
      flex: 1,
      transition: "margin 0.25s ease-in-out",
      [marginProp]: `${sidebarWidth}rem`,
    }
  }

  // 🔹 Variant getter
  getVariant() {
    return this.variant
  }

  // 🔹 Reset to defaults
  // reset() {
  //   this.open = true
  //   this.openMobile = false
  //   this.isMobile = false
  //   this.onChange?.()
  // }
}
