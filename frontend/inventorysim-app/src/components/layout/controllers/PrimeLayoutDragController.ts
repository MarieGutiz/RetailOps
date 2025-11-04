import { MotionValue, animate } from "framer-motion";

export class PrimeLayoutDragController {
  x?: MotionValue<number>;
  y?: MotionValue<number>;
  initialPosition = { x: 0, y: 0 };
  sidebarWidth = 280;
  side: "left" | "right" = "left";

  constructor(options?: { side?: "left" | "right"; sidebarWidth?: number }) {
    if (options?.side) this.side = options.side;
    if (options?.sidebarWidth) this.sidebarWidth = options.sidebarWidth;
  }

  /** Computed dynamically to always match viewport size */
  get viewportWidth() {
    return typeof window !== "undefined" ? window.innerWidth : 0;
  }

  /** Computed drag bounds to keep sidebar strictly in screen */
  get bounds() {
    const left = 0;
    const right = this.viewportWidth - this.sidebarWidth*2;
    return { left, right };
  }

  register(x: MotionValue<number>, y?: MotionValue<number>) {
    this.x = x;
    this.y = y;
  }

  setSide(side: "left" | "right") {
    this.side = side;
  }

  reset() {
    if (!this.x) return;
    const target =
      this.side === "left" ? 0 : this.viewportWidth - this.sidebarWidth;
    animate(this.x, target, { type: "spring", stiffness: 200, damping: 25 });
    if (this.y)
      animate(this.y, 0, { type: "spring", stiffness: 200, damping: 25 });
  }

  toggleSide() {
    if (!this.x) return;
    const newSide = this.side === "left" ? "right" : "left";
    this.setSide(newSide);
    const target =
      newSide === "left" ? 0 : this.viewportWidth - this.sidebarWidth;
    animate(this.x, target, { type: "spring", stiffness: 120, damping: 20 });
  }
}
