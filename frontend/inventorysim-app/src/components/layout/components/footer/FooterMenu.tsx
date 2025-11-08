
const FooterMenu = () => {
  return (
    <>
    <div className="border-t mt-2 pt-2 px-2 space-y-1 text-xs text-muted-foreground">
        <p className="text-[10px] uppercase font-semibold tracking-wide">
          v1.0 Simulator
        </p>
        <p>© { new Date().getFullYear() } RetailOpsSim Manteia</p>
      </div>
    </>
  )
}

export default FooterMenu