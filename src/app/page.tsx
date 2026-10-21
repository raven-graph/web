import { FONT } from "@/lib/landing/tokens";
import { TopBar } from "@/components/landing/TopBar";
import { Hero } from "@/components/landing/Hero";
import { ShockSimulator } from "@/components/landing/ShockSimulator";
import { BlindSpot } from "@/components/landing/BlindSpot";
import { Product } from "@/components/landing/Product";
import { Status } from "@/components/landing/Status";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
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
      <Product />
      <Status />
      <Footer />
    </div>
  );
}
