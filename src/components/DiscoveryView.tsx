import {useMemo, useState} from 'react';
import {Bookmark, FileDiff, Search, ShieldCheck} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {
  CORRIDOR_META,
  JURISDICTION_META,
  SPONSORSHIP_META,
} from '../data/seedData';
import type {SponsorshipStatus, VisaCorridor} from '../types';
import {SponsorshipBadge} from './SponsorshipBadge';

export function DiscoveryView({savedOnly = false}: {savedOnly?: boolean}) {
  const {
    roles,
    jurisdiction,
    openDetailDrawer,
    openCopilotModal,
    toggleSaveRole,
    setActiveView,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [corridorFilter, setCorridorFilter] = useState<'ALL' | VisaCorridor>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SponsorshipStatus>('ALL');

  const activeJurisdictionCorridors = JURISDICTION_META[jurisdiction].corridors;

  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return roles.filter((role) => {
      if (savedOnly && !role.saved) return false;
      if (!activeJurisdictionCorridors.includes(role.corridor)) return false;
      if (corridorFilter !== 'ALL' && role.corridor !== corridorFilter) return false;
      if (statusFilter !== 'ALL' && role.sponsorshipStatus !== statusFilter) return false;
      if (q) {
        const hay = [
          role.company,
          role.title,
          role.location,
          role.visaSubclass,
          role.orgGroup,
          ...role.requiredSkills,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    roles,
    savedOnly,
    activeJurisdictionCorridors,
    corridorFilter,
    statusFilter,
    searchQuery,
  ]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Ribbon */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="h-4 w-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Distributed Systems, Go, UK Skilled Worker, Monzo..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#FAF8FF] border border-[#DAE2FD] text-sm text-[#131B2E] placeholder:text-[#64748B] focus:outline-none focus:border-[#3525CD] focus:ring-2 focus:ring-[#3525CD]/15"
            />
          </div>

          <select
            aria-label="Filter by visa corridor"
            value={corridorFilter}
            onChange={(e) => setCorridorFilter(e.target.value as 'ALL' | VisaCorridor)}
            className="h-10 px-3 rounded-lg bg-white border border-[#C7C4D8] text-sm text-[#131B2E] focus:outline-none focus:border-[#3525CD]"
          >
            <option value="ALL">All Active Corridors</option>
            {(Object.keys(CORRIDOR_META) as VisaCorridor[])
              .filter((c) => activeJurisdictionCorridors.includes(c))
              .map((c) => (
                <option key={c} value={c}>
                  {CORRIDOR_META[c].label}
                </option>
              ))}
          </select>

          <select
            aria-label="Filter by sponsorship status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'ALL' | SponsorshipStatus)
            }
            className="h-10 px-3 rounded-lg bg-white border border-[#C7C4D8] text-sm text-[#131B2E] focus:outline-none focus:border-[#3525CD]"
          >
            <option value="ALL">All Sponsorship Tiers</option>
            {(Object.keys(SPONSORSHIP_META) as SponsorshipStatus[]).map((s) => (
              <option key={s} value={s}>
                {SPONSORSHIP_META[s].label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#464555]">
          <span>
            {savedOnly ? 'Saved Roles' : 'Sponsor-Indexed Discovery'} · Showing{' '}
            <strong className="font-mono text-[#131B2E] tabular-nums-strict">
              {filteredRoles.length}
            </strong>{' '}
            {filteredRoles.length === 1 ? 'opportunity' : 'opportunities'} in{' '}
            <strong className="text-[#131B2E]">
              {JURISDICTION_META[jurisdiction].label}
            </strong>
          </span>
          {(searchQuery || corridorFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCorridorFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs font-semibold text-[#3525CD] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Role Cards Grid (Matches blurred backdrop cards in Screen #2 screenshot) */}
      {filteredRoles.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center space-y-3">
          <p className="font-display text-base font-semibold text-[#131B2E]">
            {savedOnly ? 'No saved roles in this jurisdiction' : 'No matching roles found'}
          </p>
          <p className="text-sm text-[#64748B] max-w-md mx-auto">
            {savedOnly
              ? 'Bookmark roles from Discover Jobs to keep shortlist candidates ready for CV tailoring.'
              : 'Adjust your search query, sponsorship tier, or Target Jurisdiction in the left sidebar.'}
          </p>
          <button
            type="button"
            onClick={() => {
              if (savedOnly) {
                setActiveView('discover');
              } else {
                setSearchQuery('');
                setCorridorFilter('ALL');
                setStatusFilter('ALL');
              }
            }}
            className="h-10 px-4 rounded-lg bg-[#3525CD] hover:bg-[#4F46E5] text-white text-sm font-medium"
          >
            {savedOnly ? 'Explore Discover Jobs' : 'Clear Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredRoles.map((role) => {
            const monogram = role.company.slice(0, 1).toUpperCase();
            return (
              <article
                key={role.id}
                onClick={() => openDetailDrawer(role.id)}
                className="group cursor-pointer bg-white rounded-xl border border-[#E2E8F0] hover:border-[#4F46E5]/50 shadow-[0_1px_3px_0_rgba(19,27,46,0.05)] hover:shadow-[0_6px_16px_-4px_rgba(53,37,205,0.12)] transition-all duration-150 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#131B2E] text-white font-display text-sm font-bold flex items-center justify-center shrink-0">
                      {monogram}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-mono text-xs font-semibold tabular-nums-strict">
                        {role.fitScore}% Match
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveRole(role.id);
                        }}
                        aria-label={role.saved ? 'Unsave role' : 'Save role'}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                          role.saved
                            ? 'text-[#3525CD] bg-[#EAEDFF]'
                            : 'text-[#64748B] hover:bg-[#F2F3FF]'
                        }`}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${role.saved ? 'fill-current' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-semibold text-[#131B2E] group-hover:text-[#3525CD] transition-colors leading-snug">
                      {role.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#464555]">
                      <span className="font-semibold text-[#131B2E]">{role.company}</span>
                      {' · '}
                      {role.location} {role.countryFlag}
                      {' · '}
                      {role.workModel}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs font-semibold text-[#3525CD] tabular-nums-strict">
                      {role.salaryDisplay}
                    </p>
                    <p className="text-xs font-medium text-[#464555] mt-0.5">
                      {role.visaSubclass}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAEDFF] flex items-center justify-between gap-2">
                  <SponsorshipBadge status={role.sponsorshipStatus} />

                  <div
                    className="flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => openDetailDrawer(role.id)}
                      className="h-8 px-2.5 rounded-lg border border-[#DAE2FD] bg-[#FAF8FF] hover:bg-[#EAEDFF] text-xs font-semibold text-[#131B2E] inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-[#3525CD]" />
                      <span>Evidence</span>
                    </button>

                    <button
                      type="button"
                      disabled={role.sponsorshipStatus === 'ineligible'}
                      onClick={() => openCopilotModal(role.id)}
                      className="h-8 px-2.5 rounded-lg bg-[#3525CD] hover:bg-[#4F46E5] disabled:bg-[#E2E8F0] disabled:text-[#64748B] text-white text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <FileDiff className="h-3.5 w-3.5" />
                      <span>CV Diff</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
