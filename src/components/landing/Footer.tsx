import Image from "next/image";
import { MAILTO } from "@/lib/landing/tokens";
import { Arrow } from "./Arrow";

export function Footer() {
  return (
    <footer className="rg-foot">
      <div className="rg-foot-close">
        <div className="rg-wrap">
          <p className="rg-foot-line">If you think markets are a graph, talk to us.</p>
          <a href={MAILTO} className="rg-plate rg-plate-light">
            Talk to the founders <Arrow />
          </a>
        </div>
      </div>
      <div className="rg-foot-bar">
        <div className="rg-wrap rg-foot-bar-in">
          <span className="rg-bar-brand">
            <Image src="/icon-white-transparent.svg" alt="" width={20} height={20} />
            <span>RavenGraph</span>
          </span>
          <a href={MAILTO}>gabriel@ravengraph.com</a>
        </div>
      </div>
    </footer>
  );
}
