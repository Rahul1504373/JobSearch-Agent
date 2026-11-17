import {AlertCircle, CheckCircle2, X} from 'lucide-react';
import {WorkspaceProvider, useWorkspace} from './context/WorkspaceContext';
import {AgentLogsView} from './components/AgentLogsView';
import {DiffCopilotModal} from './components/DiffCopilotPanel';
import {DiscoveryView} from './components/DiscoveryView';
import {JobDetailDrawer} from './components/JobDetailDrawer';
import {PipelineView} from './components/PipelineView';
import {ProfileView} from './components/ProfileView';
import {ScanJobModal} from './components/ScanJobModal';
import {Sidebar} from './components/Sidebar';
import {TopBar} from './components/TopBar';
import {VisaRadarView} from './components/VisaRadarView';
import type {WorkspaceView} from './types';

function WorkspaceShell() {
  const {activeView, setActiveView, bannerNotice, clearBannerNotice} = useWorkspace();

  const mobileTabs: Array<{id: WorkspaceView; label: string}> = [
    {id: 'discover', label: 'Discover'},
    {id: 'saved', label: 'Saved'},
    {id: 'applications', label: 'Apps'},
    {id: 'visa-radar', label: 'Radar'},
    {id: 'agent-logs', label: 'Logs'},
    {id: 'profile', label: 'CV'},
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#131B2E] flex flex-col">
      <TopBar />

      {/* Mobile / Tablet Quick View Strip */}
      <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-2 overflow-x-auto">
        <div className="inline-flex items-center gap-1 p-1 bg-[#F2F3FF] rounded-lg">
          {mobileTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveView(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                activeView === t.id
                  ? 'bg-white text-[#131B2E] shadow-sm'
                  : 'text-[#464555]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] mx-auto w-full space-y-5">
          {bannerNotice && (
            <div
              role="status"
              className={`px-4 py-3 rounded-xl border flex items-center justify-between gap-3 text-sm ${
                bannerNotice.type === 'error'
                  ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                  : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {bannerNotice.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                )}
                <span className="font-medium">{bannerNotice.message}</span>
              </div>
              <button
                type="button"
                onClick={clearBannerNotice}
                aria-label="Dismiss notification"
                className="p-1 rounded-md hover:bg-black/5 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {activeView === 'discover' && <DiscoveryView savedOnly={false} />}
          {activeView === 'saved' && <DiscoveryView savedOnly={true} />}
          {activeView === 'applications' && <PipelineView />}
          {activeView === 'profile' && <ProfileView />}
          {activeView === 'visa-radar' && <VisaRadarView />}
          {activeView === 'agent-logs' && <AgentLogsView />}
        </main>
      </div>

      <JobDetailDrawer />
      <DiffCopilotModal />
      <ScanJobModal />
    </div>
  );
}

export default function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceShell />
    </WorkspaceProvider>
  );
}
