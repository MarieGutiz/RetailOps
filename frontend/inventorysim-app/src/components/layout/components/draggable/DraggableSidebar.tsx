import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { PrimeLayoutController } from '../../controllers/PrimeLayoutController';
import { usePrimeLayoutStore } from '../../hooks/usePrimeLayout';


/**
 * DraggableSidebar
 *
 * A sidebar component that supports dragging horizontally using Framer Motion.
 * Designed to work with `PrimeLayoutController` for dynamic width, collapse state, and side positioning.
 *
 * Features:
 * - Horizontal dragging with constraints based on window width and sidebar size.
 * - Reactive width adjustments when controller updates.
 * - Supports both "inset" (absolute) and normal (fixed) positioning.
 * - Wraps children content inside a centered flex container.
 *
 * Props:
 * - `controller`: PrimeLayoutController – provides sidebar width, side, and subscriptions for updates.
 * - `children`: React.ReactNode – content to render inside the sidebar.
 *
 */

export function DraggableSidebar({
  controller,
  children,
}: {
  controller: PrimeLayoutController;
  children: React.ReactNode;
}) {
  const isInset = controller.variant === 'inset';
  const collapsed = usePrimeLayoutStore((l) => l.open);
  //bring states: collapsed/expanded

  // Motion values for dragging
  const x = useMotionValue(
    controller.side === 'left'
      ? 0
      : window.innerWidth - controller.dragController.sidebarWidth
  );
  const y = useMotionValue(0);

  // Local width state to trigger re-render
  const [width, setWidth] = useState(controller.dragController.sidebarWidth);

  // Register drag controller
  useEffect(() => {
    controller.dragController.register(x, y);
  }, [controller, x, y]);

  // Subscribe to controller updates (expand/collapse, side change)
  useEffect(() => {
    const update = () => {
      setWidth(controller.dragController.sidebarWidth);

      const newX =
        controller.side === 'left'
          ? 0
          : window.innerWidth - controller.dragController.sidebarWidth;
      x.set(newX);
    };

    // initial update
    update();

    // Subscribe and store the cleanup
    const unsubscribe = controller.subscribe(update);

    // ensure cleanup returns void
    return () => {
      unsubscribe();
    };
  }, [controller, x]);

  const wide = collapsed ? width - 22 : width + 18;

  return (
    <motion.div
      drag="x"
      dragConstraints={{
        left: 0,
        right: window.innerWidth - width, // dynamic based on current width
      }}
      dragElastic={0.05}
      dragMomentum={false}
      style={{
        x,
        y,
        left: controller.side === 'left' ? 0 : 'auto',
        // right: controller.side === "right" ? 0 : "auto",
        top: 0,
        position: isInset ? 'absolute' : 'fixed',
        cursor: 'move',
        width: `${wide}px`, // dynamic width
        margin: 0,
        padding: 0, // <-- important
        border: 'none', // <-- remove borders
      }}
      // className="inset-y-0 z-10 h-svh bg-sidebar shadow-md rounded-r-lg"
      className="z-10 h-svh flex items-center justify-center  bg-[#001e2b]"
    >
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}
