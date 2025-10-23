"use client";
export class PrimeLayoutController {
    // Constants
    static SIDEBAR_WIDTH = "13rem";
    static SIDEBAR_WIDTH_MOBILE = "18rem";
    static SIDEBAR_KEYBOARD_SHORTCUT = "b";

    // State
    private open: boolean;
    private openMobile: boolean;
    private isMobile: boolean;

    constructor(defaultOpen = true) {
        this.open = defaultOpen;
        this.openMobile = false;
        this.isMobile = false;
    }

    setIsMobile(isMobile: boolean) {
        this.isMobile = isMobile;
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.openMobile = !this.openMobile;
        } else {
            this.open = !this.open;
        }
    }

    getSidebarState() {
        return {
            open: this.open,
            openMobile: this.openMobile,
            isMobile: this.isMobile,
        };
    }
}
