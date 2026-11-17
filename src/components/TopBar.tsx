import {useState} from 'react';
import {Bell, Compass, Plus} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {JURISDICTION_META} from '../data/seedData';
import type {WorkspaceView} from '../types';

export function TopBar() {
  const {
    activeView,
    setActiveView,
    roles,
    profile,
    jurisdiction,
    setIsScanModalOpen,
    allAgentLogs,
  } = useWorkspace();
  const [imgFailed, setImgFailed] = useState(false);

  const savedCount = roles.filter((r) => r.saved).length;
  const applicationsCount = roles.filter(
    (r) =>
      r.stage === 'resume_tailored' ||
      r.stage === 'submitted' ||
      r.stage === 'sponsor_interview',
  ).length;

  const navItems: Array<{id: WorkspaceView; label: string; count?: number; highlight?: boolean}> = [
    {id: 'discover', label: 'Discover'},
    {id: 'saved', label: 'Saved', count: savedCount},
    {id: 'applications', label: 'Applications', count: applicationsCount, highlight: true},
    {id: 'profile', label: 'My CV & Profile'},
  ];

  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Brand + Primary Nav */}
      <div className="flex items-center gap-6 lg:gap-8 min-w-0">
        <button
          type="button"
          onClick={() => setActiveView('discover')}
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-lg"
        >
          <span className="h-8 w-8 rounded-lg bg-[#3525CD] text-white flex items-center justify-center shrink-0">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-[#131B2E] whitespace-nowrap">
            CareerCopilot <span className="text-[#3525CD]">AI</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-5 lg:gap-6" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const isProfilePill = item.id === 'profile' && isActive;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={
                  isProfilePill
                    ? 'h-9 px-4 rounded-lg bg-[#3525CD] text-white inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap shrink-0'
                    : `h-16 inline-flex items-center gap-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:text-[#3525CD] ${
                        isActive
                          ? 'border-[#3525CD] text-[#131B2E] font-semibold'
                          : 'border-transparent text-[#464555] hover:text-[#131B2E]'
                      }`
                }
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold font-mono tabular-nums-strict ${
                      item.highlight
                        ? 'bg-[#3525CD] text-white'
                        : 'bg-[#EAEDFF] text-[#3525CD]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Status + Actions + Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setActiveView('visa-radar')}
          className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-medium text-[#065F46] hover:bg-[#D1FAE5] transition-colors whitespace-nowrap shrink-0"
          title="View corridor thresholds in Visa Radar"
        >
          <span className="h-2 w-2 rounded-full bg-[#10B981] shrink-0" aria-hidden="true" />
          <span>{JURISDICTION_META[jurisdiction].agentBanner}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsScanModalOpen(true)}
          className="h-9 px-3 rounded-lg bg-[#3525CD] hover:bg-[#4F46E5] text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Scan Posting</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('agent-logs')}
          aria-label={`View agent logs (${allAgentLogs.length} events)`}
          className="relative h-9 w-9 rounded-lg flex items-center justify-center text-[#464555] hover:text-[#131B2E] hover:bg-[#F2F3FF] transition-colors shrink-0"
        >
          <Bell className="h-4 w-4" />
          {allAgentLogs.length > 0 && (
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#BA1A1A]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveView('profile')}
          aria-label="Open My CV & Profile"
          className="relative h-9 w-9 rounded-full shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
        >
          {!imgFailed && profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-9 w-9 rounded-full object-cover border border-[#C7C4D8]"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-[#3525CD] text-white text-xs font-bold flex items-center justify-center">
              {initials}
            </div>
          )}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
