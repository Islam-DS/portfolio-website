import { Hero } from "@/sections/Hero";
import { Education } from "@/sections/Education";
import { Experience } from "@/sections/Experience";
import { Projects } from "@/sections/Projects";
import { Publications } from "@/sections/Publications";
import { Contact } from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Education />
      <Experience />
      <Projects />
      <Publications />
      <Contact />
    </>
  );
}
