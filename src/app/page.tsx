import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/sections/About";
import { Events } from "@/components/sections/Events";
import { Projects } from "@/components/sections/Projects";
import { Team } from "@/components/sections/Team";
import { Resources } from "@/components/sections/Resources";
import { Join } from "@/components/sections/Join";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Events />
        <Projects />
        <Team />
        <Resources />
        <Join />
      </main>
      <Footer />
    </>
  );
}
