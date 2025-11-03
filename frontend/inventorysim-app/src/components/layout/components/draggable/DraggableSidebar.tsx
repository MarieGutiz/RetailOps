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
    controller.side === "left" ? 0 : window.innerWidth - controller.sidebarWidth * 16
  );
  const y = useMotionValue(0);

  useEffect(() => {
    controller.dragController.register(x, y);
  }, [controller]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      style={{ x, y, left: 0, top: 0, position: "fixed" }}
      className="inset-y-0 z-10 w-[--sidebar-width] h-svh bg-sidebar shadow-md rounded-r-lg"
    >
      {children}
    </motion.div>
  );
}
