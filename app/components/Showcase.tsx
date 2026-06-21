"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export default function Showcase() {
  return (
    <section className="relative w-full min-h-screen bg-[#050508] py-32 px-12 md:px-24 flex items-center justify-center">
      {/* Soft background glow */}
      <div className="absolute left-0 top-1/2 w-[500px] h-[500px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20 items-center z-10">
        
        {/* Left Side: About Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <span className="text-cyan-500 font-mono text-sm tracking-[0.2em] uppercase">About DSON:</span>
          {/* Scaled down text size from lg:text-[5rem] to lg:text-6xl for better proportion */}
          <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.2] uppercase">
            WE DESIGN.<br />
            WE BUILD.<br />
            WE <span className="text-cyan-400">ELEVATE</span> IDEAS.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mt-4 max-w-md font-light">
            DSON Studio is a digital studio crafting immersive experiences, 
            futuristic interfaces, and intelligent solutions for forward-thinking brands.
          </p>
          <button className="mt-8 group flex items-center justify-between w-48 border border-white/20 rounded-full px-6 py-3 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
            <span className="text-xs font-mono tracking-widest text-white group-hover:text-cyan-400">LEARN MORE</span>
            <ArrowUpRight size={16} className="text-white group-hover:text-cyan-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </motion.div>

        {/* Right Side: Massive Project Card */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-[16/10] glass-panel border border-white/10 rounded-[2rem] p-6 flex flex-col group overflow-hidden"
        >
          {/* Top Info */}
          <div className="flex justify-between items-center z-20 text-white/70 font-mono text-xs tracking-widest mb-4 px-2">
            <span>LATEST PROJECT</span>
            <div className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors">
              <span>VIEW ALL WORKS</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Project Image Wrapper */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            <Image 
              src="/bg-city.png" 
              alt="Project Showcase" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            
            {/* Bottom Project Details */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-2 tracking-wide">ECHOES OF TOMORROW</h3>
                <p className="text-gray-300 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase">
                  Branding / Web Experience / 3D
                </p>
              </div>
              <div className="text-cyan-400 font-mono text-xl">
                01 <span className="text-white/30 text-sm">/ 06</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}