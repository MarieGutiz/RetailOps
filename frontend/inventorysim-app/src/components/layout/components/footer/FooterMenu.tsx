import { usePrimeLayoutStore } from "../../hooks/usePrimeLayout"

const FooterMenu = () => {
   const collapsed = !usePrimeLayoutStore((l) => l.open)

  return (
    <>
      {!collapsed ? (
        <div className="border-t mt-2 pt-2 px-2 space-y-1 text-xs text-muted-foreground">
          <p className="text-[10px] uppercase font-semibold tracking-wide">
            v1.0 Simulator
          </p>
          <p>© {new Date().getFullYear()} RetailOpsSim Manteia</p>
        </div>
      ) : (
        <div className="border-t mt-2 pt-2 px-2 text-[10px] text-muted-foreground text-center">
          <p>v1.0</p>
           <p>© {new Date().getFullYear()}</p>
        </div>
      )}
    </>
  )
}

export default FooterMenu