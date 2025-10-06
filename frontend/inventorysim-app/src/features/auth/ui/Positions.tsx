"use client"
import * as React from "react"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Positions = ({ position, setPosition }: { position: string; setPosition: React.Dispatch<React.SetStateAction<string>> }) => {
   
   React.useEffect(() => {
     console.log("Selected position:", position)
   }, [position]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
              style={{backgroundColor: "rgb(78 74 145)", color: 'white'}}>{position}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel style={{textAlign: 'center'}}>Registering as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="Student">Student</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Retailer">Retailer</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Planner">Planner</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Other">Other</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Positions