import Image from "next/image";
import { formatGameDate, type GameItem } from "@/lib/notion";

type Props = { game: GameItem };

export function GameCard({ game }: Props) {
  const href = game.url ?? "#";
  const isExternal = Boolean(game.url);
  const formattedDate = formatGameDate(game.date);

  const hasMeta =
    game.grades.length > 0 ||
    game.tags.length > 0 ||
    game.unit.trim() ||
    game.playTime.trim();

  return (
    <article className="card-neon-glow group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-600/50 bg-[#1e293b] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="relative z-10 flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
          {game.thumbnail ? (
            <>
              <Image
                src={game.thumbnail}
                alt={game.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent opacity-80" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <span className="text-5xl opacity-60 transition group-hover:scale-110 group-hover:opacity-90">
                🎮
              </span>
            </div>
          )}

          {game.tags.length > 0 && (
            <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
              {game.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-cyan-500/30 bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {game.tags.length > 2 && (
                <span className="rounded-md border border-slate-500/40 bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 backdrop-blur-sm">
                  +{game.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          {formattedDate && (
            <time
              dateTime={game.date ?? undefined}
              className="font-mono text-[11px] font-medium tracking-wider text-cyan-500/70 uppercase"
            >
              {formattedDate}
            </time>
          )}

          <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-100 transition group-hover:text-white">
            {game.title}
          </h2>

          {hasMeta && (
            <div className="flex flex-col gap-0.5 border-l-2 border-cyan-500/25 pl-3 text-xs leading-relaxed">
              {game.grades.map((grade) => (
                <span key={grade} className="font-medium text-slate-300">
                  {grade}
                </span>
              ))}
              {game.tags.map((tag) => (
                <span key={tag} className="text-slate-400">
                  {tag}
                </span>
              ))}
              {game.unit.trim() && (
                <span className="text-slate-400">{game.unit.trim()}</span>
              )}
              {game.playTime.trim() && (
                <span className="text-slate-400">⏱ {game.playTime.trim()}</span>
              )}
            </div>
          )}

          {game.description && (
            <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
              {game.description}
            </p>
          )}

          <div className="mt-auto flex flex-col gap-2">
            <a
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-disabled={!isExternal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:text-cyan-200 hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500/50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
            >
              {isExternal ? (
                <>
                  게임 열기
                  <span
                    aria-hidden
                    className="transition group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </>
              ) : (
                "준비 중"
              )}
            </a>

            {game.worksheets.map((ws) => (
              <a
                key={ws.url}
                href={ws.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-500/35 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition hover:border-violet-400/50 hover:bg-violet-500/15 hover:text-violet-200 hover:shadow-[0_0_16px_-6px_rgba(167,139,250,0.35)]"
              >
                <span aria-hidden>📄</span>
                <span className="truncate">{ws.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
