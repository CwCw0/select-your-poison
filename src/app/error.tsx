'use client';

import { Skull } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-[#EF4444] flex items-center justify-center mb-8">
        <Skull className="w-10 h-10 text-[#0C0C0C]" />
      </div>

      <span className="text-[11px] font-semibold tracking-[4px] text-[#EF4444] font-mono mb-4">
        SOMETHING WENT WRONG
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
        ROUND FAILED
      </h1>

      <p className="text-base text-[#999999] font-mono max-w-md mb-10 leading-relaxed">
        An unexpected error occurred. Don&apos;t worry, your game data is safe.
      </p>

      <button
        onClick={reset}
        className="inline-flex items-center justify-center h-12 px-8 bg-[#FF0000] text-[#0C0C0C] text-[13px] font-bold tracking-[2px] font-mono hover:bg-[#E50000] active:scale-[0.97] transition-all cursor-pointer border-none"
      >
        TRY AGAIN
      </button>
    </main>
  );
}
