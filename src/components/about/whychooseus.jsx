'use client'

import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { 
  Leaf, 
  Recycle, 
  FlaskConical, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react'

const pillars = [
  {
    num: '01',
    title: '100% Herbal & Pure',
    badge: 'Toxin-Free',
    description: 'Crafted with potent wildcrafted botanicals and cold-pressed plant oils. Completely free from harmful parabens, sulfates, silicones, and artificial additives.',
    icon: Leaf,
    feature: 'Safe for daily ritual'
  },
  {
    num: '02',
    title: 'Sustainably Sourced',
    badge: 'Earth-First',
    description: 'Committed to circular sustainability through zero-waste wild harvesting, cruelty-free processes, and fully recyclable, eco-conscious packaging.',
    icon: Recycle,
    feature: '100% Recyclable'
  },
  {
    num: '03',
    title: 'Scientifically Proven',
    badge: 'Clinically Tested',
    description: 'Merging multi-century Ayurvedic herbal lore with modern dermatological rigor to deliver visible, long-lasting glow without adverse skin reactions.',
    icon: FlaskConical,
    feature: 'Dermatologically safe'
  },
  {
    num: '04',
    title: 'Community Uplift',
    badge: 'Fair Trade',
    description: 'Direct partnerships with native Indian smallholder farmers and traditional herb gatherers, guaranteeing fair wages and empowering local livelihoods.',
    icon: HeartHandshake,
    feature: 'Empowering farmers'
  },
]

function WhyChooseUs() {
  const prefersReduced = useReducedMotion()

  const fadeIn = {
    hidden: prefersReduced ? {} : { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  }

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 bg-[#fbfdfc] border-t border-emerald-100/60 overflow-hidden text-gray-900">
      
      {/* Soft Ambient Herbal Backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-green-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              The ARNA Difference
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-[1.15]">
            Why Choose <span className="italic font-normal text-emerald-700">ARNA</span> Skin Care?
          </h2>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            Discover the natural difference: thoughtfully formulated products that place your skin’s long-term wellness and our planet first.
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-600 to-transparent mx-auto mt-6" />
        </motion.div>

        {/* 4 Pillars Grid (Mamaearth / Forest Essentials style) */}
        <div className="grid gap-6 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={prefersReduced ? {} : { opacity: 0, y: 25 }}
                whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={prefersReduced ? {} : { y: -6 }}
                className="relative rounded-3xl bg-white border border-emerald-100/90 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group overflow-hidden"
              >
                {/* Subtle Card Tint on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Top Section */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors mb-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light mb-6">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Feature */}
                <div className="relative z-10 pt-4 border-t border-emerald-50 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{pillar.feature}</span>
                  </div>

                  <span className="text-xs font-bold text-gray-300 group-hover:text-emerald-400 transition-colors">
                    {pillar.num}
                  </span>
                </div>

                {/* Hover Accent Line at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
              </motion.div>
            )
          })}
        </div>

        {/* Clean Beauty Pledge Callout Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mt-14 sm:mt-18 rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white p-6 sm:p-8 md:p-10 shadow-xl shadow-emerald-950/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative overflow-hidden"
        >
          {/* Subtle botanical glow */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-white mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>Our Toxin-Free Pledge</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium text-white leading-tight">
              Pure Ingredients. Tangible Results. Zero Side Effects.
            </h4>
            <p className="text-xs sm:text-sm text-white/80 font-light mt-2 leading-relaxed">
              Every ARNA formulation undergoes thorough testing to ensure it is gentle, restorative, and safe for all skin types.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-emerald-900 font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default memo(WhyChooseUs)


