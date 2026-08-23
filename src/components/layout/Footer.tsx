"use client";

import type { ComponentType } from "react";
import { Github, Linkedin, GraduationCap, Heart } from "lucide-react";
import { siteConfig, navLinks } from "@/data/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-cinema-ink">
      <div className="cinema-container border-t border-white/10 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-[32.4px] font-bold text-white">{siteConfig.name}</p>
            <p className="mt-3 max-w-xs text-[24.3px] text-white/40">{siteConfig.role}</p>
            <div className="mt-6 flex gap-5">
              <SocialLink href={siteConfig.github} icon={Github} label="GitHub" />
              <SocialLink href={siteConfig.linkedin} icon={Linkedin} label="LinkedIn" />
              <SocialLink href={siteConfig.orcid} icon={GraduationCap} label="ORCID" />
              <SocialLink href={siteConfig.whatsapp} icon={WhatsAppIcon} label="WhatsApp" />
            </div>
          </div>
          <div>
            <p className="section-label !text-white/30">Navigate</p>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[24.3px] text-white/40 transition-colors hover:text-white">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label !text-white/30">Research Focus</p>
            <p className="mt-5 text-[24.3px] leading-relaxed text-white/40">
              {siteConfig.keywords.slice(0, 6).join(" · ")}
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-[21.6px] text-white/30">© {year} {siteConfig.name}. All rights reserved.</p>
          <p className="flex items-center gap-2 text-[21.6px] text-white/30">Crafted with intention <Heart className="h-3.5 w-3.5" /></p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: ComponentType<{ className?: string }>; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="text-white/40 transition-colors hover:text-white">
      <Icon className="h-5 w-5" />
    </a>
  );
}
