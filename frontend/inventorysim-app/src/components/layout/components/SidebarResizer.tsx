import React from 'react'
import { usePrimeLayout } from './PrimeLayoutProvider'

const SidebarResizer:React.FC = () => {
  const layout = usePrimeLayout()

  const isDragging = React.useSyncExternalStore(
    (listener) => layout.subscribe(listener),
    () => layout.isDragging
  )

  const canDrag = !layout.isMobile && layout.draggable && !layout.pinned

  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => layout.updateWidth(e.movementX)
    const handleMouseUp = () => {
      layout.stopDrag()
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, layout])

  if (!canDrag) return null

  return (
    <div
      onMouseDown={() => layout.startDrag()}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: layout.side === "left" ? 0 : "auto",
        left: layout.side === "right" ? 0 : "auto",
        width: "4px",
        cursor: "col-resize",
        background: isDragging ? "rgba(0,0,0,0.15)" : "transparent",
        zIndex: 50,
      }}
    />
  )
}

export default SidebarResizer