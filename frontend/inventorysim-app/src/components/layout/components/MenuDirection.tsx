
import { Button } from '@radix-ui/themes'
import { usePrimeLayoutStore } from '../hooks/usePrimeLayout'

const MenuDirection = () => {
   const direction = usePrimeLayoutStore((layout) => layout.side)
   const layout = usePrimeLayoutStore((layout) => layout)

  //  console.log("Render MenuDirection: side =", direction, "layout =", layout)

  return (
   <Button onClick={() => layout.toggleSide()}>
     {direction === "left" ? "Switch to Right Menu" : "Switch to Left Menu"}
   </Button>
  )
}

export default MenuDirection