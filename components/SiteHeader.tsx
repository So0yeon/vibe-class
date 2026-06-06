import { HeaderActions } from "@/components/HeaderActions";
import type { AboutContent } from "@/lib/about";

type Props = {
  about: AboutContent;
};

export function SiteHeader({ about }: Props) {
  return (
    <header className="relative border-b border-slate-700/50 bg-slate-900/40 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 font-mono text-[11px] tracking-widest text-cyan-400/90 uppercase sm:text-xs">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              Vibe Coding × Class
            </div>

            <h1 className="bg-gradient-to-r from-white via-slate-200 to-cyan-200/90 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
              Vibe Class
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:mt-4 sm:text-base">
              초등교사가 직접 만든 바이브코딩 웹앱 수업자료 아카이브
            </p>
          </div>

          <HeaderActions about={about} />
        </div>
      </div>
    </header>
  );
}
