import { GameGallery } from "@/components/GameGallery";
import { ScrollButtons } from "@/components/ScrollButtons";
import { SiteHeader } from "@/components/SiteHeader";
import { getAboutFromNotion } from "@/lib/about";
import { getGamesFromNotion } from "@/lib/notion";

export default async function Home() {
  let games: Awaited<ReturnType<typeof getGamesFromNotion>> = [];
  let error: string | null = null;

  const about = await getAboutFromNotion();

  try {
    games = await getGamesFromNotion();
  } catch (e) {
    error = e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.";
  }

  return (
    <div
      id="page-top"
      className="relative flex min-h-full flex-col overflow-hidden bg-[#0f172a] text-slate-200"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]"
      />
      <div
        aria-hidden
        className="bg-tech-grid pointer-events-none absolute inset-0 opacity-60"
      />

      <SiteHeader about={about} />

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300 shadow-[0_0_24px_-8px_rgba(239,68,68,0.3)]"
          >
            {error}
          </div>
        ) : games.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-600/50 bg-slate-800/30 px-6 py-16 text-center text-sm text-slate-500">
            공개된 게임이 없습니다. Notion에서 공개여부를 켠 항목만 표시됩니다.
          </p>
        ) : (
          <GameGallery games={games} />
        )}
      </main>

      <div id="page-bottom" className="h-px shrink-0" aria-hidden />
      <ScrollButtons />
    </div>
  );
}
