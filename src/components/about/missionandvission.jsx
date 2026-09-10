'use client'

import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  Heart, 
  Target, 
  Eye, 
  CheckCircle2, 
  Check,
  Award,
  Globe2,
  Users
} from 'lucide-react'

// Subtle Botanical Ambient Pattern matching ARNA's clean green theme
const BotanicalBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
    <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl" />
    <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-green-100/30 blur-3xl" />
    <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-emerald-50/50 blur-2xl" />
    <svg 
      className="absolute inset-0 w-full h-full opacity-[0.03]" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="botanical-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#059669" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#botanical-dots)" />
    </svg>
  </div>
)

function MissionVision() {
  const prefersReduced = useReducedMotion()

  const fadeIn = {
    hidden: prefersReduced ? {} : { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  }

  const missionCommitments = [
    {
      title: 'Wildcrafted Botanical Actives',
      desc: 'Formulated with pure plant extracts and healing Ayurvedic herbs directly harvested from nature.'
    },
    {
      title: 'Zero Chemical Compromise',
      desc: '100% free from harsh parabens, sulfates, silicones, and artificial foaming agents.'
    },
    {
      title: 'Honest, Accessible Luxury',
      desc: 'Bringing ceremonial-grade skincare into everyday Indian households at fair, uninflated prices.'
    }
  ]

  const visionPillars = [
    {
      title: 'India’s Most Trusted Herbal Brand',
      desc: 'Setting the gold standard for transparent, dermatologically safe, and conscious natural skincare.'
    },
    {
      title: 'Holistic Skin Confidence',
      desc: 'Empowering every individual to celebrate their healthy, naturally glowing bare skin without fear of side effects.'
    },
    {
      title: 'Eco-Conscious Stewardship',
      desc: 'Preserving our planet with ethical harvesting, cruelty-free testing, and sustainable recyclable packaging.'
    }
  ]

  const trustBadges = [
    { icon: Leaf, title: '100% Herbal Actives', subtitle: 'Clean plant extracts' },
    { icon: ShieldCheck, title: 'Toxin-Free Guarantee', subtitle: 'Zero harmful chemicals' },
    { icon: Heart, title: 'Cruelty-Free & Vegan', subtitle: 'Never tested on animals' },
    { icon: Award, title: 'Ayurvedic Efficacy', subtitle: 'Time-tested results' },
  ]

  return (
    <section className="relative w-full bg-white text-gray-900 py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden">
      <BotanicalBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 mb-4">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Our Foundation & Philosophy
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-[1.15]">
            Rooted in <span className="italic font-normal text-emerald-700">Purity</span>, <br className="hidden sm:inline" />
            Driven by <span className="font-semibold text-gray-900">Purpose</span>
          </h2>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            Inspired by classical Ayurvedic traditions and modern clean beauty ideals, ARNA was founded to bring authentic, chemical-free vitality to your daily routine.
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-600 to-transparent mx-auto mt-6" />
        </motion.div>


        {/* ========================================================= */}
        {/* DUAL EDITORIAL CARDS: MISSION & VISION                    */}
        {/* ========================================================= */}
        <div className="space-y-16 sm:space-y-20 md:space-y-24 mb-16 sm:mb-20">
          
          {/* BLOCK 1: MISSION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeIn}
              className="lg:col-span-6 order-2 lg:order-1"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-950/5 border border-emerald-100 bg-white p-2.5 sm:p-3 group">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-emerald-50">
                  <Image
                    src="/about/mission.png"
                    alt="ARNA Skin Care Mission - Herbal Purity"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />

                  {/* Floating Pill Tag */}
                  <div className="absolute top-4 left-4 backdrop-blur-md bg-white/90 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-900 tracking-wider uppercase">
                      The ARNA Mission
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 backdrop-blur-md bg-white/95 p-4 sm:p-5 rounded-xl border border-white/80 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Pure Botanical Commitment
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-snug font-normal">
                      Bringing the curative purity of natural herbs directly into your daily skincare routine.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeIn}
              className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-[2px] bg-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
                  Mission Statement
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
                Redefining Skincare with Nature at the Core
              </h3>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-light mb-8">
                Our mission is simple yet resolute: to deliver potent, chemical-free skincare formulated with certified natural herbs — so you can achieve healthy, glowing skin without harmful side-effects or luxury price barriers.
              </p>

              {/* Editorial Commitments List (Clean Forest Essentials style) */}
              <div className="space-y-4">
                {missionCommitments.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={prefersReduced ? {} : { opacity: 0, x: 20 }}
                    whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 hover:bg-emerald-50/80 hover:border-emerald-200 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>


          {/* BLOCK 2: VISION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
            
            {/* Content Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeIn}
              className="lg:col-span-6 order-1 lg:order-1 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-[2px] bg-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
                  Our Long-Term Vision
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
                Inspiring a Healthier, Chemical-Free Tomorrow
              </h3>

              <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-emerald-200/80 shadow-sm">
                <p className="font-serif text-lg sm:text-xl text-gray-900 leading-relaxed font-normal italic mb-2">
                  &ldquo;To become India’s most trusted herbal skincare brand, bringing the unadulterated purity of nature into every home.&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                  — ARNA Skincare Founders
                </p>
              </div>

              {/* Vision Pillars List */}
              <div className="space-y-4">
                {visionPillars.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
                    whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-900/5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeIn}
              className="lg:col-span-6 order-2 lg:order-2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-950/5 border border-emerald-100 bg-white p-2.5 sm:p-3 group">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-emerald-50">
                  <Image
                    src="/about/vission.png"
                    alt="ARNA Skin Care Vision - Trusted Herbal Beauty"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />

                  {/* Floating Pill Tag */}
                  <div className="absolute top-4 right-4 backdrop-blur-md bg-white/90 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-md flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-xs font-semibold text-emerald-900 tracking-wider uppercase">
                      Vision For 2030
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 backdrop-blur-md bg-white/95 p-4 sm:p-5 rounded-xl border border-white/80 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Conscious Future
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-snug font-normal">
                      Pioneering the shift toward clean, healthy, and restorative everyday skincare rituals.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Mamaearth / Forest Essentials Style Trust Strip */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="rounded-3xl bg-gradient-to-r from-emerald-50/70 via-green-50/50 to-emerald-50/70 border border-emerald-100 p-6 sm:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon
              return (
                <div key={badge.title} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 group">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors">
                      {badge.title}
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5 font-light">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default memo(MissionVision)


