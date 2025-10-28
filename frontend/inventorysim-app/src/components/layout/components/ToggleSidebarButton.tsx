import { useSyncExternalStore } from 'react'
import { usePrimeLayout } from './PrimeLayoutProvider'

const ToggleSidebarButton = () => {
  const layout = usePrimeLayout()
  const open = useSyncExternalStore(
    (listener) => layout.subscribe(listener),
    () => layout.open
  )

  return (
    <button onClick={() => layout.toggle()}>
      {open ? "Collapse Sidebar" : "Expand Sidebar"}
    </button>
  )
}

export default ToggleSidebarButton