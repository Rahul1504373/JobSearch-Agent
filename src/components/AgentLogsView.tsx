import {useMemo, useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';

type LogFilter =
  | 'all'
  | 'gemini-cv'
  | 'gemini-audit'
  | 'gemini-diff'
  | 'gemini-scan'
  | 'pipeline';

export function AgentLogsView() {
  const {allAgentLogs, openDetailDrawer} = useWorkspace();
  const [filter, setFilter] = useState<LogFilter>('all');

  const filteredLogs = useMemo(() => {
    if (filter === 'all') return allAgentLogs;
    return allAgentLogs.filter((l) => (l.source ?? 'pipeline') === filter);
  }, [allAgentLogs, filter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-[#131B2E]">
            Agent Logs &amp; Verification Trail
          </h2>
          <p className="text-sm text-[#464555] mt-0.5">
            Chronological record of CV ingestions, Gemini visa audits, CV diff generations, posting scans, and stage updates.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EAEDFF] rounded-lg">
          {(
            [
              {id: 'all', label: 'All Events'},
              {id: 'gemini-cv', label: 'CV Ingestion'},
              {id: 'gemini-audit', label: 'Visa Audits'},
              {id: 'gemini-diff', label: 'CV Diffs'},
              {id: 'gemini-scan', label: 'Job Scans'},
              {id: 'pipeline', label: 'Pipeline'},
            ] as Array<{id: LogFilter; label: string}>
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-[#131B2E] shadow-sm'
                  : 'text-[#464555] hover:text-[#131B2E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F2F3FF] border-b border-[#E2E8F0] text-xs font-semibold text-[#131B2E]">
                <th className="py-3 px-4 whitespace-nowrap">Timestamp</th>
                <th className="py-3 px-4 whitespace-nowrap">Role ID</th>
                <th className="py-3 px-4 whitespace-nowrap">Employer</th>
                <th className="py-3 px-4 whitespace-nowrap">Action</th>
                <th className="py-3 px-4">Evidence / Detail</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEDFF] text-sm">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#FAF8FF] transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-[#64748B] tabular-nums-strict whitespace-nowrap">
                    {entry.timestamp.replace('T', ' ').slice(0, 16)}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-[#3525CD] tabular-nums-strict whitespace-nowrap">
                    {entry.trackingCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#131B2E] whitespace-nowrap">
                    {entry.company}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#131B2E] whitespace-nowrap">
                    {entry.action}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#464555]">
                    {entry.detail}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openDetailDrawer(entry.roleId)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#3525CD] hover:underline"
                    >
                      <span>Open Screen #2</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
