import {useEffect, useMemo, useState} from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {CORRIDOR_META, STAGE_META} from '../data/seedData';
import type {DiffHunk, OpportunityRole} from '../types';
import {SponsorshipBadge} from './SponsorshipBadge';

interface DiffToken {
  text: string;
  kind: 'equal' | 'removed' | 'added';
}

function computeWordDiff(
  original: string,
  optimized: string,
): {leftTokens: DiffToken[]; rightTokens: DiffToken[]} {
  const a = original.trim().split(/\s+/).filter(Boolean);
  const b = optimized.trim().split(/\s+/).filter(Boolean);
  const m = a.length;
  const n = b.length;

  const dp: number[][] = Array.from({length: m + 1}, () =>
    new Array<number>(n + 1).fill(0),
  );

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const leftTokens: DiffToken[] = [];
  const rightTokens: DiffToken[] = [];
  let i = 0;
  let j = 0;

  while (i < m && j < n) {
    if (a[i] === b[j]) {
      leftTokens.push({text: a[i], kind: 'equal'});
      rightTokens.push({text: b[j], kind: 'equal'});
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      leftTokens.push({text: a[i], kind: 'removed'});
      i++;
    } else {
      rightTokens.push({text: b[j], kind: 'added'});
      j++;
    }
  }

  while (i < m) {
    leftTokens.push({text: a[i], kind: 'removed'});
    i++;
  }
  while (j < n) {
    rightTokens.push({text: b[j], kind: 'added'});
    j++;
  }

  return {leftTokens, rightTokens};
}

