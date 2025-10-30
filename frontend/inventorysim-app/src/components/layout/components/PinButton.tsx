import { usePrimeLayoutStore } from '../hooks/usePrimeLayout'
import { usePrimeLayout } from './PrimeLayoutProvider'

const PinButton = () => {
  const pinned = usePrimeLayoutStore((layout) => layout.pinned)
  const layout = usePrimeLayout()

  if (layout.isMobile) return null

  console.log("Render PinButton: pinned =", pinned)

  return (
    <button
      onClick={() => layout.togglePin()}
      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
    >
      {pinned ? "Unpin" : "Pin"}
    </button>
  )
}

export default PinButton