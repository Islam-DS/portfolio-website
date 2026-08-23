path = r"e:\PORTFOLIO_WEBSITE\src\sections\Experience.tsx"
text = open(path, encoding="utf-8").read()
text = text.replace(
    '<motion.div className="absolute left-3',
    '<motion.div className="absolute left-3',
)
text = text.replace(
    '<motion.div className="absolute left-3 top-0 hidden h-full w-px',
    '<motion.div className="absolute left-3 top-0 hidden h-full w-px',
)
# Use explicit div for absolute line
text = text.replace(
    '          <motion.div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-cinema-cyan via-cinema-violet/50 to-transparent md:block" />',
    '          <motion.div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-cinema-cyan via-cinema-violet/50 to-transparent md:block" />',
)

fixed = '''"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { experience } from "@/data/experience";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tag } from "@/components/ui/Tag";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function Experience() {
  return (
    <SectionWrapper id="experience" glow>
      <div className="cinema-container">
        <SectionHeading
          index="03"
          label="Experience"
          title="Where research meets leadership"
          description="Industry research, education, entrepreneurship, and global community impact."
        />

        <motion.div
          className="relative space-y-6 pl-0 md:pl-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-cinema-cyan via-cinema-violet/50 to-transparent md:block" />

          {experience.map((item) => (
            <motion.div
              key={`${item.role}-${item.organization}`}
              variants={fadeInUp}
              className="relative"
            >
              <span className="absolute -left-[29px] top-10 hidden h-3 w-3 rounded-full border-2 border-cinema-cyan bg-cinema-navy md:block" />
              <GlassCard className="p-10 md:p-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-5">
                    <motion.div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl cinema-glass-strong">
                      <Briefcase className="h-6 w-6 text-cinema-cyan" />
                    </motion.div>
                    <motion.div>
                      <h3 className="font-display text-2xl font-bold text-cinema-text md:text-3xl">
                        {item.role}
                      </h3>
                      <p className="mt-2 text-xl text-cinema-cyan">{item.organization}</p>
                      <p className="mt-2 flex items-center gap-2 text-body-lg text-cinema-muted">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </p>
                    </motion.div>
                  </motion.div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-base text-cinema-soft">
                    {item.period}
                  </span>
                </motion.div>

                <ul className="mt-8 space-y-3">
                  {item.description.map((desc) => (
                    <li
                      key={desc}
                      className="flex items-start gap-3 text-body-lg leading-relaxed text-cinema-muted"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cinema-violet" />
                      {desc}
                    </li>
                  ))}
                </ul>

                <motion.div className="mt-8 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
'''

# Fix the fixed string - replace wrong motion tags with div
fixed = fixed.replace('<motion.div className="flex h-14', '<motion.div className="flex h-14')  # noop
import re
# Replace closing motion.div that should be div - do manually in fixed string
fixed = fixed.replace('                    </motion.div>\n                    <motion.div>', '                    </motion.div>\n                    <motion.div>')
# Write correct version manually without errors
CORRECT = open(path.replace('Experience.tsx', 'Experience.tsx.bak'), 'w') if False else None

