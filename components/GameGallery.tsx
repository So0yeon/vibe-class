"use client";

import { useMemo, useState } from "react";
import { GameCard } from "@/components/GameCard";
import { extractSubjects, type GameItem } from "@/lib/notion";

type Props = {
  games: GameItem[];
};

export function GameGallery({ games }: Props) {
  const subjects = useMemo(() => extractSubjects(games), [games]);
  const [activeSubject, setActiveSubject] = useState<string>("전체");

  const filteredGames = useMemo(() => {
    if (activeSubject === "전체") return games;
    return games.filter((game) => game.tags.includes(activeSubject));
  }, [games, activeSubject]);

  return (
    <>
      {subjects.length > 0 && (
        <nav
          aria-label="과목 필터"
          className="mb-8 flex flex-wrap gap-2 sm:gap-2.5"
        >
          <FilterButton
            label="전체"
            count={games.length}
            isActive={activeSubject === "전체"}
            onClick={() => setActiveSubject("전체")}
          />
          {subjects.map((subject) => (
            <FilterButton
              key={subject}
              label={subject}
              count={games.filter((g) => g.tags.includes(subject)).length}
              isActive={activeSubject === subject}
              onClick={() => setActiveSubject(subject)}
            />
          ))}
        </nav>
      )}

      <div className="mb-6 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] tracking-widest text-slate-500 uppercase">
          Archive
        </p>
        <p className="text-sm text-slate-400">
          {activeSubject === "전체" ? (
            <>
              총{" "}
              <span className="font-semibold text-cyan-400">
                {filteredGames.length}
              </span>
              개
            </>
          ) : (
            <>
              <span className="text-slate-300">{activeSubject}</span>{" "}
              <span className="font-semibold text-cyan-400">
                {filteredGames.length}
              </span>
              개
            </>
          )}
        </p>
      </div>

      {filteredGames.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-600/50 bg-slate-800/30 px-6 py-14 text-center text-sm text-slate-500">
          해당 과목의 수업자료가 없습니다.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {filteredGames.map((game) => (
            <li key={game.id} className="h-full">
              <GameCard game={game} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function FilterButton({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition duration-200 ${
        isActive
          ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-[0_0_16px_-6px_rgba(34,211,238,0.35)]"
          : "border-slate-600/50 bg-slate-800/40 text-slate-400 hover:border-slate-500/60 hover:bg-slate-800/80 hover:text-slate-200"
      }`}
    >
      {label}
      <span
        className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
          isActive
            ? "bg-cyan-500/20 text-cyan-400"
            : "bg-slate-700/60 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
