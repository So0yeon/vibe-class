"use client";

import Link from "next/link";
import { useState } from "react";
import { AboutModal } from "@/components/AboutModal";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import type { AboutContent } from "@/lib/about";

const INSTAGRAM_URL = "https://www.instagram.com/vibeclas.s/";

type Props = {
  about: AboutContent;
};

export function HeaderActions({ about }: Props) {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <div className="mt-1 flex shrink-0 items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          className="group relative overflow-hidden rounded-xl border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-500/40 hover:text-violet-200 hover:shadow-[0_0_20px_-6px_rgba(167,139,250,0.45)] sm:px-4 sm:text-sm"
        >
          <span
            aria-hidden
            className="absolute inset-0 translate-y-full bg-gradient-to-r from-violet-600/20 to-cyan-600/20 transition duration-300 group-hover:translate-y-0"
          />
          <span className="relative">제작자 소개</span>
        </button>

        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Vibe Class 인스타그램"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/60 bg-slate-800/60 text-slate-400 transition hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-400 hover:shadow-[0_0_20px_-6px_rgba(236,72,153,0.5)] sm:h-11 sm:w-11"
        >
          <InstagramIcon className="h-5 w-5" />
        </Link>
      </div>

      <AboutModal
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        about={about}
      />
    </>
  );
}
