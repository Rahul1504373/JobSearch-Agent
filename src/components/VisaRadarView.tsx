import {ArrowUpRight, ShieldCheck} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {CORRIDOR_META} from '../data/seedData';
import type {VisaCorridor} from '../types';
import {SponsorshipBadge} from './SponsorshipBadge';

export function VisaRadarView() {
  const {roles, openDetailDrawer, auditRoleVisa, auditingRoleIds} = useWorkspace();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[#131B2E]">
          Visa Radar — Statutory Corridor Matrix
        </h2>
        <p className="text-sm text-[#464555] mt-0.5">
          Live sponsor registry verification and statutory compensation floors across your 4 relocation corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(Object.keys(CORRIDOR_META) as VisaCorridor[]).map((corridor) => {
          const meta = CORRIDOR_META[corridor];
          const corridorRoles = roles.filter((r) => r.corridor === corridor);
          const verifiedCount = corridorRoles.filter(
            (r) => r.sponsorshipStatus === 'verified',
          ).length;

          return (
            <section
              key={corridor}
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#131B2E]">
                    {meta.label}
                  </h3>
                  <p className="text-xs text-[#464555] mt-0.5">{meta.statutoryNote}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#F2F3FF] text-[#3525CD] font-mono text-xs font-semibold tabular-nums-strict whitespace-nowrap">
                  {verifiedCount}/{corridorRoles.length} Verified
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#DAE2FD] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-[#464555]">Statutory Salary Floor</p>
                  <p className="mt-0.5 font-mono font-semibold text-[#131B2E] tabular-nums-strict">
                    {meta.salaryFloor}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#464555]">Typical Processing</p>
                  <p className="mt-0.5 font-medium text-[#131B2E]">
                    {meta.processingTime}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#EAEDFF]">
                {corridorRoles.map((role) => (
                  <div
                    key={role.id}
                    className="py-3 flex flex-wrap items-center justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => openDetailDrawer(role.id)}
                      className="text-left min-w-0 group"
                    >
                      <p className="text-sm font-semibold text-[#131B2E] group-hover:text-[#3525CD] flex items-center gap-1">
                        <span>
                          {role.company} {role.countryFlag}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#64748B]" />
                      </p>
                      <p className="text-xs text-[#64748B] truncate max-w-[260px]">
                        {role.title} · {role.sponsorRegistryId}
                      </p>
                    </button>

                    <div className="flex items-center gap-2">
                      <SponsorshipBadge status={role.sponsorshipStatus} />
                      <button
                        type="button"
                        disabled={Boolean(auditingRoleIds[role.id])}
                        onClick={() => void auditRoleVisa(role.id)}
                        className="h-8 px-2.5 rounded-lg border border-[#DAE2FD] bg-white hover:bg-[#F2F3FF] text-xs font-semibold text-[#131B2E] inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-[#3525CD]" />
                        <span>{role.audit ? 'Audited' : 'Audit'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
