import React from "react";

/**
 * Pinch – Stats Card (Final Refinements)
 * Goals (per reference):
 *  - Softer, rounder corners ~24px
 *  - Narrower card width to give Daily Digest more breathing room
 *  - Updated type hierarchy & sizing to match reference image
 *  - Subtle green vertical gradient + soft shadow
 *  - Clear divider between metrics
 *
 * Usage:
 * <StatsCard total={47} autoPercent={37} />
 */

interface StatsCardProps {
  total?: number;
  autoPercent?: number;
}

export default function StatsCard({ total = 47, autoPercent = 37 }: StatsCardProps) {
  const newMessages = 12;
  
  return (
    <section
      aria-label="Statistics"
      className="px-8 py-5 rounded-[24px] bg-card antialiased"
    >
      {/* Horizontal Stats Layout */}
      <div className="flex items-center gap-8 md:gap-10">
        {/* Total Questions */}
        <div className="flex items-baseline gap-2.5">
          <div className="text-3xl md:text-4xl font-semibold text-foreground">{total}</div>
          <p className="text-sm text-muted-foreground whitespace-nowrap">total questions</p>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-border" />

        {/* Auto-Answered */}
        <div className="flex items-baseline gap-2.5">
          <div className="text-3xl md:text-4xl font-semibold text-foreground">{autoPercent}%</div>
          <p className="text-sm text-muted-foreground whitespace-nowrap">auto-answered</p>
        </div>
      </div>
    </section>
  );
}
