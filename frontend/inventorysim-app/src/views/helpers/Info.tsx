import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import  { ABC_SCENARIOS_META } from "../ABCViews/info/ABC_SCENARIOS"
import  { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


interface InfoContent {
  title: string
  theory?: string
  description: string
  thresholds?: string
}

type InfoProps =
  | { scenarioKey: keyof typeof ABC_SCENARIOS_META; content?: never }
  | { content: InfoContent; scenarioKey?: never }

  
const Info = ({scenarioKey, content}: InfoProps) => {
  const scenario = scenarioKey
    ? ABC_SCENARIOS_META[scenarioKey]
    : content

  if (!scenario) return null

   // Track mobile vs desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="jbtn-passive h-7 w-7 p-0 sm:h-8 sm:w-8 text-muted-foreground hover:text-black"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
              <path
                d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </DialogTrigger>
        <DialogContent className="j-dialog max-w-md">
        <DialogHeader>
          <DialogTitle className="j-dialog-title text-center">
            {scenario.title}
          </DialogTitle>

          {/* Optional: theory goes in the header */}
          {scenario.theory && (
            <p className="text-center text-xs text-muted-foreground">
              {scenario.theory}
            </p>
          )}

          <DialogDescription className="j-dialog-description text-center space-y-1 text-xs whitespace-pre-line">
            
              {scenario.description}
              {scenario.thresholds && <> {scenario.thresholds}</>}
           

          </DialogDescription>
        </DialogHeader>
      </DialogContent>

      </Dialog>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          type="button"
          className="jbtn-passive h-7 w-7 p-0 sm:h-8 sm:w-8 text-muted-foreground hover:text-black"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
            <path
              d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
              fill="currentColor"
            />
          </svg>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <h3 className="text-sm font-semibold">{scenario.title}</h3>
        {scenario.theory && (
          <p className="text-xs text-muted-foreground">{scenario.theory}</p>
        )}
        <p className="mt-2 text-xs whitespace-pre-line">
          {scenario.description}
        </p>
        {scenario.thresholds && (
          <p className="mt-2 text-xs">{scenario.thresholds}</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

export default Info