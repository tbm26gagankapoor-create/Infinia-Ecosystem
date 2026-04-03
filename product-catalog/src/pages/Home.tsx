import { motion } from 'motion/react'
import { ProductStackDiagram } from '@/components/ProductStackDiagram'
import { InfiniaLogo } from '@/components/InfiniaLogo'
import { stagger } from '@/lib/constants'

export default function Home() {
  return (
    <div className="space-y-6">
      <motion.div {...stagger(0)} className="flex flex-col items-center pt-6 pb-2">
        <InfiniaLogo size={48} />
        <h1 className="text-3xl font-bold text-foreground mt-3 tracking-wide uppercase">Infinia Technologies</h1>
        <p className="text-base text-muted-foreground mt-2">Our complete product portfolio across cloud, AI, and platform services</p>
      </motion.div>

      <motion.div {...stagger(1)}>
        <ProductStackDiagram />
      </motion.div>
    </div>
  )
}
