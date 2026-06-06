"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { GameCard } from "@/components/GameCard";
import {
  extractGrades,
  extractSubjects,
  extractUnits,
  filterGames,
  type GameItem,
} from "@/lib/notion";

const PAGE_SIZE = 30;

type Props = {
  games: GameItem[];
};

export function GameGallery({ games }: Props) {
  const subjects = useMemo(() => extractSubjects(games), [games]);
  const grades = useMemo(() => extractGrades(games), [games]);
  const units = useMemo(() => extractUnits(games), [games]);

  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("전체");
  const [activeGrade, setActiveGrade] = useState("전체");
  const [activeUnit, setActiveUnit] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredGames = useMemo(
    () =>
      filterGames(games, {
        search,
        subject: activeSubject,
        grade: activeGrade,
        unit: activeUnit,
      }),
    [games, search, activeSubject, activeGrade, activeUnit],
  );

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));

  const paginatedGames = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredGames.slice(start, start + PAGE_SIZE);
  }, [filteredGames, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeSubject, activeGrade, activeUnit]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasActiveFilters =
    search.trim() !== "" ||
    activeSubject !== "전체" ||
    activeGrade !== "전체" ||
    activeUnit !== "전체";

  const resetFilters = () => {
    setSearch("");
    setActiveSubject("전체");
    setActiveGrade("전체");
    setActiveUnit("전체");
    setCurrentPage(1);
  };

  return (
    <>
      {/* 검색 */}
      <div className="mb-6">
        <label htmlFor="game-search" className="sr-only">
          게임 검색
        </label>
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          >
            🔍
          </span>
          <input
            id="game-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제목·설명으로 검색"
            className="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 py-3 pr-4 pl-10 text-sm text-slate-200 placeholder:text-slate-500 transition focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            autoComplete="off"
          />
        </div>
      </div>

      {/* 적용된 필터 상태 + 초기화 */}
      {hasActiveFilters && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">적용 중:</span>
            {search.trim() && (
              <FilterChip label={`검색 "${search.trim()}"`} />
            )}
            {activeSubject !== "전체" && (
              <FilterChip label={activeSubject} />
            )}
            {activeGrade !== "전체" && <FilterChip label={activeGrade} />}
            {activeUnit !== "전체" && <FilterChip label={activeUnit} />}
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="shrink-0 rounded-lg border border-slate-600/50 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-500 hover:bg-slate-700/50 hover:text-slate-200"
          >
            필터 초기화
          </button>
        </div>
      )}

      {/* 학년 필터 */}
      <FilterGroup label="학년">
        <FilterButton
          label="전체"
          isActive={activeGrade === "전체"}
          onClick={() => setActiveGrade("전체")}
        />
        {grades.map((grade) => (
          <FilterButton
            key={grade}
            label={grade}
            isActive={activeGrade === grade}
            onClick={() => setActiveGrade(grade)}
          />
        ))}
      </FilterGroup>

      {/* 교과 필터 */}
      {subjects.length > 0 && (
        <FilterGroup label="교과">
          <FilterButton
            label="전체"
            isActive={activeSubject === "전체"}
            onClick={() => setActiveSubject("전체")}
          />
          {subjects.map((subject) => (
            <FilterButton
              key={subject}
              label={subject}
              isActive={activeSubject === subject}
              onClick={() => setActiveSubject(subject)}
            />
          ))}
        </FilterGroup>
      )}

      {/* 단원 필터 */}
      {units.length > 0 && (
        <FilterGroup label="단원">
          <FilterButton
            label="전체"
            isActive={activeUnit === "전체"}
            onClick={() => setActiveUnit("전체")}
          />
          {units.map((unit) => (
            <FilterButton
              key={unit}
              label={unit}
              isActive={activeUnit === unit}
              onClick={() => setActiveUnit(unit)}
            />
          ))}
        </FilterGroup>
      )}

      {/* 결과 개수 */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] tracking-widest text-slate-500 uppercase">
          Archive
        </p>
        <p className="text-sm text-slate-400">
          총{" "}
          <span className="font-semibold text-cyan-400">
            {filteredGames.length}
          </span>
          개의 게임
          {totalPages > 1 && (
            <span className="ml-2 text-slate-500">
              ({currentPage}/{totalPages} 페이지)
            </span>
          )}
        </p>
      </div>

      {filteredGames.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-600/50 bg-slate-800/30 px-6 py-14 text-center text-sm text-slate-500">
          조건에 맞는 수업자료가 없습니다.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
            {paginatedGames.map((game) => (
              <li key={game.id} className="h-full">
                <GameCard game={game} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav
              aria-label="페이지 네비게이션"
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              <PaginationButton
                label="이전"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              />
              {getPageNumbers(currentPage, totalPages).map((page, i) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-2 text-slate-500"
                  >
                    …
                  </span>
                ) : (
                  <PaginationButton
                    key={page}
                    label={String(page)}
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page as number)}
                  />
                ),
              )}
              <PaginationButton
                label="다음"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              />
            </nav>
          )}
        </>
      )}
    </>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={`${label} 필터`} className="mb-4 last:mb-6">
      <p className="mb-2 text-xs font-medium text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </nav>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-300">
      {label}
    </span>
  );
}

function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition duration-200 ${
        isActive
          ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-[0_0_16px_-6px_rgba(34,211,238,0.35)]"
          : "border-slate-600/50 bg-slate-800/40 text-slate-400 hover:border-slate-500/60 hover:bg-slate-800/80 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function PaginationButton({
  label,
  onClick,
  disabled = false,
  isActive = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      className={`min-w-[2.5rem] rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        isActive
          ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
          : "border-slate-600/50 bg-slate-800/40 text-slate-400 hover:border-slate-500/60 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function getPageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}
