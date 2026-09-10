"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Linkedin,
  Leaf,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import Link from "next/link";

const Footer = () => {
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [showPing, setShowPing] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Show ping animation for 5 seconds every 10 minutes
    const interval = setInterval(() => {
      setShowPing(true);
      setTimeout(() => {
        setShowPing(false);
      }, 5000); // Hide after 5 seconds
    }, 600000); // 10 minutes = 600000ms

    // Initial timeout to hide the first ping after 5 seconds
    const initialTimeout = setTimeout(() => {
      setShowPing(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter submission
    console.log("Newsletter subscription for:", email);
    setEmail("");
    alert("Thank you for subscribing to our journey!");
  };

  return (
    <>
      {/* Sticky WhatsApp Button */}
      <motion.a
        href="https://wa.me/919087242221"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9999]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        onMouseEnter={() => setWhatsappHovered(true)}
        onMouseLeave={() => setWhatsappHovered(false)}
      >
        <div className="relative">
          {/* Pulse */}
          {showPing && (
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75 z-0" />
          )}

          <motion.div
            className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg hover:shadow-2xl flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaWhatsapp className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </motion.div>

          {whatsappHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-20"
            >
              Chat with us on WhatsApp
            </motion.div>
          )}
        </div>
      </motion.a>

      {/* Footer */}
      <footer className="relative w-full overflow-hidden bg-[#1e5e3f]">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#14422c] via-[#1e5e3f] to-[#14422c]" />

        {/* Subtle Brand Glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(183,127,107,0.2), transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(197,160,89,0.15), transparent 50%)
            `,
          }}
        />

        <div className="relative z-10 text-white/90 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">



            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16 md:mb-10">

              {/* Brand Section */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <Link href="/" className="inline-block">
                    <h3 className="font-serif text-4xl tracking-widest text-[#c5a059]">ARNA</h3>
                  </Link>
                  <p className="text-white/60 text-base leading-relaxed font-light">
                    Elevating your natural beauty through the perfect harmony of ancient wisdom and modern skincare science. Handcrafted with intention in India.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-[#c5a059] uppercase tracking-[0.3em] font-semibold">Connect with us</p>
                  <div className="flex gap-4">
                    {[
                      { Icon: Facebook, href: "https://www.facebook.com/arnaworld7?rdid=9mz9GEMLIAYLUswZ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Fy6At4Kad%2F" },
                      { Icon: Instagram, href: "https://www.instagram.com/arna.skincare_?igsh=MWY3enB4NDNnZzM2ZQ%3D%3D" },

                    ].map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -4, scale: 1.1 }}
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#b77f6b] hover:border-[#b77f6b] transition-all duration-500"
                      >
                        <social.Icon className="w-5 h-5 text-white/80" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Column 1 */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c5a059] mb-10">Shop</h4>
                <ul className="space-y-5 text-base font-light">
                  <li><Link href="/products?category=face-washes" className="text-white/60 hover:text-[#b77f6b] transition-all">Face Washes</Link></li>
                  <li><Link href="/products?category=serums" className="text-white/60 hover:text-[#b77f6b] transition-all">Serums</Link></li>
                  <li><Link href="/products?category=shampoos" className="text-white/60 hover:text-[#b77f6b] transition-all">Hair Care</Link></li>
                  <li><Link href="/products?category=soaps" className="text-white/60 hover:text-[#b77f6b] transition-all">Artisanal Soaps</Link></li>
                  <li><Link href="/products" className="text-white/60 hover:text-[#b77f6b] transition-all underline decoration-white/20 underline-offset-4">Browse All</Link></li>
                </ul>
              </div>

              {/* Navigation Column 2 */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c5a059] mb-10">Information</h4>
                <ul className="space-y-5 text-base font-light">
                  <li><Link href="/about" className="text-white/60 hover:text-[#b77f6b] transition-all">Our Story</Link></li>
                  <li><Link href="/contact" className="text-white/60 hover:text-[#b77f6b] transition-all">Contact Us</Link></li>
                  <li><Link href="/faq" className="text-white/60 hover:text-[#b77f6b] transition-all">FAQs</Link></li>
                  <li><Link href="/shipping" className="text-white/60 hover:text-[#b77f6b] transition-all">Shipping Policy</Link></li>
                  <li><Link href="/returns" className="text-white/60 hover:text-[#b77f6b] transition-all">Returns & Refunds</Link></li>
                </ul>
              </div>

              {/* Contact & Trust */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c5a059]">Reach Us</h4>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <a href="mailto:official@arnaskincare.in" className="text-base hover:text-[#b77f6b] transition-colors border-b border-white/10 pb-1 w-fit">official@arnaskincare.in</a>
                      <a href="tel:+919087242221" className="text-lg hover:text-[#b77f6b] transition-colors font-medium tracking-wide">+91 9087242221</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                {/* Copyright */}
                <div className="text-[11px] uppercase tracking-[0.3em] text-white/30 text-center md:text-left">
                  © 2026 ARNA . ALL RIGHTS RESERVED. <br className="md:hidden" />
                  <span className="hidden md:inline mx-2">|</span>
                  CRAFTED WITH INTENTION FOR CONSCIOUS LIVING 🌿
                </div>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
