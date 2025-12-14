import { motion } from "framer-motion"
import { Star } from "lucide-react"

const FooterHome = () => {
  return (
    <>
    {/* Footer section*/}
        {/* Mobile footer */}
        <div className="md:hidden flex flex-col items-center gap-4 pb-6">
        <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 fill-current"
            aria-label="GitHub repository"
            >
            <title>GitHub Repo RetailOps</title>
            <path d="M18.906.614a3.4 3.4 0 0 0-.896.127c-.955.262-1.824.76-2.646 1.302" />
            </svg>

            <span>GitHub Repo</span>

            <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
            <Star className="w-3 h-3" />
            ★ ★ ★
            </span>
        </motion.a>
        </div>

        <div className="flex justify-center pb-4">
        <p className="
            text-[11px]
            sm:text-xs
            md:text-sm
            text-muted-foreground
            tracking-wide
        ">
            © {new Date().getFullYear()} RetailOps Sim - Inventory Simulator · Built for learning and experimentation
        </p>
        </div>
    </>
  )
}

export default FooterHome