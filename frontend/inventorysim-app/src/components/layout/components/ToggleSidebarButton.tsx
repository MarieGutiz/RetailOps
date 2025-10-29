import { useSyncExternalStore } from 'react'
import { usePrimeLayout } from './PrimeLayoutProvider'
import { usePrimeLayoutStore } from '../hooks/usePrimeLayoutStore'

const ToggleSidebarButton = () => {
  // const layout = usePrimeLayout()
  // const open = useSyncExternalStore(
  //   (listener) => layout.subscribe(listener),
  //   () => layout.open
  // )
  const layout = usePrimeLayout()
  const open = usePrimeLayoutStore(l => l.open)
  return (
    <button onClick={() => layout.toggle()}>
      {open ? "Collapse Sidebar" : "Expand Sidebar"}
    </button>
  )
}

export default ToggleSidebarButton