import { usePrimeLayout } from './PrimeLayoutProvider'
import { usePrimeLayoutStore } from '../hooks/usePrimeLayout'

const ToggleSidebarButton = () => { 
  const open = usePrimeLayoutStore(l => l.open)
  const layout = usePrimeLayout()
  return (
    <button onClick={() => layout.toggle()}>
      {open ? "Collapse Sidebar" : "Expand Sidebar"}
    </button>
  )
}

export default ToggleSidebarButton