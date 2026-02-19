'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-[#1A1A1A] rounded', className)}
      style={style}
    />
  );
}

export function PlayerCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #333333',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Skeleton style={{ width: '44px', height: '44px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton style={{ width: '80px', height: '14px' }} />
            <Skeleton style={{ width: '60px', height: '10px' }} />
          </div>
        </div>
        <Skeleton style={{ width: '44px', height: '44px' }} />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Skeleton style={{ flex: 1, height: '80px' }} />
        <Skeleton style={{ flex: 1, height: '80px' }} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton style={{ flex: 1, height: '36px' }} />
        <Skeleton style={{ flex: 1, height: '36px' }} />
      </div>
    </div>
  );
}

export function GamePageSkeleton() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0C0C0C', display: 'flex' }}>
      {/* Main Content Skeleton */}
      <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton style={{ width: '200px', height: '40px' }} />
          <Skeleton style={{ width: '120px', height: '40px' }} />
        </div>

        {/* Score Section */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', alignItems: 'center' }}>
          <Skeleton style={{ width: '80px', height: '80px' }} />
          <Skeleton style={{ width: '40px', height: '40px' }} />
          <Skeleton style={{ width: '80px', height: '80px' }} />
        </div>

        {/* Player Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <PlayerCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div style={{ width: '320px', backgroundColor: '#0A0A0A', padding: '32px' }}>
        <Skeleton style={{ width: '100%', height: '200px', marginBottom: '24px' }} />
        <Skeleton style={{ width: '100%', height: '150px' }} />
      </div>
    </div>
  );
}
