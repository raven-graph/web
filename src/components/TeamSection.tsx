"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
  bgGradient: string;
}

const team: TeamMember[] = [
  {
    name: "Gabriel Goulart",
    role: "Co-Founder",
    bio: "Data Scientist & Engineer with 10+ years turning ML and analytics into real products, scaling data-driven startups from 0→1.",
    bgGradient: "from-blue-500/10 to-purple-500/10"
  },
  {
    name: "Skinner Layne",
    role: "Co-Founder",
    bio: "Oxford-trained Applied Mathematician with 10 years architecting ML systems at the edge of math, markets, and signal theory. Former JPMorgan.",
    bgGradient: "from-purple-500/10 to-pink-500/10"
  },
  {
    name: "Mike Osorio",
    role: "Co-Founder",
    bio: "Curating & incubating science and deep tech startups for 12+ years, entrepreneur/founder 20+ years, specialized focus on personnel, governance, and strategy.",
    bgGradient: "from-pink-500/10 to-orange-500/10"
  },
  {
    name: "Sagar Dubey",
    role: "Co-Founder",
    bio: "Engineer turned product leader with 10+ years of experience, now crafting the future of intelligent finance.",
    bgGradient: "from-orange-500/10 to-yellow-500/10"
  }
];

export const TeamSection = () => {
  return (
    <section className="py-24 relative overflow-hidden border-t border-white/5 bg-[#0B0C15]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <ScrollReveal>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-zinc-700"></span>
              <span className="text-zinc-500 font-sans text-xs uppercase tracking-widest font-semibold">Leadership</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
              Engineering & Science DNA
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.1}>
              <div className="group relative h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${member.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-lg`} />
                <div className="relative h-full p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors flex flex-col">

                  <div className="mb-4">
                    <h3 className="text-lg font-display font-bold text-white mb-1">{member.name}</h3>
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{member.role}</div>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed font-light mb-auto">
                    {member.bio}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
