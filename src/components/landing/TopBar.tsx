import Image from "next/image";
import Link from "next/link";
import { MAILTO } from "@/lib/landing/tokens";

export function TopBar() {
  return (
    <header className="rg-bar">
      <div className="rg-bar-in">
        <Link href="/" className="rg-bar-brand">
          <Image src="/icon-white-transparent.svg" alt="" width={22} height={22} />
          <span>RavenGraph</span>
        </Link>
        <span className="rg-bar-tag">A world model of markets</span>
        <nav className="rg-bar-nav">
          <Link href="/#architecture" className="rg-bar-wide">Architecture</Link>
          <Link href="/notes">Notes</Link>
          <a href={MAILTO}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
