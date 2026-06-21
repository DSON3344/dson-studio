import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Showcase from "./components/Showcase";
import Footer from "./components/Footer"; // Import the Footer component

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050508] selection:bg-cyan-500/30">
      <Navbar />
      <Hero />
      <Showcase />
      <Footer /> {/* Add Footer at the bottom */}
    </main>
  );
}