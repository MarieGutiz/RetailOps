"use client";
export class PrimeLayoutController {
    // Constants
  static SIDEBAR_WIDTH = "13rem"
  static SIDEBAR_WIDTH_MOBILE = "18rem"
  static SIDEBAR_KEYBOARD_SHORTCUT = "b"

  // Configurable properties
  open: boolean
  side: "left" | "right"
  sidebarWidth: number
  collapsedWidth: number

  // State
  private openMobile: boolean
  private isMobile: boolean

  constructor({
    open = true,
    side = "left",
    sidebarWidth = 25,
    collapsedWidth = 6,
  }: {
    open?: boolean
    side?: "left" | "right"
    sidebarWidth?: number
    collapsedWidth?: number
  } = {}) {
    this.open = open
    this.openMobile = false
    this.isMobile = false

    this.side = side
    this.sidebarWidth = sidebarWidth
    this.collapsedWidth = collapsedWidth
  }

  setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.openMobile = !this.openMobile
    } else {
      this.open = !this.open
    }
  }

  getSidebarState() {
    return {
      open: this.open,
      openMobile: this.openMobile,
      isMobile: this.isMobile,
      side: this.side,
    }
  }

  toggle() {
    this.open = !this.open
  }

  getSidebarStyle(): React.CSSProperties {
    return {
      flexBasis: `${this.open ? this.sidebarWidth : this.collapsedWidth}%`,
      transition: "flex-basis 0.25s ease-in-out",
    }
  }

  getMainStyle(): React.CSSProperties {
    return {
      flexBasis: `${this.open ? 100 - this.sidebarWidth : 100 - this.collapsedWidth}%`,
      transition: "flex-basis 0.25s ease-in-out",
    }
  }
}
