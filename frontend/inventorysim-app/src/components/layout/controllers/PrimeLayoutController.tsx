"use client"
import type React from "react"

export class PrimeLayoutController {
  // 🔹 Constants
  static readonly SIDEBAR_WIDTH = 13 // rem
  static readonly SIDEBAR_WIDTH_MOBILE = 18 // rem
  static readonly SIDEBAR_KEYBOARD_SHORTCUT = "b"

  // 🔹 Configurable properties
  open: boolean
  side: "left" | "right"
  sidebarWidth: number
  collapsedWidth: number
  variant?:"sidebar" | "floating" | "inset"

  // 🔹 Internal state
  private openMobile: boolean
  private isMobile: boolean

  constructor({
    open = true,
    side = "left",
    sidebarWidth = PrimeLayoutController.SIDEBAR_WIDTH,
    collapsedWidth = 4,
    variant = "sidebar"
  }: {
    open?: boolean
    side?: "left" | "right"
    sidebarWidth?: number
    collapsedWidth?: number
    variant?: "sidebar" | "floating" | "inset" //for styling purposes
  } = {}) {
    this.open = open
    this.openMobile = false
    this.isMobile = false
    this.side = side
    this.sidebarWidth = sidebarWidth
    this.collapsedWidth = collapsedWidth
    this.variant = variant
  }

  // 🔹 Device helpers
  setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile
  }

  // 🔹 Sidebar actions
  toggleSidebar() {
    if (this.isMobile) {
      this.openMobile = !this.openMobile
    } else {
      this.open = !this.open
    }
  }

  openSidebar() {
    if (this.isMobile) {
      this.openMobile = true
    } else {
      this.open = true
    }
  }

  closeSidebar() {
    if (this.isMobile) {
      this.openMobile = false
    } else {
      this.open = false
    }
  }

  // 🔹 Accessors
  getSidebarState() {
    return {
      open: this.open,
      openMobile: this.openMobile,
      isMobile: this.isMobile,
      side: this.side,
    }
  }

  // 🔹 Derived styles
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
  getVariant(){
    return this.variant
  }

  // 🔹 Utility methods
  isOpen() {
    return this.isMobile ? this.openMobile : this.open
  }

  reset() {
    this.open = true
    this.openMobile = false
    this.isMobile = false
  }
}
