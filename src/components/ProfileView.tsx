import {useEffect, useMemo, useRef, useState} from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CloudUpload,
  Eye,
  FileText,
  History,
  Loader2,
  Lock,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {TARGET_JURISDICTION_CARDS} from '../data/seedData';
import type {CandidateProfile, SkillCategory} from '../types';

const CATEGORY_SECTIONS: Array<{
  id: SkillCategory;
  title: string;
}> = [
  {id: 'languages', title: 'Languages & Core Systems'},
  {id: 'infrastructure', title: 'Infrastructure, Cloud & Distributed Primitives'},
  {id: 'architecture', title: 'High-Scale Architecture & System Metrics'},
];

export function ProfileView() {
  const {
    profile,
    updateProfile,
    roles,
    isIngestingCv,
    ingestCvFile,
    removeSourceDocument,
    addCategorizedSkill,
    removeCategorizedSkill,
    toggleTargetJurisdiction,
    setActiveView,
  } = useWorkspace();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] =
    useState<SkillCategory>('infrastructure');
  const [showBulletsEditor, setShowBulletsEditor] = useState(false);
  const [draft, setDraft] = useState<CandidateProfile>(profile);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleFileSelected = (file: File | undefined) => {
    if (!file) return;
    void ingestCvFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelected(file);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addCategorizedSkill(newSkillName, newSkillCategory);
    setNewSkillName('');
    setIsAddingSkill(false);
  };

  const handleBulletChange = (idx: number, val: string) => {
    setDraft((prev) => {
      const next = [...prev.experienceBullets];
      next[idx] = val;
      return {...prev, experienceBullets: next};
    });
  };

  const handleSaveAndProceed = () => {
    updateProfile({
      ...profile,
      name: draft.name,
      currentTitle: draft.currentTitle,
      yearsExperience: draft.yearsExperience,
      highestDegree: draft.highestDegree,
      citizenship: draft.citizenship,
      currentLocation: draft.currentLocation,
      summary: draft.summary,
      experienceBullets: draft.experienceBullets.filter((b) => b.trim().length > 0),
    });
    setActiveView('discover');
  };

  const selectedJurisdictionCards = useMemo(
    () =>
      TARGET_JURISDICTION_CARDS.filter((card) =>
        profile.selectedJurisdictions.includes(card.id),
      ),
    [profile.selectedJurisdictions],
  );

  const matchingOpeningsCount = useMemo(() => {
    const activeCorridors = new Set(selectedJurisdictionCards.map((c) => c.corridor));
    return roles.filter(
      (r) =>
        r.sponsorshipStatus !== 'ineligible' &&
        (activeCorridors.size === 0 || activeCorridors.has(r.corridor)),
    ).length;
  }, [roles, selectedJurisdictionCards]);

  const readinessScore = useMemo(() => {
    let score = 62;
    if (profile.sourceDocument) score += 16;
    if (profile.categorizedSkills.length >= 6) score += 8;
    if (profile.selectedJurisdictions.length >= 1) score += 6;
    if (profile.summary.trim().length > 30) score += 3;
    if (profile.highestDegree.trim().length > 4) score += 3;
    return Math.min(99, score);
  }, [profile]);

  const shaDisplay = profile.sourceDocument
    ? `${profile.sourceDocument.sha256.slice(0, 8)}...${profile.sourceDocument.sha256.slice(-5)}`
    : '';

  const primaryFloorCard = selectedJurisdictionCards[0] ?? TARGET_JURISDICTION_CARDS[0];
  const secondaryFloorCard = selectedJurisdictionCards[1] ?? TARGET_JURISDICTION_CARDS[1];

  return (
    <div className="space-y-6 pb-24">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="hidden"
        onChange={(e) => {
          handleFileSelected(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {/* Step Progress Bar matching Screen #3 */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-[#EAEDFF] text-[#3525CD] font-mono text-[11px] font-bold tracking-[0.04em] whitespace-nowrap">
            STEP 1 OF 3
          </span>
          <span className="text-sm font-semibold text-[#131B2E]">
            Master Profile Ingestion &amp; Regulatory Skill Baseline
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5 text-[#3525CD] font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#3525CD]" aria-hidden="true" />
            <span>1. CV Ingestion</span>
          </span>
          <span className="text-[#CBD5E1]" aria-hidden="true">
            /
          </span>
          <button
            type="button"
            onClick={() => setActiveView('visa-radar')}
            className="text-[#64748B] hover:text-[#131B2E] transition-colors"
          >
            2. Visa Criteria Scoring
          </button>
          <span className="text-[#CBD5E1]" aria-hidden="true">
            /
          </span>
          <button
            type="button"
            onClick={() => setShowBulletsEditor((v) => !v)}
            className="text-[#64748B] hover:text-[#131B2E] transition-colors"
          >
            3. Summary &amp; Bullets Baseline
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-[-0.02em] text-[#131B2E]">
            Upload Master CV &amp; Benchmark Eligibility
          </h1>
          <p className="mt-1 text-sm text-[#464555] leading-6">
            Upload your existing source resume. CareerCopilot AI extracts verifiable engineering skills, benchmarks your qualifications against global sponsor registries, and anchors your baseline for CV diffing.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#DAE2FD] px-4 py-3 flex items-center gap-3 shrink-0">
          <span className="h-9 w-9 rounded-lg bg-[#EAEDFF] text-[#3525CD] flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.06em] text-[#64748B] uppercase">
              Baseline Integrity
            </p>
            <p className="text-xs font-semibold text-[#131B2E]">
              SHA-256 Cryptographic Anchor
            </p>
          </div>
        </div>
      </div>

      {/* Main 12-Column Layout (8-col Left + 4-col Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Source Resume File */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="h-8 w-8 rounded-lg bg-[#EAEDFF] text-[#3525CD] flex items-center justify-center">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="font-display text-base font-semibold text-[#131B2E]">
                  Source Resume File
                </h2>
              </div>
              <span className="text-xs text-[#64748B]">
                Supported: PDF, DOCX, TXT (Max 15MB)
              </span>
            </div>

            {/* Drag & Drop Ingestion Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-7 text-center transition-colors ${
                isDragActive
                  ? 'border-[#3525CD] bg-[#EAEDFF]/60'
                  : 'border-[#DAE2FD] bg-[#F2F3FF]/50 hover:border-[#4F46E5]/50'
              }`}
            >
              <div className="h-11 w-11 rounded-full bg-white border border-[#DAE2FD] text-[#3525CD] flex items-center justify-center mx-auto mb-3 shadow-sm">
                {isIngestingCv ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CloudUpload className="h-5 w-5" />
                )}
              </div>

              {isIngestingCv ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#131B2E]">
                    Gemini AI is parsing your CV &amp; extracting competencies...
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Computing SHA-256 fingerprint and mapping visa occupation codes
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#131B2E]">
                    Drag and drop your CV/Resume here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#3525CD] hover:underline font-semibold"
                    >
                      Browse files
                    </button>
                  </p>
                  <p className="text-xs text-[#64748B]">
                    CareerCopilot extracts semantic work history, structural metrics, and tech stacks directly from your document.
                  </p>
                </div>
              )}
            </div>

            {/* Active Uploaded File Card */}
            {profile.sourceDocument && (
              <div className="rounded-xl border border-[#DAE2FD] bg-[#FAF8FF] p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#BA1A1A] flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#131B2E] truncate max-w-[300px]">
                          {profile.sourceDocument.fileName}
                        </p>
                        <span className="text-xs text-[#64748B] font-mono tabular-nums-strict">
                          ({profile.sourceDocument.fileSizeLabel})
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-semibold text-[#065F46]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                          <span>Parsed &amp; Vectorized (100%)</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#EAEDFF] text-[#3525CD] font-mono text-[11px] font-medium tabular-nums-strict">
                          SHA-256: {shaDisplay}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-9 px-3 rounded-lg border border-[#C7C4D8] bg-white hover:bg-[#F2F3FF] text-xs font-semibold text-[#131B2E] inline-flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={removeSourceDocument}
                      aria-label="Remove uploaded CV file"
                      className="h-9 w-9 rounded-lg border border-[#FECACA] bg-white hover:bg-[#FEF2F2] text-[#BA1A1A] flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Emerald Progress Bar */}
                <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div className="h-full w-full bg-[#006E4B] rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#334155]">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#006E4B]" />
                    <span>Document Parsing</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#006E4B]" />
                    <span>Taxonomy &amp; Entities</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#006E4B]" />
                    <span>Sponsorship Feasibility</span>
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Card 2: Extracted Engineering Competencies */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-semibold text-[#131B2E]">
                  Extracted Engineering Competencies
                </h2>
                <p className="text-xs text-[#464555] mt-0.5">
                  Semantic tags used by the Copilot radar to evaluate shortage occupations and high-demand tech thresholds.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingSkill((v) => !v)}
                className="h-9 px-3 rounded-lg border border-[#DAE2FD] bg-[#F2F3FF] hover:bg-[#EAEDFF] text-xs font-semibold text-[#3525CD] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {isAddingSkill && (
              <form
                onSubmit={handleAddSkillSubmit}
                className="p-3 rounded-xl bg-[#FAF8FF] border border-[#DAE2FD] flex flex-col sm:flex-row gap-2.5"
              >
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. PostgreSQL Sharding, gRPC, Go"
                  className="flex-1 h-9 px-3 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#131B2E] focus:outline-none focus:border-[#3525CD]"
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) =>
                    setNewSkillCategory(e.target.value as SkillCategory)
                  }
                  className="h-9 px-3 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#131B2E]"
                >
                  {CATEGORY_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[#3525CD] hover:bg-[#4F46E5] text-white text-xs font-semibold whitespace-nowrap"
                >
                  Add Tag
                </button>
              </form>
            )}

            <div className="space-y-5">
              {CATEGORY_SECTIONS.map((sec) => {
                const items = profile.categorizedSkills.filter(
                  (s) => s.category === sec.id,
                );
                return (
                  <div key={sec.id} className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold tracking-[0.05em] text-[#64748B] uppercase">
                        {sec.title}
                      </p>
                      <span className="font-mono text-xs font-semibold text-[#3525CD] tabular-nums-strict">
                        {items.length} Identified
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <div
                          key={skill.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FAF8FF] text-xs text-[#131B2E]"
                        >
                          <span className="font-semibold">{skill.name}</span>
                          {skill.levelLabel && (
                            <span className="px-1.5 py-0.5 rounded bg-[#EAEDFF] text-[#3525CD] font-medium text-[11px]">
                              {skill.levelLabel}
                            </span>
                          )}
                          {skill.badgeLabel && (
                            <span
                              className={`px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold tabular-nums-strict ${
                                skill.badgeLabel.toLowerCase().includes('demand')
                                  ? 'bg-[#6FFBEE] text-[#005236]'
                                  : 'bg-[#ECFDF5] text-[#065F46]'
                              }`}
                            >
                              {skill.badgeLabel}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeCategorizedSkill(skill.id)}
                            aria-label={`Remove ${skill.name}`}
                            className="text-[#64748B] hover:text-[#BA1A1A] ml-0.5"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Card 3: Collapsible Summary & Experience Bullets Baseline Editor */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBulletsEditor((v) => !v)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FAF8FF] transition-colors"
            >
              <div>
                <h2 className="font-display text-base font-semibold text-[#131B2E]">
                  Executive Summary &amp; Experience Bullets Baseline
                </h2>
                <p className="text-xs text-[#464555] mt-0.5">
                  Review or refine the extracted summary, degree, and bullets fed into Gemini Diff Copilot.
                </p>
              </div>
              {showBulletsEditor ? (
                <ChevronUp className="h-5 w-5 text-[#464555]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#464555]" />
              )}
            </button>

            {showBulletsEditor && (
              <div className="px-6 pb-6 pt-3 border-t border-[#E2E8F0] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) => setDraft({...draft, name: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm text-[#131B2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Current Title
                    </label>
                    <input
                      type="text"
                      value={draft.currentTitle}
                      onChange={(e) =>
                        setDraft({...draft, currentTitle: e.target.value})
                      }
                      className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm text-[#131B2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Highest Degree
                    </label>
                    <input
                      type="text"
                      value={draft.highestDegree}
                      onChange={(e) =>
                        setDraft({...draft, highestDegree: e.target.value})
                      }
                      className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm text-[#131B2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={draft.yearsExperience}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          yearsExperience: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm font-mono tabular-nums-strict text-[#131B2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Baseline Executive Summary
                  </label>
                  <textarea
                    rows={3}
                    value={draft.summary}
                    onChange={(e) => setDraft({...draft, summary: e.target.value})}
                    className="w-full p-3 rounded-lg border border-[#CBD5E1] text-sm text-[#131B2E]"
                  />
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[#334155]">
                    Baseline Experience Bullets
                  </p>
                  {[0, 1, 2].map((idx) => (
                    <textarea
                      key={idx}
                      rows={2}
                      value={draft.experienceBullets[idx] ?? ''}
                      onChange={(e) => handleBulletChange(idx, e.target.value)}
                      className="w-full p-3 rounded-lg border border-[#CBD5E1] text-sm text-[#131B2E]"
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Card 4: Immutable Original Guarantee & Privacy Shield */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-[#6FFBEE]/60 text-[#005236] flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-base font-semibold text-[#131B2E]">
                  Immutable Original Guarantee &amp; Privacy Shield
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAEDFF] text-[#3525CD] text-[11px] font-semibold">
                  Strict Regulatory Compliance
                </span>
              </div>
              <p className="text-sm text-[#464555] leading-6">
                Your original uploaded CV is anchored as a{' '}
                <strong className="text-[#131B2E]">read-only cryptographic baseline</strong>.
                CareerCopilot will never alter your original document, fabricate experience credentials, or dispatch tailored cross-border applications without your explicit review and sign-off in the Diff Copilot.
              </p>
              <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-medium text-[#334155]">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#464555]" />
                  <span>Local Baseline Storage</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#006E4B]" />
                  <span>UK GDPR &amp; EU AI Act Aligned</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-[#464555]" />
                  <span>Full Audit Log Retention</span>
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right 4 Columns */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Target Jurisdictions (All 7 Requested Countries) */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-[#131B2E]">
                Target Jurisdictions
              </h2>
              <button
                type="button"
                onClick={() => setActiveView('visa-radar')}
                className="text-xs font-semibold text-[#3525CD] hover:underline"
              >
                Active Radar
              </button>
            </div>

            <p className="text-xs text-[#464555] leading-5">
              Select target relocation countries to benchmark salary floors and match verified sponsor employers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5">
              {TARGET_JURISDICTION_CARDS.map((card) => {
                const checked = profile.selectedJurisdictions.includes(card.id);
                return (
                  <label
                    key={card.id}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-colors flex items-start gap-2.5 ${
                      checked
                        ? 'border-[#3525CD] bg-[#F2F3FF]/80'
                        : 'border-[#E2E8F0] bg-white hover:bg-[#FAF8FF]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTargetJurisdiction(card.id)}
                      className="h-4 w-4 rounded accent-[#3525CD] mt-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#131B2E] leading-snug">
                        {card.flag} {card.country}
                      </p>
                      <p className="text-[11px] text-[#64748B] leading-tight mt-0.5">
                        {card.program}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Minimum Salary Threshold Comparison */}
            <div className="pt-2 border-t border-[#EAEDFF] grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-medium text-[#64748B]">
                  {primaryFloorCard.country} Target
                </p>
                <p className="mt-1 font-display text-base font-bold text-[#131B2E] font-mono tabular-nums-strict">
                  {primaryFloorCard.floorLabel}
                </p>
                <p className="text-[11px] font-semibold text-[#006E4B]">
                  {primaryFloorCard.reqMinLabel}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#64748B]">
                  {secondaryFloorCard.country} Target
                </p>
                <p className="mt-1 font-display text-base font-bold text-[#131B2E] font-mono tabular-nums-strict">
                  {secondaryFloorCard.floorLabel}
                </p>
                <p className="text-[11px] font-semibold text-[#006E4B]">
                  {secondaryFloorCard.reqMinLabel}
                </p>
              </div>
            </div>

            {/* Identified Regulatory Classifications */}
            <div className="rounded-xl bg-[#F2F3FF] border border-[#DAE2FD] p-3.5 space-y-2.5">
              <p className="text-[10px] font-semibold tracking-[0.06em] text-[#464555] uppercase">
                Identified Regulatory Classifications
              </p>
              {profile.identifiedClassifications.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3525CD] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#131B2E]">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#464555] leading-4 mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Card 2: Eligibility Readiness Index */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
            <h2 className="font-display text-base font-semibold text-[#131B2E]">
              Eligibility Readiness Index
            </h2>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-4xl font-bold text-[#3525CD] font-mono tabular-nums-strict">
                  {readinessScore}%
                </p>
                <p className="text-[10px] font-semibold tracking-[0.05em] text-[#64748B] uppercase mt-0.5">
                  Profile Readiness Score
                </p>
              </div>
              <div className="h-12 w-12 rounded-full border-[3px] border-[#006E4B] bg-[#ECFDF5] text-[#006E4B] flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAEDFF] space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#464555]">Degree Equivalence</span>
                <span className="font-semibold text-[#006E4B]">Matched ✓</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#464555]">Compensation Benchmark</span>
                <span className="font-semibold text-[#006E4B]">Top 5% ✓</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#464555]">Licensed Employer Matches</span>
                <span className="font-mono font-semibold text-[#131B2E] tabular-nums-strict">
                  {matchingOpeningsCount} Active Roles
                </span>
              </div>
            </div>
          </section>

          {/* Card 3: Candidate Identity */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3.5">
            {!imgFailed && draft.avatarUrl ? (
              <img
                src={draft.avatarUrl}
                alt={draft.name}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="h-11 w-11 rounded-full object-cover border border-[#DAE2FD] shrink-0"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-[#3525CD] text-white font-display text-sm font-bold flex items-center justify-center shrink-0">
                {draft.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#131B2E] truncate">
                {draft.name}
              </p>
              <p className="text-xs text-[#464555] truncate">{draft.currentTitle}</p>
              <p className="text-[11px] font-mono text-[#3525CD] font-medium mt-0.5">
                Candidate ID: {profile.candidateId}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl border border-[#DAE2FD] shadow-[0_10px_25px_-5px_rgba(19,27,46,0.1)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#006E4B] shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold text-[#131B2E]">
              Profile Readiness: {readinessScore}%
            </p>
            <p className="text-xs text-[#64748B]">
              Ready for automated Copilot radar &amp; application diff tailoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={isIngestingCv}
            onClick={() => fileInputRef.current?.click()}
            className="h-10 px-4 rounded-xl bg-[#F2F3FF] hover:bg-[#EAEDFF] text-xs font-semibold text-[#131B2E] transition-colors whitespace-nowrap"
          >
            Replace Document
          </button>

          <button
            type="button"
            onClick={handleSaveAndProceed}
            className="h-10 px-5 rounded-xl bg-[#3525CD] hover:bg-[#4F46E5] text-white text-xs font-semibold transition-colors inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span>Save Baseline &amp; Proceed to Job Discovery</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Parsed CV Preview Modal */}
      {isPreviewOpen && profile.sourceDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131B2E]/40 backdrop-blur-[4px]"
          role="dialog"
          aria-modal="true"
          aria-label="Parsed Source CV Preview"
        >
          <div className="w-full max-w-2xl max-h-[82vh] bg-white rounded-xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-[#131B2E]">
                  {profile.sourceDocument.fileName}
                </h3>
                <p className="font-mono text-xs text-[#64748B] tabular-nums-strict">
                  SHA-256: {profile.sourceDocument.sha256}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                aria-label="Close CV preview"
                className="h-9 w-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#131B2E] hover:bg-[#F2F3FF]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-[#FAF8FF]">
              <pre className="text-xs text-[#131B2E] whitespace-pre-wrap font-sans leading-6">
                {profile.sourceDocument.extractedText}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
