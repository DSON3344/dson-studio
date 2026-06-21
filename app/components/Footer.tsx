"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#050508] py-8 px-12 md:px-24">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Footer Logo */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-widest text-white">DSON</span>
          <span className="text-xs font-light tracking-widest text-gray-400 mt-1">STUDIO</span>
        </div>
        
        {/* Copyright text */}
        <div className="text-gray-500 font-mono text-[10px] tracking-[0.2em] uppercase">
          © 2026 Dson Studio. All rights reserved.
        </div>
        
        {/* Social Links */}
        <div className="flex gap-8">
          {["Twitter", "Instagram", "LinkedIn", "Behance"].map((social) => (
            <Link 
              key={social} 
              href="#" 
              className="text-gray-500 hover:text-cyan-400 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors"
            >
              {social}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  );
}