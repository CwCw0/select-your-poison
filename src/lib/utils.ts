import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateLobbyCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `POISON-${code}`;
}

export function formatRound(round: number): string {
  return round.toString().padStart(2, "0");
}

export function formatScore(teamScore: number, enemyScore: number): string {
  return `${teamScore}-${enemyScore}`;
}
