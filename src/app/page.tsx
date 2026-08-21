import { FONT } from "@/lib/landing/tokens";
import { TopBar } from "@/components/landing/TopBar";
import { Hero } from "@/components/landing/Hero";
import { ShockSimulator } from "@/components/landing/ShockSimulator";
import { BlindSpot } from "@/components/landing/BlindSpot";
import { AiNative } from "@/components/landing/AiNative";
import { Status } from "@/components/landing/Status";
import { LatestNote } from "@/components/landing/LatestNote";
import { Footer } from "@/components/landing/Footer";
import { getAllNotes } from "@/lib/notes";

export default function LandingPage() {
  const [latestNote] = getAllNotes();
  return (
    <div
      style={{
        background: "#0B0C11",
        color: "#ECEDF1",
        fontFamily: FONT.sans,
        minHeight: "100vh",
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <TopBar />
      <Hero />
      <ShockSimulator />
      <BlindSpot />
      <AiNative />
      <Status />
      {latestNote && <LatestNote note={latestNote} />}
      <Footer />
    </div>
  );
}
