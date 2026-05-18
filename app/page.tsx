import { GameCard } from "@/components/GameCard";
import { getGamesFromNotion } from "@/lib/notion";

export default async function Home() {
  let games: Awaited<ReturnType<typeof getGamesFromNotion>> = [];
  let error: string | null = null;

  try {
    games = await getGamesFromNotion();
  } catch (e) {
    error = e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.";
  }

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0f172a] text-slate-200">
      {/* 앰비언트 글로우 */}
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

      <header className="relative border-b border-slate-700/50 bg-slate-900/40 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 font-mono text-xs tracking-widest text-cyan-400/90 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            Vibe Coding × 초등 수업
          </div>

          <h1 className="bg-gradient-to-r from-white via-slate-200 to-cyan-200/90 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Vibe Class
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            바이브코딩으로 만든 초등학교 수업자료 게임을 모아 둔
            <span className="text-slate-300"> 디지털 아카이브</span>입니다.
          </p>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300 shadow-[0_0_24px_-8px_rgba(239,68,68,0.3)]"
          >
            {error}
          </div>
        ) : games.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-600/50 bg-slate-800/30 px-6 py-16 text-center text-slate-500">
            공개된 게임이 없습니다. Notion에서 체크박스를 켠 항목만 표시됩니다.
          </p>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <p className="font-mono text-xs tracking-widest text-slate-500 uppercase">
                Archive
              </p>
              <p className="text-sm text-slate-400">
                총{" "}
                <span className="font-semibold text-cyan-400">
                  {games.length}
                </span>
                개의 수업 게임
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {games.map((game) => (
                <li key={game.id} className="h-full">
                  <GameCard game={game} />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>

      <footer className="relative border-t border-slate-700/50 py-10 text-center">
        <p className="font-mono text-xs tracking-wider text-slate-600">
          © {new Date().getFullYear()} Vibe Class
        </p>
      </footer>
    </div>
  );
}
