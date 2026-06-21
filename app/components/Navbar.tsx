"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  // State to track if the page has been scrolled
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener to toggle the glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      // Dynamically apply background and padding based on scroll state
      className={`fixed top-0 w-full z-50 px-10 flex justify-between items-center transition-all duration-500 ${
        isScrolled 
          ? "bg-[#050508]/85 backdrop-blur-md border-b border-white/10 py-4 shadow-lg" 
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      {/* Top Left: Logo and Brand Name */}
      <div className="flex items-center gap-4 cursor-pointer">
        <Image 
          src="/Logo_Colour.png" 
          alt="DSON Studio Logo" 
          width={32} 
          height={32} 
          className="object-contain"
        />
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-widest text-white">DSON</span>
          <span className="text-sm font-light tracking-widest text-gray-400 mt-1">STUDIO</span>
        </div>
      </div>

      {/* Top Right: Minimalist Menu */}
      <div className="flex items-center gap-4 cursor-pointer group">
        <span className="text-sm font-medium tracking-widest text-white group-hover:text-cyan-400 transition-colors">MENU</span>
        <Menu className="text-white group-hover:text-cyan-400 transition-colors" size={28} />
      </div>
    </motion.nav>
  );
}