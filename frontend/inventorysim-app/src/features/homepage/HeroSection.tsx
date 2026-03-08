import { Button} from "@/components/ui/Button"
import { motion } from "framer-motion"
import HoverCard from "../animation/HoverCard"
import GitHubCTA from "./GitHubCTA"
import { useNavigate } from "react-router-dom"

const HeroSection = () => {
  const navigate = useNavigate();
  return (
     <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center px-6 py-20 sm:py-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10">
        
        {/* Left: Hero + Buttons + GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center space-y-6 sm:space-y-10 text-center md:text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Inventory decisions,
            <span className="block text-primary">without the guesswork</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto md:mx-0">
            A small but powerful simulation tool to explore EOQ, Newsvendor,
            ABC analysis, and smart replenishment strategies for real-world
            supply chains.
          </p>

          {/* Buttons */}
          <div className="flex justify-center md:justify-center gap-4 flex-wrap">
            <Button 
             size="lg"
             className="toolbar-element jbtn-flat-btn toolbar-element-md active"
             onClick={() => navigate("/dashboard")}
             >Start Simulation</Button>
            <Button 
             size="lg"
             variant="outline"
             className="toolbar-element jbtn-flat-btn toolbar-element-md active"
             onClick={() => navigate("/get-help?query=start")}
             >Learn More</Button>
          </div>

          {/* GitHub CTA */}
          <div className="flex justify-center md:justify-center mt-4">
            <GitHubCTA />
          </div>
        </motion.div>

        {/* Right: Feature Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <HoverCard
            title="EOQ & Costs"
            description="Visualize ordering and holding costs to find optimal order quantities."
          />
          <HoverCard
            title="Newsvendor"
            description="Experiment with demand uncertainty and critical ratios."
          />
          <HoverCard
            title="ABC Analysis"
            description="Classify products and focus where inventory matters most."
          />
          <HoverCard
            title="Built for Learning"
            description="Designed to explain the why, not just the numbers."
          />
        </motion.div>

      </div>
    </div>
  )
}

export default HeroSection