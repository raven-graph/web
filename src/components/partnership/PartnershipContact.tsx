import { submitPartnershipInquiry } from "@/app/actions/contact";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight } from "lucide-react";


function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#B066FF] text-white hover:bg-[#9d4edd] transition-all duration-300 font-mono text-sm uppercase tracking-wide shadow-[0_0_20px_-5px_rgba(176,102,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? "Sending..." : "Send Inquiry"}
            {!pending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </button>
    );
}

export function PartnershipContact() {
    const [state, formAction] = useActionState(submitPartnershipInquiry, {
        success: false,
        message: "",
    });

    return (
        <section id="contact" className="py-24 relative bg-[#0B0C15] mb-20">
            <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                <ScrollReveal>
                    <div className="mb-12">
                        <span className="block text-[#B066FF] font-mono text-xs tracking-widest mb-6 uppercase">
                            007 / Partnership Inquiry
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display leading-tight italic text-zinc-100 mb-6">
                            We&apos;re speaking with a small number of fund managers this quarter.
                        </h2>
                        <p className="text-zinc-300 font-mono text-sm max-w-xl mx-auto">
                            If you run an emerging fund and are looking for a structural edge in your strategy — not a data subscription, a real partnership — we&apos;d like to hear from you.
                        </p>
                    </div>

                    {state.success ? (
                        <div className="max-w-md mx-auto p-8 bg-[#151725] border border-[#B066FF]/30 rounded-lg">
                            <h3 className="text-xl font-display text-white mb-4">Inquiry Received</h3>
                            <p className="text-zinc-300 font-sans">
                                Thank you for your interest. We review every inquiry personally and will get back to you within 48 hours if there&apos;s a potential fit.
                            </p>
                        </div>
                    ) : (
                        <form action={formAction} className="max-w-md mx-auto space-y-4 text-left">
                            <div>
                                <label className="sr-only" htmlFor="fund-name">Fund Name</label>
                                <input
                                    type="text"
                                    id="fund-name"
                                    name="fundName"
                                    placeholder="Fund Name"
                                    className="w-full bg-[#151725] border border-zinc-800 text-white rounded-md px-4 py-3 focus:outline-hidden focus:border-[#B066FF] transition-colors placeholder:text-zinc-600 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="sr-only" htmlFor="name">Your Name & Role</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your Name & Role"
                                    required
                                    className="w-full bg-[#151725] border border-zinc-800 text-white rounded-md px-4 py-3 focus:outline-hidden focus:border-[#B066FF] transition-colors placeholder:text-zinc-600 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="sr-only" htmlFor="email">Work Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Work Email"
                                    required
                                    className="w-full bg-[#151725] border border-zinc-800 text-white rounded-md px-4 py-3 focus:outline-hidden focus:border-[#B066FF] transition-colors placeholder:text-zinc-600 font-mono text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <select name="aum" defaultValue="" className="w-full bg-[#151725] border border-zinc-800 text-zinc-400 rounded-md px-4 py-3 focus:outline-hidden focus:border-[#B066FF] transition-colors font-mono text-sm appearance-none">
                                    <option value="" disabled>AUM Range</option>
                                    <option value="<50M">&lt;$50M</option>
                                    <option value="50-200M">$50M – $200M</option>
                                    <option value="200-500M">$200M – $500M</option>
                                    <option value="500M+">$500M+</option>
                                </select>

                                <select name="strategy" defaultValue="" className="w-full bg-[#151725] border border-zinc-800 text-zinc-400 rounded-md px-4 py-3 focus:outline-hidden focus:border-[#B066FF] transition-colors font-mono text-sm appearance-none">
                                    <option value="" disabled>Strategy</option>
                                    <option value="Equities">Equities</option>
                                    <option value="Crypto">Crypto</option>
                                    <option value="Commodities">Commodities</option>
                                    <option value="Multi-strat">Multi-strat</option>
                                </select>
                            </div>


                            <div>
                                <label className="sr-only" htmlFor="note">Brief Note</label>
                                <textarea
                                    id="note"
                                    name="note"
                                    rows={4}
                                    placeholder="Brief Link or Note (Optional)"
                                    className="w-full bg-[#151725] border border-zinc-800 text-white rounded-md px-4 py-3 focus:outline-hidden focus:border-[#B066FF] transition-colors placeholder:text-zinc-600 font-mono text-sm resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <SubmitButton />
                            </div>

                            {state.message && !state.success && (
                                <p className="text-red-400 text-xs text-center font-mono">{state.message}</p>
                            )}

                            <p className="text-center text-zinc-600 text-[10px] font-mono mt-4">
                                We respond to every inquiry within 48 hours. <br />
                                No pitch decks. No sales process. Just a conversation.
                            </p>

                        </form>
                    )}

                </ScrollReveal>
            </div>
        </section>
    );
}

