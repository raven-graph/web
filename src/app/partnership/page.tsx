"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Placeholder imports - will be implemented in next steps
import { PartnershipHero } from "@/components/partnership/PartnershipHero";
import { TheGap } from "@/components/partnership/TheGap";
import { PartnershipModel } from "@/components/partnership/PartnershipModel";
import { CoInvestment } from "@/components/partnership/CoInvestment";
import { UnderTheHood } from "@/components/partnership/UnderTheHood";
import { TargetProfile } from "@/components/partnership/TargetProfile";
import { PartnershipContact } from "@/components/partnership/PartnershipContact";

const RavenLogo = ({ className }: { className?: string }) => (
    <div className={`relative ${className} `}>
        <Image
            src="/icon-white-transparent.svg"
            alt="RavenGraph"
            fill
            className="object-contain"
            style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)" }}
        />
    </div>
);

export default function PartnershipPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white font-sans selection:bg-[#B066FF]/30">
            {/* Navbar - Simplified for Partnership Page */}
            <nav className="fixed top-0 w-full z-50 bg-[#0B0C15]/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <RavenLogo className="w-8 h-8" />
                        <span className="font-display font-bold text-xl tracking-tight text-white">RavenGraph</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-sans font-medium text-zinc-400 hover:text-[#B066FF] transition-colors">Home</Link>
                        <a href="#how-it-works" className="text-sm font-sans font-medium text-zinc-400 hover:text-[#B066FF] transition-colors">How It Works</a>
                        <a href="#why-partner" className="text-sm font-sans font-medium text-zinc-400 hover:text-[#B066FF] transition-colors">Why Partner</a>
                        <a href="#the-model" className="text-sm font-sans font-medium text-zinc-400 hover:text-[#B066FF] transition-colors">The Model</a>
                        <a href="#contact" className="text-sm font-sans font-medium text-zinc-400 hover:text-[#B066FF] transition-colors">Contact</a>
                    </div>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-20 z-40 bg-[#0B0C15] border-b border-white/10 p-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 font-display text-xl">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                            <a href="#why-partner" onClick={() => setMobileMenuOpen(false)}>Why Partner</a>
                            <a href="#the-model" onClick={() => setMobileMenuOpen(false)}>The Model</a>
                            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                <PartnershipHero />
                <TheGap />
                <PartnershipModel />
                <CoInvestment />
                <UnderTheHood />
                <TargetProfile />
                <PartnershipContact />

                {/* Footer */}
                <footer className="bg-[#05060A] py-20 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="flex items-center gap-2">
                            <RavenLogo className="w-6 h-6" />
                            <span className="font-display font-bold text-lg tracking-tight text-white">RavenGraph</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-zinc-600 font-mono">
                            <a href="mailto:hello@ravengraph.com" className="hover:text-[#B066FF] transition-colors">hello@ravengraph.com</a>
                            <p>© 2026 RavenGraph</p>

                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
