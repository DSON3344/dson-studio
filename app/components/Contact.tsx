"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-8 max-w-3xl mx-auto relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-10 rounded-2xl"
      >
        <h2 className="text-3xl font-bold mb-8 neon-text-cyan">START A PROJECT</h2>
        
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Name" className="bg-black/50 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition-colors" />
            <input type="email" placeholder="Email" className="bg-black/50 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition-colors" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Project Type" className="bg-black/50 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition-colors" />
            <input type="text" placeholder="Budget" className="bg-black/50 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition-colors" />
          </div>
          <textarea placeholder="Message" rows={5} className="bg-black/50 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition-colors resize-none" />
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 py-4 px-8 bg-cyan-600/20 border border-cyan-500 text-cyan-400 font-bold tracking-widest rounded-lg hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] relative overflow-hidden group"
          >
            {/* Holographic scanning line effect */}
            <span className="absolute inset-0 w-full h-[2px] bg-white/50 animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
            INITIATE PROJECT
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}