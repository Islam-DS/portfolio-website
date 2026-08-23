import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Education } from "@/sections/Education";
import { Experience } from "@/sections/Experience";
import { Projects } from "@/sections/Projects";
import { Publications } from "@/sections/Publications";
import { Contact } from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Experience />
      <Projects />
      <Publications />
      <Contact />
    </>
  );
}
