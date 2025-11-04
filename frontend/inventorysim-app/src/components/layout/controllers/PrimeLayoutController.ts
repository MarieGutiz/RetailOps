"use client"
import type React from "react"
import { PrimeLayoutDragController } from "./PrimeLayoutDragController";

export class PrimeLayoutController {
  open = true;
  side: "left" | "right" = "left";
  sidebarWidth = 16;
  collapsedWidth = 6;
  variant: "sidebar" | "floating" | "inset" = "sidebar";
  isMobile = false;

  pinned = true;
  draggable = true;
  isDragging = false;
  minWidth = 6;
  maxWidth = 28;
  width = this.sidebarWidth;
  position = { x: 0, y: 0 }; // initial absolute position

  // new drag handler instance
  dragController = new PrimeLayoutDragController({
    side: this.side,
    sidebarWidth: this.sidebarWidth * 16, // convert rem → px
  });

  private listeners = new Set<() => void>();

  constructor(init?: Partial<PrimeLayoutController>) {
    Object.assign(this, init);
  }

  // Subscribe system
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }
  //Set collapse/expand state
  toggle() {
    this.open = !this.open;
    this.notify();
  }

  setOpen(open: boolean) {
    this.open = open;
    this.notify();
  }

  setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile;
    this.notify();
  }

// Pin or unpin the sidebar
  togglePin() {
    this.pinned = !this.pinned;
    this.draggable = !this.pinned;
    this.notify();
  }

  getSidebarStyle(): React.CSSProperties {
    const width = this.open ? this.sidebarWidth : this.collapsedWidth;
    return {
      "--sidebar-width": `${width}rem`,
      transition: "width 0.25s ease-in-out",
    } as React.CSSProperties;
  }

  getVariant() {
    return this.variant;
  }

  // getMenuDirection() {
  //   return this.side;
  // }
 
  // Toggle sidebar side
  toggleSide() {
    this.side = this.side === "left" ? "right" : "left";
    this.dragController.toggleSide();
    this.notify();
  }

  // Dragging controls
  resetPosition() {
    this.dragController.reset();
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
    this.notify();
  }
  
}
