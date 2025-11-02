"use client"
import type React from "react"

export class PrimeLayoutController {
   open = true
  side: "left" | "right" = "left"
  sidebarWidth = 16
  collapsedWidth = 6
  variant: "sidebar" | "floating" | "inset" = "sidebar"
  isMobile = false

  pinned = true
  draggable = true
  isDragging = false
  minWidth = 6
  maxWidth = 28
  width = this.sidebarWidth
  position = { x: 0, y: 0 } // initial absolute position
   // existing code...
  setPosition(x: number, y: number) {
    this.position = { x, y }
    this.notify()
  }

  
  togglePinned() {
    this.pinned = !this.pinned
    this.notify()
  }

  private listeners = new Set<() => void>()

  constructor(init?: Partial<PrimeLayoutController>) {
    Object.assign(this, init)
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((fn) => fn())
  }

  toggle() {
    this.open = !this.open
    console.log("Sidebar open:", this.open)
    console.log("Menu direction:", this.getMenuDirection())
    console.log("variant:", this.getVariant())
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

  togglePin() {
    this.pinned = !this.pinned
    this.draggable = !this.pinned
    this.notify()
  }

  //Dragging methods
  startDrag() {
    if (this.isMobile || this.pinned) return
    this.isDragging = true
    this.notify()
  }

  stopDrag() {
    this.isDragging = false
    this.notify()
  }

  updateWidth(deltaX: number) {
    if (this.isMobile || this.pinned) return
    const newWidth = Math.min(Math.max(this.width + deltaX / 16, this.minWidth), this.maxWidth)
    this.width = newWidth
    this.sidebarWidth = newWidth
    this.notify()
  }

  getSidebarStyle(): React.CSSProperties {
    const width = this.open ? this.sidebarWidth : this.collapsedWidth
    return {
      "--sidebar-width": `${width}rem`,
      transition: "width 0.25s ease-in-out",
    } as React.CSSProperties
  }

  getVariant() {
    return this.variant
  }
  //set menu side
  getMenuDirection() {
    return this.side;
  }
  toggleSide() {
    this.side = this.side === "left" ? "right" : "left";
    this.notify();
  }

  //set z-index
  getZIndex() {
    return this.pinned ? 99 : 1000;
  }

  
}
