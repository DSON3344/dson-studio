"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Layers, Maximize, User, Rocket, Mouse } from "lucide-react";

export default function Hero() {
  const [aiText, setAiText] = useState("");
  const fullText = "Welcome to the\nDSON Studio.\nI'm your assistant.\nHow can we build\ntogether today?";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setAiText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Bottom interactive cards data
  const bottomCards = [
    { title: "[ SERVICES ]", sub: "OUR SOLUTIONS", icon: <Layers size={28} /> },
    { title: "[ PORTFOLIO ]", sub: "SELECTED WORKS", icon: <Maximize size={28} /> },
    { title: "[ CONNECT ]", sub: "GET IN TOUCH", icon: <User size={28} /> },
    { title: "[ START PROJECT ]", sub: "LET'S BUILD", icon: <Rocket size={28} /> },
  ];

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden perspective-[1000px]">
      {/* City Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-city.png')" }}
      />
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Center Crystal */}
      <div className="relative z-10 flex flex-col items-center mt-[-5rem]">
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-cyan-500/30 blur-[80px] rounded-full" />
          <Image src="/crystal.png" alt="AI Crystal" width={380} height={480} className="relative z-10 object-contain drop-shadow-[0_0_30px_rgba(0,255,255,0.4)]" />
        </motion.div>
      </div>

      {/* Right Side: Massive AI Panel */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute right-12 top-[15%] glass-panel p-8 rounded-2xl w-96 border-cyan-500/40 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.1)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)" }}>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <h3 className="text-cyan-400/80 font-mono text-xs tracking-[0.2em]">DSON ASSISTANT</h3>
        </div>
        <p className="text-xl text-gray-100 whitespace-pre-line font-mono leading-relaxed h-[180px]">
          {aiText}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-cyan-400 font-bold ml-1">|</motion.span>
        </p>
        <div className="absolute bottom-6 right-6 flex gap-1">
          <div className="w-2 h-2 bg-white/40" />
          <div className="w-2 h-2 bg-white/40" />
          <div className="w-4 h-2 bg-cyan-400" />
        </div>
      </motion.div>

      {/* Bottom 3D Tilted Cards */}
      <div className="absolute bottom-20 z-20 flex gap-6 px-10 w-full justify-center perspective-[1200px]">
        {bottomCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 100, opacity: 0, rotateX: 45 }}
            animate={{ y: 0, opacity: 1, rotateX: 25 }}
            whileHover={{ scale: 1.05, rotateX: 10, y: -10, backgroundColor: "rgba(0, 255, 255, 0.1)" }}
            transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
            className="w-64 h-40 glass-panel border border-cyan-500/30 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.5)] group overflow-hidden relative"
          >
            {/* Top light reflection */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50" />
            
            <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
            <h4 className="text-white font-mono tracking-widest text-sm font-bold mb-1">{card.title}</h4>
            <p className="text-gray-400 text-xs tracking-wider">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Scroll to Explore */}
      <div className="absolute bottom-4 flex flex-col items-center gap-2 text-gray-400 opacity-60">
        <span className="text-[10px] font-mono tracking-[0.2em]">SCROLL TO EXPLORE</span>
        <Mouse size={16} className="animate-bounce" />
      </div>
    </section>
  );
}