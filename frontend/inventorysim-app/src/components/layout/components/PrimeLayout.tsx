import { Button } from '@/components/ui/Button'
import React from 'react'
import { usePrimeLayout } from './PrimeLayoutProvider'

const PrimeLayout = ({sidebar, children}: 
    {sidebar: React.ReactNode, children: React.ReactNode}) => {
  const layout = usePrimeLayout()
  const isRight = layout.side === "right"

  return (
    <div className="flex w-full h-screen overflow-hidden" style={{color: 'black'}}>
      {/* LEFT SIDEBAR */}
      {!isRight && (
        <div
          className="bg-muted border-r"
          style={layout.getSidebarStyle()}
        >
          <div className="flex flex-col h-full">
            <Button
              variant="ghost"
              size="icon"
              className="self-end m-2"
              onClick={() => layout.toggle()}
            >
              {layout.open ? "⇤" : "⇥"}
            </Button>
            {sidebar}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        className="bg-background"
        style={layout.getMainStyle()}
      >
        {children}
      </div>

      {/* RIGHT SIDEBAR */}
      {isRight && (
        <div
          className="bg-muted border-l"
          style={layout.getSidebarStyle()}
        >
          <div className="flex flex-col h-full">
            <Button
              variant="ghost"
              size="icon"
              className="self-start m-2"
              onClick={() => layout.toggle()}
            >
              {layout.open ? "⇥" : "⇤"}
            </Button>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  )
}

export default PrimeLayout