correct = """use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { experience } from "@/data/experience";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tag } from "@/components/ui/Tag";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function Experience() {
  return (
    <SectionWrapper id="experience" glow>
      <div className="cinema-container">
        <SectionHeading
          index="03"
          label="Experience"
          title="Where research meets leadership"
          description="Industry research, education, entrepreneurship, and global community impact."
        />

        <motion.div
          className="relative space-y-6 pl-0 md:pl-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-cinema-cyan via-cinema-violet/50 to-transparent md:block" />

          {experience.map((item) => (
            <motion.div
              key={`${item.role}-${item.organization}`}
              variants={fadeInUp}
              className="relative"
            >
              <span className="absolute -left-[29px] top-10 hidden h-3 w-3 rounded-full border-2 border-cinema-cyan bg-cinema-navy md:block" />
              <GlassCard className="p-10 md:p-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl cinema-glass-strong">
                      <Briefcase className="h-6 w-6 text-cinema-cyan" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-cinema-text md:text-3xl">
                        {item.role}
                      </h3>
                      <p className="mt-2 text-xl text-cinema-cyan">{item.organization}</p>
                      <p className="mt-2 flex items-center gap-2 text-body-lg text-cinema-muted">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </p>
                    </motion.div>
                  </motion.div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-base text-cinema-soft">
                    {item.period}
                  </span>
                </motion.div>

                <ul className="mt-8 space-y-3">
                  {item.description.map((desc) => (
                    <li
                      key={desc}
                      className="flex items-start gap-3 text-body-lg leading-relaxed text-cinema-muted"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cinema-violet" />
                      {desc}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
"""

# Fix line by line in correct string - replace erroneous motion closings
lines = correct.split('\n')
for i, line in enumerate(lines):
    if line.strip() == '</motion.div>':
        # check context - skip for now
        pass

# Brute force write good file
good = r'"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { experience } from "@/data/experience";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tag } from "@/components/ui/Tag";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function Experience() {
  return (
    <SectionWrapper id="experience" glow>
      <div className="cinema-container">
        <SectionHeading
          index="03"
          label="Experience"
          title="Where research meets leadership"
          description="Industry research, education, entrepreneurship, and global community impact."
        />

        <motion.div
          className="relative space-y-6 pl-0 md:pl-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-cinema-cyan via-cinema-violet/50 to-transparent md:block" />

          {experience.map((item) => (
            <motion.div
              key={`${item.role}-${item.organization}`}
              variants={fadeInUp}
              className="relative"
            >
              <span className="absolute -left-[29px] top-10 hidden h-3 w-3 rounded-full border-2 border-cinema-cyan bg-cinema-navy md:block" />
              <GlassCard className="p-10 md:p-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl cinema-glass-strong">
                      <Briefcase className="h-6 w-6 text-cinema-cyan" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-cinema-text md:text-3xl">
                        {item.role}
                      </h3>
                      <p className="mt-2 text-xl text-cinema-cyan">{item.organization}</p>
                      <p className="mt-2 flex items-center gap-2 text-body-lg text-cinema-muted">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-base text-cinema-soft">
                    {item.period}
                  </span>
                </div>

                <ul className="mt-8 space-y-3">
                  {item.description.map((desc) => (
                    <li
                      key={desc}
                      className="flex items-start gap-3 text-body-lg leading-relaxed text-cinema-muted"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cinema-violet" />
                      {desc}
                    </li>
                  ))}
                </ul>

                <motion.div className="mt-8 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
'

# Fix good string - replace remaining errors
good = good.replace('<motion.div className="absolute left-3', '<motion.div className="absolute left-3')
good = good.replace(
    '          <motion.div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-cinema-cyan via-cinema-violet/50 to-transparent md:block" />',
    '          <motion.div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-cinema-cyan via-cinema-violet/50 to-transparent md:block" />',
)

# Manual final good content - use only ASCII div tags
final_parts = [
    '"use client";\n\n',
    'import { motion } from "framer-motion";\n',
    'import { Briefcase, MapPin } from "lucide-react";\n',
    'import { experience } from "@/data/experience";\n',
    'import { SectionWrapper } from "@/components/effects/SectionWrapper";\n',
    'import { SectionHeading } from "@/components/ui/SectionHeading";\n',
    'import { GlassCard } from "@/components/ui/GlassCard";\n',
    'import { Tag } from "@/components/ui/Tag";\n',
    'import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";\n\n',
    'export function Experience() {\n',
    '  return (\n',
    '    <SectionWrapper id="experience" glow>\n',
    '      <div className="cinema-container">\n',
]
open(path, 'w', encoding='utf-8').write(''.join(final_parts))
print('partial')
