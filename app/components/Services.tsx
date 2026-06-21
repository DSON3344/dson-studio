"use client";

import { motion } from "framer-motion";
import { MonitorSmartphone, Code2, PenTool, Film, Video, Bot } from "lucide-react";

export default function Services() {
  // Service offerings data
  const services = [
    { title: "UI/UX Design", icon: <MonitorSmartphone size={32} /> },
    { title: "Web Development", icon: <Code2 size={32} /> },
    { title: "Branding Design", icon: <PenTool size={32} /> },
    { title: "Motion Graphics", icon: <Film size={32} /> },
    { title: "Video Editing", icon: <Video size={32} /> },
    { title: "AI Solutions", icon: <Bot size={32} /> },
  ];

  return (
    <section id="services" className="py-24 px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16 neon-text-cyan">OUR SERVICES</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="glass-panel p-8 rounded-xl flex flex-col items-center text-center group transition-all duration-300 hover:neon-border-cyan cursor-pointer"
          >
            <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">{service.title}</h3>
            {/* Expandable content indicator */}
            <div className="w-8 h-1 bg-cyan-500/50 rounded-full mt-auto group-hover:w-16 transition-all duration-300" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}