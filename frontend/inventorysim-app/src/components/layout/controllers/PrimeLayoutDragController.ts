import { MotionValue, animate } from "framer-motion";

export class PrimeLayoutDragController {
  x?: MotionValue<number>;
  y?: MotionValue<number>;
  initialPosition = { x: 0, y: 0 };
  sidebarWidth = 280;
  viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  side: "left" | "right" = "left";

  constructor(options?: { side?: "left" | "right"; sidebarWidth?: number }) {
    if (options?.side) this.side = options.side;
    if (options?.sidebarWidth) this.sidebarWidth = options.sidebarWidth;
  }

  register(x: MotionValue<number>, y?: MotionValue<number>) {
    this.x = x;
    this.y = y;
  }

  setSide(side: "left" | "right") {
    this.side = side;
  }

  /** Resets the sidebar back to its aligned position (left or right) */
  reset() {
    if (!this.x) return;
    const target =
      this.side === "left"
        ? 0
        : this.viewportWidth - this.sidebarWidth;
    animate(this.x, target, { type: "spring", stiffness: 200, damping: 25 });
    if (this.y) animate(this.y, 0, { type: "spring", stiffness: 200, damping: 25 });
  }

  /** Toggles between left/right and animates across */
  toggleSide() {
    if (!this.x) return;
    const newSide = this.side === "left" ? "right" : "left";
    this.setSide(newSide);
    const target =
      newSide === "left"
        ? 0
        : this.viewportWidth - this.sidebarWidth;
    animate(this.x, target, { type: "spring", stiffness: 120, damping: 20 });
  }
}
