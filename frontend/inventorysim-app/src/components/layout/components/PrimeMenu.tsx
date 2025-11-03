
import React, { useEffect } from 'react'
import {
  Sidebar,
} from "@/components/ui/sidebar"
import { usePrimeLayout } from './PrimeLayoutProvider'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import { usePrimeLayoutStore } from '../hooks/usePrimeLayout'
import Menu from './menu/Menu'


const primeMenu = ({...props}: React.ComponentProps<typeof Sidebar>) => {
   const layout = usePrimeLayout()

  // Sync motion values
  const x = useMotionValue(layout.position.x)
  const y = useMotionValue(layout.position.y)
  const controls = useDragControls()

  // Subscribe to pinned state
  const pinned = usePrimeLayoutStore(l => l.pinned)

  // keep sync with controller
  useEffect(() => {
  const unsubscribe = layout.subscribe(() => {
    x.set(layout.position.x)
    y.set(layout.position.y)
  })
  return () => {
    unsubscribe() // React cleanup expects a void return
  }
}, [layout, x, y])

 const handleDragEnd = (_: any, info: any) => {
    layout.setPosition(info.point.x, info.point.y)
  }

  const startDrag = (e: React.PointerEvent) => {
    if (!pinned) controls.start(e)
  }
  const side = usePrimeLayoutStore(l => l.side)
  const variant = layout.getVariant()

  if (pinned) {
    return (
      <Menu variant={variant} side={side}/>
    )
  }

  //  Unpinned: floating and draggable
  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        x,
        y,
        position: "fixed",
        zIndex: 1000,
        cursor: "move",
      }}
      initial={{ x: layout.position.x || 10, y: layout.position.y || 50 }}
    >
      <Menu variant={variant} side={side}/>
    </motion.div>
  )
}

export default primeMenu