import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import type { PrimeLayoutController } from "../../controllers/PrimeLayoutController";

export function DraggableSidebar({
  controller,
  children,
}: {
  controller: PrimeLayoutController;
  children: React.ReactNode;
}) {
  // Motion values for dragging
  const x = useMotionValue(
    controller.side === "left"
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
        controller.side === "left"
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

  // console.log("Rendering DraggableSidebar with width:", width);
  // console.log("Controller toggle:", controller.sidebarWidth);

  return (
    <motion.div
      drag="x"
      dragConstraints={{
        left: 0,
        right:window.innerWidth - width, // dynamic based on current width
      }}
      dragElastic={0.05}
      dragMomentum={false}
      style={{
        x,
        y,
        left: controller.side === "left" ? 0 : "auto",
        // right: controller.side === "right" ? 0 : "auto",
        top: 0,
        position: "fixed",
        cursor: "move",
        width: `${width}px`, // dynamic width
      }}
      
      className="inset-y-0 z-10 h-svh bg-sidebar shadow-md rounded-r-lg"
    >
      {children}
    </motion.div>
  
  );

}
