import { motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import type { PrimeLayoutController } from "../../controllers/PrimeLayoutController";

export function DraggableSidebar({
  controller,
  children,
}: {
  controller: PrimeLayoutController;
  children: React.ReactNode;
}) {
   const x = useMotionValue(
    controller.side === "left" ? 0 : controller.dragController.viewportWidth - controller.sidebarWidth
  );
  const y = useMotionValue(0);

  useEffect(() => {
    controller.dragController.register(x, y);
  }, [controller]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{
      left: 0, 
      right: window.innerWidth - controller.dragController.sidebarWidth+20, // full width
      }}
      dragElastic={0.05} // make it *strict*
      dragMomentum={false} // prevent overshooting
      style={{ x, y, left: 0, top: 0, position: "fixed", cursor: "move" }}
      className="inset-y-0 z-10 w-[--sidebar-width] h-svh bg-sidebar shadow-md rounded-r-lg"
    >
      {children}
    </motion.div>
  );
}
