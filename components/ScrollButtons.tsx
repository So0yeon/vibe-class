"use client";

export function ScrollButtons() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    const bottom = document.getElementById("page-bottom");
    if (bottom) {
      bottom.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 sm:bottom-6 sm:right-6"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="페이지 최상단으로 이동"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/60 bg-slate-900/90 text-slate-300 shadow-lg backdrop-blur-sm transition hover:border-cyan-500/40 hover:text-cyan-300 hover:shadow-[0_0_16px_-4px_rgba(34,211,238,0.35)] sm:h-11 sm:w-11"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={scrollToBottom}
        aria-label="페이지 최하단으로 이동"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/60 bg-slate-900/90 text-slate-300 shadow-lg backdrop-blur-sm transition hover:border-cyan-500/40 hover:text-cyan-300 hover:shadow-[0_0_16px_-4px_rgba(34,211,238,0.35)] sm:h-11 sm:w-11"
      >
        ↓
      </button>
    </div>
  );
}