function HunkComparisonRow({
  hunk,
  onToggle,
}: {
  hunk: DiffHunk;
  onToggle: () => void;
}) {
  const {leftTokens, rightTokens} = useMemo(
    () => computeWordDiff(hunk.originalText, hunk.optimizedText),
    [hunk.originalText, hunk.optimizedText],
  );

  return (
    <div className="border-b border-[#E2E8F0] last:border-b-0">
      <div className="px-5 py-2.5 bg-[#F1F5F9]/70 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hunk.accepted}
              onChange={onToggle}
              className="h-4 w-4 rounded accent-[#4F46E5] cursor-pointer"
            />
            <span className="text-xs font-semibold text-[#0F172A] whitespace-nowrap">
              {hunk.section}
            </span>
          </label>
          <span className="hidden sm:inline text-[#CBD5E1]" aria-hidden="true">
            ·
          </span>
          <span className="text-xs text-[#64748B] truncate">{hunk.rationale}</span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            hunk.accepted
              ? 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]'
              : 'border-[#4F46E5] bg-[#EEF2FF] text-[#3525CD]'
          }`}
        >
          {hunk.accepted ? (
            <>
              <RotateCcw className="h-3 w-3" />
              <span>Revert to Original</span>
            </>
          ) : (
            <>
              <Check className="h-3 w-3" />
              <span>Accept Revision</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Original Content Pane */}
        <div className="lg:col-span-6 p-5 bg-[#F8FAFC] border-b lg:border-b-0 lg:border-r border-[#E2E8F0]">
          <p className="text-[11px] font-semibold tracking-[0.04em] text-[#64748B] mb-2">
            Original Baseline
          </p>
          <p className="text-sm leading-6 text-[#64748B]">
            {leftTokens.map((tok, idx) =>
              tok.kind === 'removed' && hunk.accepted ? (
                <span
                  key={idx}
                  className="bg-[#FEF2F2] text-[#991B1B] line-through px-1 rounded mx-0.5"
                >
                  {tok.text}
                </span>
              ) : (
                <span key={idx}>{tok.text} </span>
              ),
            )}
          </p>
        </div>

        {/* Right: Copilot Optimized Pane */}
        <div className="lg:col-span-6 p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold tracking-[0.04em] text-[#0F172A]">
              {hunk.accepted ? 'Copilot Optimized (Active)' : 'Reverted to Original'}
            </p>
            <span className="font-mono text-[11px] text-[#64748B] tabular-nums-strict">
              {hunk.accepted ? 'DIFF APPLIED' : 'ORIGINAL KEPT'}
            </span>
          </div>

          {hunk.accepted ? (
            <p className="text-sm leading-6 text-[#0F172A]">
              {rightTokens.map((tok, idx) =>
                tok.kind === 'added' ? (
                  <span
                    key={idx}
                    className="bg-[#ECFDF5] text-[#065F46] font-medium px-1 rounded mx-0.5"
                  >
                    {tok.text}
                  </span>
                ) : (
                  <span key={idx}>{tok.text} </span>
                ),
              )}
            </p>
          ) : (
            <p className="text-sm leading-6 text-[#334155]">{hunk.originalText}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CopilotWorkspaceBody({
  role,
  isModal,
  onCloseModal,
}: {
  role: OpportunityRole;
  isModal: boolean;
  onCloseModal?: () => void;
}) {
  const {
    tailoringRoleIds,
    generateTailoredDiff,
    toggleDiffHunk,
    setAllDiffHunks,
    deployApplication,
    setActiveView,
  } = useWorkspace();

  const [directive, setDirective] = useState(role.diffSession?.directive ?? '');
  const isGenerating = Boolean(tailoringRoleIds[role.id]);

  useEffect(() => {
    setDirective(role.diffSession?.directive ?? '');
  }, [role.id, role.diffSession?.directive]);

  useEffect(() => {
    if (!role.diffSession && !tailoringRoleIds[role.id]) {
      void generateTailoredDiff(role.id);
    }
  }, [role.id]);

  const session = role.diffSession;
  const acceptedCount = session
    ? session.hunks.filter((h) => h.accepted).length
    : 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-[#E2E8F0] bg-white flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-lg font-semibold text-[#0F172A] truncate">
              {role.company} — {role.title}
            </h2>
            <SponsorshipBadge status={role.sponsorshipStatus} />
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
            <span className="font-mono font-medium text-[#334155] tabular-nums-strict">
              {role.trackingCode}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#3525CD] font-medium">
              {role.visaSubclass}
            </span>
            <span aria-hidden="true">·</span>
            <span>{CORRIDOR_META[role.corridor].label}</span>
            <span aria-hidden="true">·</span>
            <span>Stage: {STAGE_META[role.stage].label}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => void generateTailoredDiff(role.id, directive)}
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] disabled:opacity-60 text-sm font-medium text-[#334155] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#4F46E5]" />
                <span>Generating Diff...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#4F46E5]" />
                <span>Regenerate with Gemini</span>
              </>
            )}
          </button>

          {isModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              aria-label="Close diff modal"
              className="h-10 w-10 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Directive & Strategy Strip */}
      <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center gap-3 shrink-0">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
            placeholder="Custom tailoring directive (e.g. Emphasize SOC 2134 distributed clearing & leadership)..."
            className="flex-1 h-9 px-3 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
          />
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => void generateTailoredDiff(role.id, directive)}
            className="h-9 px-3 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-60 text-white text-xs font-medium whitespace-nowrap shrink-0"
          >
            Apply Directive
          </button>
        </div>

        {session?.visaKeywordNotes && session.visaKeywordNotes.length > 0 && (
          <div className="text-xs text-[#464555] flex items-center gap-1.5 overflow-x-auto">
            <span className="font-semibold text-[#0F172A] whitespace-nowrap">
              Focus keywords:
            </span>
            <span className="whitespace-nowrap">
              {session.visaKeywordNotes.join(' · ')}
            </span>
          </div>
        )}
      </div>

      {/* Split-Pane Diff Body */}
      <div className="flex-1 overflow-y-auto">
        {isGenerating && !session ? (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6 h-40 rounded-lg bg-[#F1F5F9] animate-pulse" />
              <div className="lg:col-span-6 h-40 rounded-lg bg-[#F1F5F9] animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6 h-32 rounded-lg bg-[#F1F5F9] animate-pulse" />
              <div className="lg:col-span-6 h-32 rounded-lg bg-[#F1F5F9] animate-pulse" />
            </div>
          </div>
        ) : session ? (
          <div>
            {session.overallStrategy && (
              <div className="px-6 py-3 bg-white border-b border-[#E2E8F0] text-xs text-[#334155]">
                <span className="font-semibold text-[#0F172A]">Tailoring Strategy: </span>
                {session.overallStrategy}
              </div>
            )}

            {isGenerating && (
              <div className="px-6 py-2 bg-[#EEF2FF] border-b border-[#C3C0FF] text-xs font-medium text-[#3525CD] flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Gemini is refreshing diff hunks with your latest directive...</span>
              </div>
            )}

            <div>
              {session.hunks.map((hunk) => (
                <HunkComparisonRow
                  key={hunk.id}
                  hunk={hunk}
                  onToggle={() => toggleDiffHunk(role.id, hunk.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-10 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-[#64748B] mx-auto" />
            <p className="text-sm font-medium text-[#0F172A]">
              No tailored diff generated yet for {role.company}.
            </p>
            <button
              type="button"
              onClick={() => void generateTailoredDiff(role.id, directive)}
              className="h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Tailored Resume Diff</span>
            </button>
          </div>
        )}
      </div>

      {/* Sticky Footer Controls */}
      <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#334155] font-mono tabular-nums-strict">
            {acceptedCount}/{session?.hunks.length ?? 0} sections accepted
          </span>
          {session && (
            <>
              <button
                type="button"
                onClick={() => setAllDiffHunks(role.id, false)}
                className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-xs font-medium text-[#334155] whitespace-nowrap"
              >
                Revert All
              </button>
              <button
                type="button"
                onClick={() => setAllDiffHunks(role.id, true)}
                className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-xs font-medium text-[#334155] whitespace-nowrap"
              >
                Accept All
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {role.stage === 'submitted' && (
            <span className="text-xs font-medium text-[#065F46]">
              Previously deployed · Ready to re-submit
            </span>
          )}
          <button
            type="button"
            disabled={!session}
            onClick={() => {
              deployApplication(role.id);
              if (!isModal) {
                setActiveView('applications');
              }
            }}
            className="h-10 px-5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <span>Deploy Application</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DiffCopilotPanel() {
  const {roles} = useWorkspace();
  const activeRole = roles[0];

  if (!activeRole) return null;

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[580px]">
      <CopilotWorkspaceBody role={activeRole} isModal={false} />
    </div>
  );
}

export function DiffCopilotModal() {
  const {roles, modalCopilotRoleId, closeCopilotModal} = useWorkspace();
  if (!modalCopilotRoleId) return null;

  const role = roles.find((r) => r.id === modalCopilotRoleId);
  if (!role) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/40 backdrop-blur-[4px]"
      role="dialog"
      aria-modal="true"
      aria-label="Application Diff Copilot"
    >
      <div className="w-full max-w-6xl h-[88vh] shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1),0_8px_10px_-6px_rgba(15,23,42,0.05)] rounded-xl">
        <CopilotWorkspaceBody
          role={role}
          isModal={true}
          onCloseModal={closeCopilotModal}
        />
      </div>
    </div>
  );
}
