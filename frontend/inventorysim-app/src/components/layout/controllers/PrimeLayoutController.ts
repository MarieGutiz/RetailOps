'use client';
import type React from 'react';
import { PrimeLayoutDragController } from './PrimeLayoutDragController';

// Main controller class for the prime layout, manages the state/bhavior of the sidebar
// and provides and interfacte to interact with the drag controller.

export class PrimeLayoutController {
  open = true;
  side: 'left' | 'right' = 'left';
  sidebarWidth = 16;
  collapsedWidth = 6;
  variant: 'sidebar' | 'floating' | 'inset' = 'sidebar';
  isMobile = false;
  openMobile = false; // whether the mobile sidebar is open

  pinned = true;
  draggable = true;
  isDragging = false;
  // width = this.sidebarWidth;
  position = { x: 0, y: 0 }; // initial absolute position

  dragController: PrimeLayoutDragController;

  private listeners = new Set<() => void>();

  constructor(init?: Partial<PrimeLayoutController>) {
    Object.assign(this, init);

    // initialize without width awareness
    this.dragController = new PrimeLayoutDragController({
      side: this.side,
    });

    // now sync the current width state properly
    this.syncDragController();
  }

  // Subscribe system
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener); // just call it, ignore the boolean
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  //Set collapse/expand state

  private get currentWidthRem() {
    return this.open ? this.sidebarWidth : this.collapsedWidth;
  }

  private syncDragController() {
    this.dragController.setSide(this.side);
    this.dragController.setSidebarWidth(this.currentWidthRem);
  }

  // collapse / expand
  toggle() {
    this.setOpen(!this.open);
  }

  setOpen(open: boolean) {
    this.open = open;

    // sync sidebar width
    this.syncDragController();

    // realign if collapsing
    if (!open) {
      this.dragController.reset();
    }

    this.notify();
  }

  setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile;
    this.notify();
  }

  // -----------------------------
  // MOBILE METHODS
  // -----------------------------
  setOpenMobile(open: boolean) {
    this.openMobile = open;
    console.log('Mobile sidebar open state set to in controller:', open);
    this.notify();
  }

  toggleMobile() {
    this.setOpenMobile(!this.openMobile);
  }

  // Pin or unpin the sidebar
  togglePin() {
    this.pinned = !this.pinned;
    this.draggable = !this.pinned;

    if (!this.pinned) {
      this.onUnpin();
    }

    // Always sync when pinning state changes
    this.syncDragController();
    this.notify();
  }

  getSidebarStyle(): React.CSSProperties {
    const width = this.open ? this.sidebarWidth : this.collapsedWidth;
    return {
      '--sidebar-width': `${width}rem`,
      transition: 'width 0.25s ease-in-out',
    } as React.CSSProperties;
  }

  getVariant() {
    return this.variant;
  }

  // Toggle sidebar side
  toggleSide() {
    this.side = this.side === 'left' ? 'right' : 'left';
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

  //upin the sidebar

  onUnpin() {
    // Make sure dragController knows about the current side + width
    // Make sure controller knows about side + current width
    this.syncDragController();
    this.dragController.setInitialPosition?.();
  }

  //Reset my providever to initial state

  resetDesktopState() {
    // console.log("Resetting desktop state to defaults.");
    this.isMobile = false;
    this.openMobile = false;

    // Restore defaults
    this.open = true;
    this.side = 'left';
    this.pinned = true;
    this.draggable = true;

    this.syncDragController();
    this.dragController.reset?.();

    this.notify();
  }
}
