import {useEffect, useState} from 'react';
import {
  Bookmark,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {CORRIDOR_META, SPONSORSHIP_META, STAGE_META} from '../data/seedData';
import type {SponsorshipStatus} from '../types';

const REGISTRY_PILL_STYLES: Record<
  SponsorshipStatus,
  {wrapper: string; dot: string}
> = {
  verified: {
    wrapper: 'bg-[#FAF8FF] text-[#131B2E] border border-[#DAE2FD]',
    dot: 'bg-[#006E4B]',
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

function FitRing({score, poolLabel}: {score: number; poolLabel: string}) {
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const strokeColor =
    score >= 85 ? '#006E4B' : score >= 70 ? '#3525CD' : '#BA1A1A';

  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="relative h-14 w-14 flex items-center justify-center">
        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 52 52" aria-hidden="true">
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="#EAEDFF"
            strokeWidth="4"
          />
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="font-mono text-xs font-bold text-[#131B2E] tabular-nums-strict">
            {score}%
          </span>
          <span className="text-[9px] font-semibold tracking-[0.06em] text-[#464555] mt-0.5">
            FIT
          </span>
        </div>
      </div>
      <span className="mt-1 px-2 py-0.5 rounded-full bg-[#EAEDFF] text-[#3525CD] text-[10px] font-semibold whitespace-nowrap">
        {poolLabel}
      </span>
    </div>
  );
}

export function JobDetailDrawer() {
  const {
    roles,
    detailDrawerRoleId,
    closeDetailDrawer,
    toggleSaveRole,
    openCopilotModal,
    auditRoleVisa,
    auditingRoleIds,
  } = useWorkspace();

  const [showOriginalPosting, setShowOriginalPosting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const role = roles.find((r) => r.id === detailDrawerRoleId);

  useEffect(() => {
    setShowOriginalPosting(false);
    setCopiedLink(false);
  }, [detailDrawerRoleId]);

  if (!role) return null;

  const badgeStyle = REGISTRY_PILL_STYLES[role.sponsorshipStatus];
  const badgeText = SPONSORSHIP_META[role.sponsorshipStatus].registryBadge;
  const isAuditing = Boolean(auditingRoleIds[role.id]);
  const companyMonogram = role.company.slice(0, 1).toUpperCase();

  const handleCopyShare = async () => {
    const shareSummary = `${role.company} — ${role.title} (${role.visaSubclass}) · ${role.trackingCode}`;
    try {
      await navigator.clipboard.writeText(shareSummary);
    } catch {
      // Clipboard fallback ignored
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-[#131B2E]/30 backdrop-blur-[3px]"
      onClick={closeDetailDrawer}
      role="dialog"
      aria-modal="true"
      aria-label={`${role.company} — Job Detail and Sponsorship Evidence`}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[600px] h-full bg-white border-l border-[#E2E8F0] shadow-[0_20px_25px_-5px_rgba(19,27,46,0.14),0_8px_10px_-6px_rgba(19,27,46,0.06)] flex flex-col overflow-hidden"
      >
        {/* Top Utility Strip */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-3 shrink-0">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${badgeStyle.wrapper}`}
          >
            <span className={`h-2 w-2 rounded-full shrink-0 ${badgeStyle.dot}`} aria-hidden="true" />
            <span>{badgeText}</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => void handleCopyShare()}
              title="Copy role sponsorship summary"
              className="h-8 px-2 rounded-lg text-[#464555] hover:text-[#131B2E] hover:bg-[#F2F3FF] transition-colors inline-flex items-center gap-1 text-xs font-medium"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#006E4B]" />
                  <span className="text-[#006E4B]">Copied</span>
                </>
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleSaveRole(role.id)}
              title={role.saved ? 'Remove from Saved Jobs' : 'Save Job'}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                role.saved
                  ? 'text-[#3525CD] bg-[#EAEDFF]'
                  : 'text-[#464555] hover:text-[#131B2E] hover:bg-[#F2F3FF]'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${role.saved ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setShowOriginalPosting((v) => !v)}
              title="Toggle Original Job Posting"
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                showOriginalPosting
                  ? 'text-[#3525CD] bg-[#EAEDFF]'
                  : 'text-[#464555] hover:text-[#131B2E] hover:bg-[#F2F3FF]'
              }`}
            >
              <ExternalLink className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={closeDetailDrawer}
              aria-label="Close job detail drawer"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[#464555] hover:text-[#131B2E] hover:bg-[#F2F3FF] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Company Header + Fit Ring */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-[#131B2E] text-white font-display text-lg font-bold flex items-center justify-center shrink-0 shadow-sm">
                {companyMonogram}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[#464555] flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-[#131B2E]">{role.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {role.location} {role.countryFlag}
                  </span>
                  <span className="text-xs text-[#777587]">({role.workModel})</span>
                </p>
                <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.015em] text-[#131B2E] leading-snug">
                  {role.title}
                </h2>
              </div>
            </div>

            <FitRing score={role.fitScore} poolLabel={role.poolLabel} />
          </div>

          {/* Tinted Metadata Card (#F2F3FF) */}
          <div className="rounded-xl bg-[#F2F3FF] border border-[#DAE2FD] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:pr-4 sm:border-r sm:border-[#DAE2FD]">
              <p className="text-[11px] font-semibold tracking-[0.04em] text-[#464555] uppercase flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#3525CD]" aria-hidden="true" />
                <span>Comp &amp; Relocation</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-[#131B2E] font-mono tabular-nums-strict">
                {role.salaryDisplay}
              </p>
              <p className="mt-0.5 text-xs text-[#464555]">{role.relocationPackage}</p>
            </div>

            <div className="sm:pl-1">
              <p className="text-[11px] font-semibold tracking-[0.04em] text-[#464555] uppercase flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#3525CD]" aria-hidden="true" />
                <span>Contract</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-[#131B2E]">
                {role.contractType}
              </p>
              <p className="mt-0.5 text-xs text-[#464555]">
                Stage: {STAGE_META[role.stage].label}
              </p>
            </div>

            <div className="sm:pr-4 sm:border-r sm:border-[#DAE2FD] pt-3 border-t border-[#DAE2FD]">
              <p className="text-[11px] font-semibold tracking-[0.04em] text-[#464555] uppercase flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#006E4B]" aria-hidden="true" />
                <span>Org Group</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-[#131B2E]">
                {role.orgGroup}
              </p>
            </div>

            <div className="sm:pl-1 pt-3 border-t border-[#DAE2FD]">
              <p className="text-[11px] font-semibold tracking-[0.04em] text-[#464555] uppercase flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#3525CD]" aria-hidden="true" />
                <span>Visa Route</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-[#3525CD] font-mono tabular-nums-strict">
                {role.visaSubclass}
              </p>
            </div>
          </div>

          {/* Action Buttons matching Screen #2 */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <button
              type="button"
              onClick={() => setShowOriginalPosting((prev) => !prev)}
              className="sm:col-span-5 h-11 px-4 rounded-xl border border-[#C7C4D8] bg-white hover:bg-[#FAF8FF] text-sm font-semibold text-[#131B2E] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Globe className="h-4 w-4 text-[#464555]" aria-hidden="true" />
              <span>
                {showOriginalPosting ? 'Hide Original Posting' : 'View Original Posting'}
              </span>
            </button>

            <button
              type="button"
              disabled={role.sponsorshipStatus === 'ineligible'}
              onClick={() => openCopilotModal(role.id)}
              className="sm:col-span-7 h-11 px-5 rounded-xl bg-[#3525CD] hover:bg-[#4F46E5] disabled:bg-[#E2E8F0] disabled:text-[#64748B] text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Optimize CV for this Job</span>
            </button>
          </div>

          {/* Original Posting Expandable Block */}
          {showOriginalPosting && (
            <div className="rounded-xl border border-[#DAE2FD] bg-[#FAF8FF] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#131B2E]">
                  Captured Source Posting
                </span>
                <span className="font-mono text-[11px] text-[#464555] tabular-nums-strict">
                  {role.trackingCode} · Indexed {role.postedAt}
                </span>
              </div>
              <pre className="text-xs text-[#464555] whitespace-pre-wrap font-sans leading-5">
                {role.originalPostingText}
              </pre>
            </div>
          )}

          {/* Sponsorship Evidence & Registry Breakdown */}
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-sm font-semibold text-[#131B2E]">
                Sponsorship Evidence &amp; Registry Record
              </h3>
              <span className="font-mono text-xs font-medium text-[#3525CD] bg-[#EAEDFF] px-2.5 py-0.5 rounded-md tabular-nums-strict">
                {role.sponsorRegistryId}
              </span>
            </div>

            <p className="text-sm text-[#464555] leading-6">
              {role.sponsorshipEvidence}
            </p>

            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[#FAF8FF] border border-[#EAEDFF]">
                <p className="font-semibold text-[#131B2E]">
                  Corridor Statutory Threshold ({CORRIDOR_META[role.corridor].label})
                </p>
                <p className="mt-1 text-[#464555]">{role.corridorThresholdNote}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8FF] border border-[#EAEDFF]">
                <p className="font-semibold text-[#131B2E]">Required Technical Stack</p>
                <p className="mt-1 text-[#464555]">{role.requiredSkills.join(' · ')}</p>
              </div>
            </div>
          </section>

          {/* Live Gemini Visa Eligibility Audit Section */}
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-sm font-semibold text-[#131B2E]">
                  Gemini Visa Corridor Eligibility Audit
                </h3>
                <p className="text-xs text-[#64748B]">
                  Cross-checks your degree, experience, and salary against {CORRIDOR_META[role.corridor].label} rules.
                </p>
              </div>

              <button
                type="button"
                disabled={isAuditing}
                onClick={() => void auditRoleVisa(role.id)}
                className="h-9 px-3.5 rounded-lg border border-[#C7C4D8] bg-white hover:bg-[#FAF8FF] disabled:opacity-60 text-xs font-semibold text-[#131B2E] inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3525CD]" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-[#3525CD]" />
                    <span>{role.audit ? 'Re-Run Audit' : 'Run Live Audit'}</span>
                  </>
                )}
              </button>
            </div>

            {isAuditing && (
              <div className="space-y-2 pt-2">
                <div className="h-4 w-48 bg-[#F2F3FF] rounded animate-pulse" />
                <div className="h-14 w-full bg-[#F2F3FF] rounded animate-pulse" />
              </div>
            )}

            {!isAuditing && role.audit ? (
              <div className="pt-2 space-y-3 border-t border-[#EAEDFF]">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#131B2E]">
                    {role.audit.eligibilityStatus === 'eligible' ? (
                      <CheckCircle2 className="h-4 w-4 text-[#006E4B]" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-[#F59E0B]" />
                    )}
                    <span>{role.audit.recommendedSubclass}</span>
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#006E4B] uppercase">
                    {role.audit.eligibilityStatus}
                  </span>
                </div>

                <p className="text-xs text-[#464555] leading-5">{role.audit.summary}</p>

                <ul className="space-y-1 text-xs text-[#334155] list-disc pl-4">
                  {role.audit.keyFindings.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                {role.audit.complianceRisks.length > 0 && (
                  <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
                    <span className="font-semibold">Compliance Note: </span>
                    {role.audit.complianceRisks[0]}
                  </div>
                )}
              </div>
            ) : (
              !isAuditing && (
                <p className="text-xs text-[#64748B] pt-1">
                  Run a live Gemini eligibility audit to verify SOC/ISCO code alignment and statutory salary margins.
                </p>
              )
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
