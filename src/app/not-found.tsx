import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Sketchbook grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative max-w-md w-full p-8 sm:p-10 rounded-[28px] bg-white border-2 border-black shadow-[8px_8px_0_#000] space-y-6 text-center">
        {/* Washi tape stamp */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-200 border border-black/30 text-stone-900 font-mono text-xs font-black uppercase shadow-xs rotate-[-1.5deg]">
          <Compass className="w-3.5 h-3.5" />
          <span>404 // ROUTE DISCONNECTED</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-['Space_Grotesk'] text-5xl sm:text-6xl font-black uppercase tracking-tight text-stone-900">
            PAGE NOT FOUND
          </h1>
          <p className="font-mono text-xs text-stone-500 leading-relaxed pt-1">
            The coordinates you requested do not exist in this sector or access has been restricted.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[5px_5px_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        <div className="text-[10px] font-mono text-stone-400 border-t border-dashed border-stone-200 pt-4">
          ORBITAL INDEX • SECTOR 01
        </div>
      </div>
    </div>
  );
}
