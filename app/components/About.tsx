"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative py-32 px-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0085FF]/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center z-10"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
          WE DESIGN.<br />
          WE BUILD.<br />
          WE <span className="text-[#0085FF] neon-text-cyan">ELEVATE</span> IDEAS.
        </h2>
        
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto glass-panel p-8 rounded-2xl border-white/5">
          DSON Studio is a futuristic creative agency specializing in digital experiences, 
          immersive interfaces, branding systems, AI-powered solutions, and multimedia content creation.
        </p>
      </motion.div>
    </section>
  );
}