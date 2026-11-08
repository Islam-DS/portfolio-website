import { Hero } from "@/sections/Hero";
import { Research } from "@/sections/Research";
import { Education } from "@/sections/Education";
import { Experience } from "@/sections/Experience";
import { Volunteering } from "@/sections/Volunteering";
import { Projects } from "@/sections/Projects";
import { Publications } from "@/sections/Publications";
import { Contact } from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Research />
      <Education />
      <Experience />
      <Volunteering />
      <Projects />
      <Publications />
      <Contact />
    </>
  );
}
