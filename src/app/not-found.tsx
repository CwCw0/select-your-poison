import Link from 'next/link';
import { Skull } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center px-4 text-center">
      {/* Skull */}
      <div className="w-20 h-20 bg-[#FF0000] flex items-center justify-center mb-8">
        <Skull className="w-10 h-10 text-[#0C0C0C]" />
      </div>

      {/* Error Code */}
      <span className="text-[11px] font-semibold tracking-[4px] text-[#FF0000] font-mono mb-4">
        ERROR 404
      </span>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
        ELIMINATED
      </h1>

      {/* Message */}
      <p className="text-base text-[#999999] font-mono max-w-md mb-10 leading-relaxed">
        This page doesn&apos;t exist. You&apos;ve been removed from the round.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 bg-[#FF0000] text-[#0C0C0C] text-[13px] font-bold tracking-[2px] font-mono hover:bg-[#E50000] active:scale-[0.97] transition-all"
        >
          BACK TO BASE
        </Link>
        <Link
          href="/lobby/create"
          className="inline-flex items-center justify-center h-12 px-8 border border-[#333333] text-white text-[13px] font-semibold tracking-[2px] font-mono hover:border-[#FF0000] active:scale-[0.97] transition-all"
        >
          CREATE LOBBY
        </Link>
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-[11px] text-[#666666] font-mono tracking-[1px]">
        SELECT YOUR POISON
      </p>
    </main>
  );
}
