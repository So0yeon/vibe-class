"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { AboutContent } from "@/lib/about";

type Props = {
  open: boolean;
  onClose: () => void;
  about: AboutContent;
};

export function AboutModal({ open, onClose, about }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="about-modal-root fixed inset-0 z-[9999] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="닫기"
        className="about-modal-backdrop absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        className="about-modal-panel relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-600/50 bg-slate-900/95 shadow-[0_0_60px_-12px_rgba(34,211,238,0.25)] backdrop-blur-xl sm:rounded-3xl"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-600/15 blur-3xl"
        />

        <div className="relative flex items-center justify-between border-b border-slate-700/50 px-5 py-4 sm:px-6">
          <p className="font-mono text-[10px] tracking-[0.2em] text-cyan-500/80 uppercase">
            About Creator
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-600/60 text-slate-400 transition hover:border-slate-500 hover:bg-slate-800 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="relative overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
            {about.profileImage ? (
              <div className="about-modal-avatar relative mb-5 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-cyan-500/30 shadow-[0_0_24px_-6px_rgba(34,211,238,0.4)] sm:mb-0">
                <Image
                  src={about.profileImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="about-modal-avatar mb-5 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 text-3xl sm:mb-0">
                🐙
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h2
                id="about-modal-title"
                className="bg-gradient-to-r from-white via-slate-200 to-cyan-200/90 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl"
              >
                {about.title}
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {about.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className="about-modal-paragraph text-sm leading-relaxed text-slate-400 sm:text-base"
                style={{ animationDelay: `${120 + index * 80}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="relative border-t border-slate-700/50 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-2.5 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_-6px_rgba(34,211,238,0.35)]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
