"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16 neon-text-cyan">FEATURED WORKS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Project Card Example */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ y: -10 }}
          className="glass-panel rounded-2xl overflow-hidden group cursor-pointer relative"
        >
          {/* Reflection overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          
          <div className="relative h-72 w-full bg-gray-900 overflow-hidden">
            {/* Placeholder for future project image */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-mono text-sm group-hover:scale-110 transition-transform duration-700">
              [ IMAGE PLACEHOLDER ]
            </div>
          </div>
          
          <div className="p-8 relative z-20">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
              ECHOES OF TOMORROW
            </h3>
            <p className="text-gray-400 text-sm font-mono tracking-widest">
              Branding / Web Experience / 3D
            </p>
          </div>
        </motion.div>
        
        {/* Blank Placeholder Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl overflow-hidden flex items-center justify-center h-[26rem] border-dashed border-2 border-white/10 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <span className="text-gray-500 font-mono">INCOMING TRANSMISSION...</span>
        </motion.div>
      </div>
    </section>
  );
}