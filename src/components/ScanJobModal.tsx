import {useState} from 'react';
import {AlertCircle, Loader2, Sparkles, X} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import type {SponsorshipStatus, VisaCorridor} from '../types';

const SAMPLE_POSTINGS = [
  {
    label: 'London Fintech (UK SWV)',
    company: 'Wise',
    title: 'Staff Platform Engineer — Treasury',
    corridor: 'UK_SWV' as VisaCorridor,
    text: `Wise — Staff Platform Engineer (Treasury Settlement), London, UK (Hybrid 2 days/week).
Compensation: £125,000 - £140,000 + equity.
Requirements: 7+ years building distributed payment or ledger systems in Go or Java, Kubernetes, Kafka, PostgreSQL, AWS.
Visa & Relocation: Wise is a licensed UK Home Office Skilled Worker Sponsor and provides full visa sponsorship, Certificate of Sponsorship, Immigration Health Surcharge coverage, and international relocation support.`,
  },
  {
    label: 'Berlin Cloud (EU Blue Card)',
    company: 'Datadog',
    title: 'Senior Distributed Systems Engineer — Metrics Storage',
    corridor: 'EU_BLUE_CARD' as VisaCorridor,
    text: `Datadog — Senior Distributed Systems Engineer, Berlin, Germany (Hybrid).
Compensation: €108,000 - €126,000 + RSUs.
Stack: Rust, Go, Kafka, Kubernetes, Terraform.
Immigration: Full EU Blue Card (§18g AufenthG) sponsorship and dedicated Berlin relocation package included for international hires.`,
  },
];

export function ScanJobModal() {
  const {isScanModalOpen, setIsScanModalOpen, addScannedRole, setActiveView} =
    useWorkspace();
  const [companyHint, setCompanyHint] = useState('');
  const [titleHint, setTitleHint] = useState('');
  const [corridorHint, setCorridorHint] = useState<string>('');
  const [rawText, setRawText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isScanModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rawText.trim().length < 20) {
      setErrorMsg('Please paste at least 20 characters of a job description.');
      return;
    }
    setIsScanning(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/jobs/scan', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          rawText,
          companyHint,
          titleHint,
          corridorHint,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan job posting.');
      }

      const validCorridors: VisaCorridor[] = [
        'UK_SWV',
        'EU_BLUE_CARD',
        'US_H1B_O1',
        'AU_CA_GTS',
      ];
      const validStatuses: SponsorshipStatus[] = [
        'verified',
        'stated',
        'unclear',
        'ineligible',
      ];

      addScannedRole({
        company: String(data.company || companyHint || 'Unspecified Employer'),
        title: String(data.title || titleHint || 'Software Engineer'),
        location: String(data.location || 'International'),
        corridor: validCorridors.includes(data.corridor) ? data.corridor : 'UK_SWV',
        visaSubclass: String(data.visaSubclass || 'Pending Classification'),
        sponsorshipStatus: validStatuses.includes(data.sponsorshipStatus)
          ? data.sponsorshipStatus
          : 'unclear',
        sponsorshipEvidence: String(
          data.sponsorshipEvidence || 'Extracted from job posting text.',
        ),
        salaryDisplay: String(data.salaryDisplay || 'Compensation Unspecified'),
        salaryNumericUsd: Number(data.salaryNumericUsd) || 120000,
        relocationPackage: String(data.relocationPackage || 'Not Specified'),
        workModel: String(data.workModel || 'Hybrid'),
        requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : [],
        description: String(data.description || rawText.slice(0, 260)),
        rawText: rawText.trim(),
      });

      setRawText('');
      setCompanyHint('');
      setTitleHint('');
      setCorridorHint('');
      setIsScanModalOpen(false);
      setActiveView('discover');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to scan posting.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131B2E]/40 backdrop-blur-[4px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scan-job-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-xl border border-[#E2E8F0] shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2
              id="scan-job-title"
              className="font-display text-lg font-semibold text-[#131B2E]"
            >
              Scan &amp; Classify Job Posting
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Gemini extracts sponsorship certainty, visa subclass, and salary thresholds and opens Screen #2.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsScanModalOpen(false)}
            aria-label="Close modal"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#131B2E] hover:bg-[#F2F3FF]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#64748B]">Quick fill:</span>
            {SAMPLE_POSTINGS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setCompanyHint(sample.company);
                  setTitleHint(sample.title);
                  setCorridorHint(sample.corridor);
                  setRawText(sample.text);
                  setErrorMsg(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#DAE2FD] bg-[#FAF8FF] hover:bg-[#EAEDFF] text-xs font-medium text-[#131B2E] transition-colors whitespace-nowrap shrink-0"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="scan-company"
                className="block text-xs font-semibold text-[#334155] mb-1"
              >
                Company (Optional)
              </label>
              <input
                id="scan-company"
                type="text"
                value={companyHint}
                onChange={(e) => setCompanyHint(e.target.value)}
                placeholder="e.g. Wise"
                className="w-full h-10 px-3 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#131B2E] focus:outline-none focus:border-[#3525CD] focus:ring-2 focus:ring-[#3525CD]/15"
              />
            </div>

            <div>
              <label
                htmlFor="scan-title"
                className="block text-xs font-semibold text-[#334155] mb-1"
              >
                Role Title (Optional)
              </label>
              <input
                id="scan-title"
                type="text"
                value={titleHint}
                onChange={(e) => setTitleHint(e.target.value)}
                placeholder="e.g. Staff Engineer"
                className="w-full h-10 px-3 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#131B2E] focus:outline-none focus:border-[#3525CD] focus:ring-2 focus:ring-[#3525CD]/15"
              />
            </div>

            <div>
              <label
                htmlFor="scan-corridor"
                className="block text-xs font-semibold text-[#334155] mb-1"
              >
                Corridor Hint
              </label>
              <select
                id="scan-corridor"
                value={corridorHint}
                onChange={(e) => setCorridorHint(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#131B2E] focus:outline-none focus:border-[#3525CD] focus:ring-2 focus:ring-[#3525CD]/15"
              >
                <option value="">Auto-detect</option>
                <option value="UK_SWV">UK Skilled Worker</option>
                <option value="EU_BLUE_CARD">EU Blue Card (DE &amp; NL)</option>
                <option value="US_H1B_O1">US H-1B &amp; O-1</option>
                <option value="AU_CA_GTS">AU 482 &amp; Canada GTS</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="scan-raw-text"
              className="block text-xs font-semibold text-[#334155] mb-1"
            >
              Job Description &amp; Visa Policy Copy
            </label>
            <textarea
              id="scan-raw-text"
              rows={7}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste full job description, compensation band, and sponsorship/relocation clauses..."
              className="w-full p-3 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#131B2E] focus:outline-none focus:border-[#3525CD] focus:ring-2 focus:ring-[#3525CD]/15"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs font-medium text-[#991B1B] flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#EF4444]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsScanModalOpen(false)}
              className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#FAF8FF] text-sm font-medium text-[#334155]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isScanning}
              className="h-10 px-4 rounded-lg bg-[#3525CD] hover:bg-[#4F46E5] disabled:opacity-60 text-white text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing Posting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze &amp; Add Role</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
