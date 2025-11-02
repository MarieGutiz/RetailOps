import { usePrimeLayout } from './PrimeLayoutProvider'
import { usePrimeLayoutStore } from '../hooks/usePrimeLayout'

const ToggleSidebarButton = () => {
  const layout = usePrimeLayout()
  const open = usePrimeLayoutStore(l => l.open)
  return (
    <button onClick={() => layout.toggle()}>
      {open ? "Collapse Sidebar" : "Expand Sidebar"}
    </button>
  )
}

export default ToggleSidebarButton