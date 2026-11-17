import type {SponsorshipStatus} from '../types';
import {SPONSORSHIP_META} from '../data/seedData';

const BADGE_STYLES: Record<
  SponsorshipStatus,
  {wrapper: string; dot: string}
> = {
  verified: {
    wrapper: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    dot: 'bg-[#10B981]',
  },
  stated: {
    wrapper: 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]',
    dot: 'bg-[#3B82F6]',
  },
  unclear: {
    wrapper: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
  },
  ineligible: {
    wrapper: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },
};

export function SponsorshipBadge({status}: {status: SponsorshipStatus}) {
  const style = BADGE_STYLES[status];
  const meta = SPONSORSHIP_META[status];

  return (
    <span
      title={meta.description}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-[0.02em] whitespace-nowrap shrink-0 ${style.wrapper}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  );
}
