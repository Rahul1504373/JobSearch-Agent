import {useMemo, useState} from 'react';
import {ExternalLink, FileDiff, Loader2, ShieldCheck} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {CORRIDOR_META, STAGE_META} from '../data/seedData';
import type {PipelineStage} from '../types';
import {SponsorshipBadge} from './SponsorshipBadge';

const STAGE_ORDER: PipelineStage[] = [
  'discovered',
  'visa_screened',
  'resume_tailored',
  'submitted',
  'sponsor_interview',
];

export function PipelineView() {
  const {
    roles,
    updateRoleStage,
    auditRoleVisa,
    auditingRoleIds,
    openCopilotModal,
    openDetailDrawer,
    setActiveView,
  } = useWorkspace();

  const [stageFilter, setStageFilter] = useState<'all' | PipelineStage>('all');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    roles.find((r) => r.stage !== 'discovered')?.id ?? roles[0]?.id ?? '',
  );

  const visibleRoles = useMemo(() => {
    if (stageFilter === 'all') return roles;
    return roles.filter((r) => r.stage === stageFilter);
  }, [roles, stageFilter]);

  const inspectedRole =
    roles.find((r) => r.id === selectedRoleId) ?? visibleRoles[0] ?? roles[0];

  const submittedCount = roles.filter(
    (r) => r.stage === 'submitted' || r.stage === 'sponsor_interview',
  ).length;
  const auditedCount = roles.filter((r) => Boolean(r.audit)).length;
  const tailoredCount = roles.filter((r) => Boolean(r.diffSession)).length;

  return (
    <div className="space-y-6">
      {/* Compact Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-xs font-medium text-[#64748B]">Tracked Roles</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#131B2E] font-mono tabular-nums-strict">
            {roles.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-xs font-medium text-[#64748B]">Visa Audits Completed</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#131B2E] font-mono tabular-nums-strict">
            {auditedCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-xs font-medium text-[#64748B]">CVs Tailored</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#131B2E] font-mono tabular-nums-strict">
            {tailoredCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <p className="text-xs font-medium text-[#64748B]">Deployed &amp; Interviewing</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#3525CD] font-mono tabular-nums-strict">
            {submittedCount}
          </p>
        </div>
      </div>

      {/* Segmented Stage Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EAEDFF] rounded-lg">
          <button
            type="button"
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              stageFilter === 'all'
                ? 'bg-white text-[#131B2E] shadow-sm'
                : 'text-[#464555] hover:text-[#131B2E]'
            }`}
          >
            All ({roles.length})
          </button>
          {STAGE_ORDER.map((stage) => {
            const count = roles.filter((r) => r.stage === stage).length;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setStageFilter(stage)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  stageFilter === stage
                    ? 'bg-white text-[#131B2E] shadow-sm'
                    : 'text-[#464555] hover:text-[#131B2E]'
                }`}
              >
                {STAGE_META[stage].label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline Table + Inspector Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          {visibleRoles.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="font-display text-base font-semibold text-[#131B2E]">
                No applications in this stage
              </p>
              <p className="text-sm text-[#64748B]">
                Inspect or tailor an opportunity in Discover Jobs to advance it into the relocation pipeline.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('discover')}
                className="h-10 px-4 rounded-lg bg-[#3525CD] hover:bg-[#4F46E5] text-white text-sm font-medium"
              >
                Browse Discover Jobs
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F2F3FF] border-b border-[#E2E8F0] text-xs font-semibold text-[#131B2E]">
                    <th className="py-2.5 px-4 whitespace-nowrap">ID</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">Company &amp; Role</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">Subclass</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">Sponsorship</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEDFF] text-sm">
                  {visibleRoles.map((role) => {
                    const isSelected = inspectedRole?.id === role.id;
                    return (
                      <tr
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#F2F3FF]/70' : 'hover:bg-[#FAF8FF]'
                        }`}
                      >
                        <td className="py-2.5 px-4 font-mono text-xs font-medium text-[#64748B] tabular-nums-strict whitespace-nowrap">
                          {role.trackingCode}
                        </td>
                        <td className="py-2.5 px-4 min-w-[220px]">
                          <p className="font-semibold text-[#131B2E] truncate max-w-[260px]">
                            {role.company}
                          </p>
                          <p className="text-xs text-[#64748B] truncate max-w-[260px]">
                            {role.title}
                          </p>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-xs text-[#3525CD] whitespace-nowrap tabular-nums-strict">
                          {role.visaSubclass}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <SponsorshipBadge status={role.sponsorshipStatus} />
                        </td>
                        <td
                          className="py-2.5 px-4 whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            aria-label={`Stage for ${role.company}`}
                            value={role.stage}
                            onChange={(e) =>
                              updateRoleStage(role.id, e.target.value as PipelineStage)
                            }
                            className="h-8 px-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-medium text-[#131B2E] focus:outline-none focus:border-[#3525CD]"
                          >
                            {STAGE_ORDER.map((s) => (
                              <option key={s} value={s}>
                                {STAGE_META[s].label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Inspector Panel */}
        {inspectedRole && (
          <aside className="xl:col-span-4 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-[#3525CD] tabular-nums-strict">
                  {inspectedRole.trackingCode} · {inspectedRole.fitScore}% Fit
                </span>
                <SponsorshipBadge status={inspectedRole.sponsorshipStatus} />
              </div>
              <h3 className="font-display text-base font-semibold text-[#131B2E]">
                {inspectedRole.company} — {inspectedRole.title}
              </h3>
              <p className="text-xs text-[#64748B]">
                {inspectedRole.location} · {CORRIDOR_META[inspectedRole.corridor].label}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => openDetailDrawer(inspectedRole.id)}
                className="h-9 px-3 rounded-lg border border-[#DAE2FD] bg-[#FAF8FF] hover:bg-[#EAEDFF] text-xs font-semibold text-[#131B2E] flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#3525CD]" />
                <span>Evidence Drawer</span>
              </button>

              <button
                type="button"
                disabled={Boolean(auditingRoleIds[inspectedRole.id])}
                onClick={() => void auditRoleVisa(inspectedRole.id)}
                className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#FAF8FF] text-xs font-semibold text-[#334155] flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                {auditingRoleIds[inspectedRole.id] ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3525CD]" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-[#3525CD]" />
                    <span>{inspectedRole.audit ? 'Re-Audit Visa' : 'Run Audit'}</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              disabled={inspectedRole.sponsorshipStatus === 'ineligible'}
              onClick={() => openCopilotModal(inspectedRole.id)}
              className="w-full h-9 px-3 rounded-lg bg-[#3525CD] hover:bg-[#4F46E5] disabled:bg-[#E2E8F0] disabled:text-[#64748B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <FileDiff className="h-3.5 w-3.5" />
              <span>Optimize CV in Diff Copilot</span>
            </button>

            {inspectedRole.audit && (
              <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                <p className="text-xs font-semibold text-[#131B2E]">
                  Compliance Summary ({inspectedRole.audit.eligibilityStatus})
                </p>
                <p className="text-xs text-[#334155] leading-5">
                  {inspectedRole.audit.summary}
                </p>
              </div>
            )}

            {inspectedRole.deployedResumeText && (
              <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                <p className="text-xs font-semibold text-[#131B2E]">
                  Deployed CV Snapshot
                </p>
                <pre className="p-3 rounded-lg bg-[#FAF8FF] border border-[#DAE2FD] text-xs text-[#334155] whitespace-pre-wrap font-sans leading-5 max-h-40 overflow-y-auto">
                  {inspectedRole.deployedResumeText}
                </pre>
              </div>
            )}

            <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
              <p className="text-xs font-semibold text-[#131B2E]">
                Role Activity Trail
              </p>
              <div className="space-y-2.5">
                {inspectedRole.events.map((evt) => (
                  <div key={evt.id} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#131B2E]">{evt.action}</span>
                      <span className="font-mono text-[11px] text-[#64748B] tabular-nums-strict">
                        {evt.timestamp.slice(0, 10)}
                      </span>
                    </div>
                    <p className="text-[#64748B]">{evt.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
