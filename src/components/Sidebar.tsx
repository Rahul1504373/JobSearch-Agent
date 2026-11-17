import {
  Bookmark,
  Bot,
  Compass,
  FileText,
  RotateCcw,
  Send,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {JURISDICTION_META} from '../data/seedData';
import type {JurisdictionScope, WorkspaceView} from '../types';

export function Sidebar() {
  const {
    activeView,
    setActiveView,
    roles,
    jurisdiction,
    setJurisdiction,
    resetDemoWorkspace,
  } = useWorkspace();

  const savedCount = roles.filter((r) => r.saved).length;
  const applicationsCount = roles.filter(
    (r) =>
      r.stage === 'resume_tailored' ||
      r.stage === 'submitted' ||
      r.stage === 'sponsor_interview',
  ).length;

  const navSection: Array<{
    id: WorkspaceView;
    label: string;
    icon: typeof Compass;
    badge?: number;
    accent?: boolean;
  }> = [
    {id: 'discover', label: 'Discover Jobs', icon: Compass},
    {id: 'saved', label: 'Saved Jobs', icon: Bookmark, badge: savedCount},
    {
      id: 'applications',
      label: 'Applications',
      icon: Send,
      badge: applicationsCount,
      accent: true,
    },
    {id: 'profile', label: 'My CV & Profile', icon: FileText},
  ];

  const intelligenceSection: Array<{
    id: WorkspaceView;
    label: string;
    icon: typeof ShieldCheck;
  }> = [
    {id: 'visa-radar', label: 'Visa Radar', icon: ShieldCheck},
    {id: 'agent-logs', label: 'Agent Logs', icon: Bot},
  ];

  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col justify-between bg-white border-r border-[#E2E8F0] min-h-[calc(100vh-4rem)] sticky top-16 h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold tracking-[0.06em] text-[#777587] uppercase">
            Navigation
          </p>
          <div className="space-y-1">
            {navSection.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`w-full h-10 px-3 rounded-lg flex items-center justify-between text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                    isActive
                      ? 'bg-[#3525CD] text-white font-semibold shadow-sm'
                      : 'text-[#464555] hover:bg-[#FAF8FF] hover:text-[#131B2E]'
                  }`}
                >
                  <span className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </span>
                  {typeof item.badge === 'number' && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono tabular-nums-strict ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.accent
                            ? 'bg-[#3525CD] text-white'
                            : 'bg-[#EAEDFF] text-[#3525CD]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold tracking-[0.06em] text-[#777587] uppercase">
            Intelligence
          </p>
          <div className="space-y-1">
            {intelligenceSection.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                    isActive
                      ? 'bg-[#F2F3FF] text-[#131B2E] font-semibold'
                      : 'text-[#464555] hover:bg-[#FAF8FF] hover:text-[#131B2E]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? 'text-[#3525CD]' : 'text-[#64748B]'}`}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Target Jurisdiction Selector Card */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-2.5">
        <div className="p-3 rounded-xl bg-[#F2F3FF] border border-[#DAE2FD]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-medium text-[#464555]">
              Target Jurisdiction
            </span>
            <Settings2 className="h-3.5 w-3.5 text-[#3525CD]" aria-hidden="true" />
          </div>
          <select
            aria-label="Target Jurisdiction"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value as JurisdictionScope)}
            className="w-full bg-transparent text-xs font-semibold text-[#131B2E] focus:outline-none cursor-pointer"
          >
            {(Object.keys(JURISDICTION_META) as JurisdictionScope[]).map((scope) => (
              <option key={scope} value={scope}>
                {JURISDICTION_META[scope].label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={resetDemoWorkspace}
          className="w-full h-8 px-2 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#131B2E] hover:bg-[#FAF8FF] transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          <span>Reset Workspace Baseline</span>
        </button>
      </div>
    </aside>
  );
}
