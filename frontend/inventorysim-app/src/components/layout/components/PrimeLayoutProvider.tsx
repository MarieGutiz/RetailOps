import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'
import { PrimeLayoutController } from '../PrimeLayoutController'

type PrimeLayoutProviderProps = {
  defaultSidebarOpen?: boolean
  children: React.ReactNode
}

export function PrimeLayoutProvider({
  defaultSidebarOpen = true,
  children,
}: PrimeLayoutProviderProps) {
  const isMobile = useIsMobile()
  const controller = React.useMemo(
    () => new PrimeLayoutController(defaultSidebarOpen),
    [defaultSidebarOpen]
  )
  controller.setIsMobile(isMobile)

  // Keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === PrimeLayoutController.SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        controller.toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [controller])

  return (
    <div></div>
  )
}