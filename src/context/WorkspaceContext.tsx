import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {
  INITIAL_CANDIDATE_PROFILE,
  INITIAL_ROLES,
  TARGET_JURISDICTION_CARDS,
} from '../data/seedData';
import type {
  CandidateProfile,
  CategorizedSkill,
  JurisdictionScope,
  OpportunityRole,
  PipelineStage,
  SkillCategory,
  SponsorshipStatus,
  TailoredDiffSession,
  TargetJurisdictionId,
  VisaAuditResult,
  VisaCorridor,
  WorkflowEvent,
  WorkspaceView,
} from '../types';

const STORAGE_KEY = 'careercopilot_mobility_v3';

interface PersistedState {
  profile: CandidateProfile;
  roles: OpportunityRole[];
  jurisdiction: JurisdictionScope;
  cvEvents: WorkflowEvent[];
}

interface WorkspaceContextValue {
  activeView: WorkspaceView;
  setActiveView: (view: WorkspaceView) => void;
  jurisdiction: JurisdictionScope;
  setJurisdiction: (scope: JurisdictionScope) => void;
  profile: CandidateProfile;
  updateProfile: (updated: CandidateProfile) => void;
  isIngestingCv: boolean;
  ingestCvFile: (file: File) => Promise<void>;
  removeSourceDocument: () => void;
  addCategorizedSkill: (name: string, category: SkillCategory, levelLabel?: string) => void;
  removeCategorizedSkill: (skillId: string) => void;
  toggleTargetJurisdiction: (id: TargetJurisdictionId) => void;
  roles: OpportunityRole[];
  detailDrawerRoleId: string | null;
  openDetailDrawer: (roleId: string) => void;
  closeDetailDrawer: () => void;
  modalCopilotRoleId: string | null;
  openCopilotModal: (roleId: string) => void;
  closeCopilotModal: () => void;
  isScanModalOpen: boolean;
  setIsScanModalOpen: (open: boolean) => void;
  bannerNotice: {type: 'success' | 'error'; message: string} | null;
  clearBannerNotice: () => void;
  auditingRoleIds: Record<string, boolean>;
  tailoringRoleIds: Record<string, boolean>;
  toggleSaveRole: (roleId: string) => void;
  auditRoleVisa: (roleId: string) => Promise<void>;
  generateTailoredDiff: (roleId: string, directive?: string) => Promise<void>;
  toggleDiffHunk: (roleId: string, hunkId: string) => void;
  setAllDiffHunks: (roleId: string, accepted: boolean) => void;
  deployApplication: (roleId: string) => void;
  updateRoleStage: (roleId: string, stage: PipelineStage) => void;
  addScannedRole: (payload: {
    company: string;
    title: string;
    location: string;
    corridor: VisaCorridor;
    visaSubclass: string;
    sponsorshipStatus: SponsorshipStatus;
    sponsorshipEvidence: string;
    salaryDisplay: string;
    salaryNumericUsd: number;
    relocationPackage: string;
    workModel: string;
    requiredSkills: string[];
    description: string;
    rawText: string;
  }) => OpportunityRole;
  allAgentLogs: Array<WorkflowEvent & {roleId: string; company: string; trackingCode: string}>;
  resetDemoWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

async function computeSha256Hex(buffer: ArrayBuffer): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const bytes = Array.from(new Uint8Array(hashBuffer));
    return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return `local-${buffer.byteLength.toString(16)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && parsed.profile && Array.isArray(parsed.roles) && parsed.roles.length > 0) {
        return {
          profile: parsed.profile,
          roles: parsed.roles,
          jurisdiction: parsed.jurisdiction ?? 'ALL',
          cvEvents: Array.isArray(parsed.cvEvents) ? parsed.cvEvents : [],
        };
      }
    }
  } catch {
    // Fallback
  }
  return {
    profile: INITIAL_CANDIDATE_PROFILE,
    roles: INITIAL_ROLES,
    jurisdiction: 'ALL',
    cvEvents: [
      {
        id: 'cv-evt-init',
        timestamp: '2026-11-16T08:30:00.000Z',
        action: 'Master CV Anchored',
        detail: `Parsed ${INITIAL_CANDIDATE_PROFILE.sourceDocument?.fileName} (${INITIAL_CANDIDATE_PROFILE.categorizedSkills.length} competencies extracted).`,
        source: 'gemini-cv',
      },
    ],
  };
}

export function WorkspaceProvider({children}: {children: React.ReactNode}) {
  const initial = useMemo(() => loadInitialState(), []);
  const [activeView, setActiveView] = useState<WorkspaceView>('discover');
  const [jurisdiction, setJurisdiction] = useState<JurisdictionScope>(initial.jurisdiction);
  const [profile, setProfile] = useState<CandidateProfile>(initial.profile);
  const [roles, setRoles] = useState<OpportunityRole[]>(initial.roles);
  const [cvEvents, setCvEvents] = useState<WorkflowEvent[]>(initial.cvEvents);
  const [detailDrawerRoleId, setDetailDrawerRoleId] = useState<string | null>(null);
  const [modalCopilotRoleId, setModalCopilotRoleId] = useState<string | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isIngestingCv, setIsIngestingCv] = useState(false);
  const [auditingRoleIds, setAuditingRoleIds] = useState<Record<string, boolean>>({});
  const [tailoringRoleIds, setTailoringRoleIds] = useState<Record<string, boolean>>({});
  const [bannerNotice, setBannerNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({profile, roles, jurisdiction, cvEvents}),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [profile, roles, jurisdiction, cvEvents]);

  const clearBannerNotice = () => setBannerNotice(null);

  const updateProfile = (updated: CandidateProfile) => {
    setProfile(updated);
    setBannerNotice({
      type: 'success',
      message: 'CV baseline and regulatory profile saved.',
    });
  };

  const ingestCvFile = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      setBannerNotice({
        type: 'error',
        message: 'File exceeds the 15 MB limit. Upload a smaller PDF, DOCX, or TXT CV.',
      });
      return;
    }

    setIsIngestingCv(true);
    setBannerNotice(null);

    try {
      const buffer = await file.arrayBuffer();
      const sha256 = await computeSha256Hex(buffer);
      const lower = file.name.toLowerCase();
      const isText =
        file.type.startsWith('text/') || lower.endsWith('.txt') || lower.endsWith('.md');

      const payload = {
        fileName: file.name,
        mimeType: file.type,
        fileBase64: isText ? undefined : arrayBufferToBase64(buffer),
        textContent: isText ? new TextDecoder().decode(buffer) : undefined,
      };

      const res = await fetch('/api/cv/ingest', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gemini CV parsing failed.');
      }

      const categorizedSkills: CategorizedSkill[] = Array.isArray(data.categorizedSkills)
        ? data.categorizedSkills
        : [];
      const flatSkills = categorizedSkills.map((s) => s.name);

      const now = new Date().toISOString();
      setProfile((prev) => ({
        ...prev,
        name: data.name || prev.name,
        currentTitle: data.currentTitle || prev.currentTitle,
        yearsExperience: Number(data.yearsExperience) || prev.yearsExperience,
        highestDegree: data.highestDegree || prev.highestDegree,
        citizenship: data.citizenship || prev.citizenship,
        currentLocation: data.currentLocation || prev.currentLocation,
        summary: data.summary || prev.summary,
        experienceBullets:
          Array.isArray(data.experienceBullets) && data.experienceBullets.length > 0
            ? data.experienceBullets
            : prev.experienceBullets,
        skills: flatSkills.length > 0 ? flatSkills : prev.skills,
        categorizedSkills:
          categorizedSkills.length > 0 ? categorizedSkills : prev.categorizedSkills,
        identifiedClassifications:
          Array.isArray(data.identifiedClassifications) &&
          data.identifiedClassifications.length > 0
            ? data.identifiedClassifications
            : prev.identifiedClassifications,
        sourceDocument: {
          fileName: file.name,
          fileSizeLabel: formatFileSize(file.size),
          sha256,
          uploadedAt: now,
          extractedText: String(data.extractedText ?? ''),
        },
      }));

      setCvEvents((prev) => [
        {
          id: `cv-evt-${Date.now()}`,
          timestamp: now,
          action: 'Master CV Ingested',
          detail: `Gemini parsed ${file.name} (${categorizedSkills.length} competencies · SHA-256 ${sha256.slice(0, 10)}...).`,
          source: 'gemini-cv',
        },
        ...prev,
      ]);

      setBannerNotice({
        type: 'success',
        message: `Ingested ${file.name} and extracted ${categorizedSkills.length} competencies via Gemini.`,
      });
    } catch (err) {
      setBannerNotice({
        type: 'error',
        message: err instanceof Error ? err.message : 'Unable to parse CV file.',
      });
    } finally {
      setIsIngestingCv(false);
    }
  };

  const removeSourceDocument = () => {
    setProfile((prev) => ({
      ...prev,
      sourceDocument: null,
    }));
    setBannerNotice({
      type: 'success',
      message: 'Removed source CV file. Upload a new PDF, DOCX, or TXT resume.',
    });
  };

  const addCategorizedSkill = (
    name: string,
    category: SkillCategory,
    levelLabel = 'Verified',
  ) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setProfile((prev) => {
      const nextSkill: CategorizedSkill = {
        id: `sk-${Date.now()}`,
        name: trimmed,
        category,
        levelLabel,
        badgeLabel: '',
      };
      const nextCategorized = [...prev.categorizedSkills, nextSkill];
      return {
        ...prev,
        categorizedSkills: nextCategorized,
        skills: nextCategorized.map((s) => s.name),
      };
    });
  };

  const removeCategorizedSkill = (skillId: string) => {
    setProfile((prev) => {
      const nextCategorized = prev.categorizedSkills.filter((s) => s.id !== skillId);
      return {
        ...prev,
        categorizedSkills: nextCategorized,
        skills: nextCategorized.map((s) => s.name),
      };
    });
  };

  const toggleTargetJurisdiction = (id: TargetJurisdictionId) => {
    setProfile((prev) => {
      const exists = prev.selectedJurisdictions.includes(id);
      const nextJurisdictions = exists
        ? prev.selectedJurisdictions.filter((j) => j !== id)
        : [...prev.selectedJurisdictions, id];
      const mappedCorridors = Array.from(
        new Set(
          TARGET_JURISDICTION_CARDS.filter((card) =>
            nextJurisdictions.includes(card.id),
          ).map((card) => card.corridor),
        ),
      );
      return {
        ...prev,
        selectedJurisdictions: nextJurisdictions,
        preferredCorridors: mappedCorridors,
      };
    });
  };

  const openDetailDrawer = (roleId: string) => setDetailDrawerRoleId(roleId);
  const closeDetailDrawer = () => setDetailDrawerRoleId(null);

  const openCopilotModal = (roleId: string) => setModalCopilotRoleId(roleId);
  const closeCopilotModal = () => setModalCopilotRoleId(null);

  const toggleSaveRole = (roleId: string) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? {...r, saved: !r.saved} : r)),
    );
  };

  const auditRoleVisa = async (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    setAuditingRoleIds((prev) => ({...prev, [roleId]: true}));
    setBannerNotice(null);

    try {
      const res = await fetch('/api/visa/analyze', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({profile, role}),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to run Gemini visa eligibility audit.');
      }
      const auditResult = data as VisaAuditResult;
      setRoles((prev) =>
        prev.map((r) => {
          if (r.id !== roleId) return r;
          const nextStage: PipelineStage =
            r.stage === 'discovered' ? 'visa_screened' : r.stage;
          return {
            ...r,
            stage: nextStage,
            audit: auditResult,
            events: [
              {
                id: `evt-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: 'Gemini Visa Audit Completed',
                detail: `${auditResult.recommendedSubclass} · Verdict: ${auditResult.eligibilityStatus}`,
                source: 'gemini-audit',
              },
              ...r.events,
            ],
          };
        }),
      );
      setBannerNotice({
        type: 'success',
        message: `Visa audit completed for ${role.company} (${auditResult.recommendedSubclass}).`,
      });
    } catch (err) {
      setBannerNotice({
        type: 'error',
        message: err instanceof Error ? err.message : 'Unable to complete visa audit.',
      });
    } finally {
      setAuditingRoleIds((prev) => ({...prev, [roleId]: false}));
    }
  };

  const generateTailoredDiff = async (roleId: string, directive?: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    setTailoringRoleIds((prev) => ({...prev, [roleId]: true}));
    setBannerNotice(null);

    try {
      const res = await fetch('/api/copilot/tailor', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({profile, role, directive}),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate resume diff via Gemini.');
      }

      const session: TailoredDiffSession = {
        overallStrategy: data.overallStrategy,
        visaKeywordNotes: data.visaKeywordNotes ?? [],
        hunks: data.hunks ?? [],
        generatedAt: data.generatedAt ?? new Date().toISOString(),
        directive,
      };

      setRoles((prev) =>
        prev.map((r) => {
          if (r.id !== roleId) return r;
          const nextStage: PipelineStage =
            r.stage === 'discovered' || r.stage === 'visa_screened'
              ? 'resume_tailored'
              : r.stage;
          return {
            ...r,
            stage: nextStage,
            diffSession: session,
            events: [
              {
                id: `evt-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: 'Gemini CV Diff Generated',
                detail: `${session.hunks.length} tailored sections prepared for ${r.visaSubclass}.`,
                source: 'gemini-diff',
              },
              ...r.events,
            ],
          };
        }),
      );
    } catch (err) {
      setBannerNotice({
        type: 'error',
        message: err instanceof Error ? err.message : 'Unable to tailor resume.',
      });
    } finally {
      setTailoringRoleIds((prev) => ({...prev, [roleId]: false}));
    }
  };

  const toggleDiffHunk = (roleId: string, hunkId: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId || !r.diffSession) return r;
        return {
          ...r,
          diffSession: {
            ...r.diffSession,
            hunks: r.diffSession.hunks.map((h) =>
              h.id === hunkId ? {...h, accepted: !h.accepted} : h,
            ),
          },
        };
      }),
    );
  };

  const setAllDiffHunks = (roleId: string, accepted: boolean) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId || !r.diffSession) return r;
        return {
          ...r,
          diffSession: {
            ...r.diffSession,
            hunks: r.diffSession.hunks.map((h) => ({...h, accepted})),
          },
        };
      }),
    );
  };

  const deployApplication = (roleId: string) => {
    const target = roles.find((r) => r.id === roleId);
    if (!target) return;

    const compiledSections =
      target.diffSession?.hunks
        .map((h) => `[${h.section}]\n${h.accepted ? h.optimizedText : h.originalText}`)
        .join('\n\n') ?? `${profile.summary}\n\n${profile.experienceBullets.join('\n')}`;

    const now = new Date().toISOString();
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        return {
          ...r,
          stage: 'submitted',
          deployedAt: now,
          deployedResumeText: compiledSections,
          events: [
            {
              id: `evt-${Date.now()}`,
              timestamp: now,
              action: 'Application Deployed',
              detail: `Submitted tailored CV package for ${r.title} (${r.visaSubclass}).`,
              source: 'pipeline',
            },
            ...r.events,
          ],
        };
      }),
    );
    setModalCopilotRoleId(null);
    setDetailDrawerRoleId(null);
    setBannerNotice({
      type: 'success',
      message: `Application deployed to ${target.company} and tracked under Applications.`,
    });
  };

  const updateRoleStage = (roleId: string, stage: PipelineStage) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId || r.stage === stage) return r;
        return {
          ...r,
          stage,
          events: [
            {
              id: `evt-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: 'Pipeline Stage Updated',
              detail: `Moved application stage to ${stage.replace('_', ' ')}.`,
              source: 'pipeline',
            },
            ...r.events,
          ],
        };
      }),
    );
  };

  const addScannedRole: WorkspaceContextValue['addScannedRole'] = (payload) => {
    const flagByCorridor: Record<VisaCorridor, string> = {
      UK_SWV: '🇬🇧',
      EU_BLUE_CARD: '🇪🇺',
      US_H1B_O1: '🇺🇸',
      AU_CA_GTS: '🇦🇺',
    };
    const newRole: OpportunityRole = {
      id: `role-custom-${Date.now()}`,
      trackingCode: `AM-${Math.floor(2700 + Math.random() * 299)}`,
      company: payload.company,
      title: payload.title,
      location: payload.location,
      countryFlag: flagByCorridor[payload.corridor],
      corridor: payload.corridor,
      visaSubclass: payload.visaSubclass,
      sponsorshipStatus: payload.sponsorshipStatus,
      sponsorRegistryId:
        payload.sponsorshipStatus === 'verified' ? 'SCAN-VERIFIED' : 'SCAN-EXTRACTED',
      sponsorshipEvidence: payload.sponsorshipEvidence,
      corridorThresholdNote: `${payload.salaryDisplay} · Scanned for ${payload.visaSubclass}`,
      salaryDisplay: payload.salaryDisplay,
      salaryNumericUsd: payload.salaryNumericUsd,
      relocationPackage: payload.relocationPackage,
      contractType: 'Full-time Permanent',
      orgGroup: 'Engineering Core',
      workModel: payload.workModel,
      fitScore: payload.sponsorshipStatus === 'ineligible' ? 58 : 90,
      poolLabel: payload.sponsorshipStatus === 'verified' ? 'Top 5% Pool' : 'Scanned Match',
      saved: true,
      postedAt: new Date().toISOString().slice(0, 10),
      requiredSkills: payload.requiredSkills,
      description: payload.description,
      originalPostingText: payload.rawText,
      stage: 'discovered',
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Job Posting Scanned',
          detail: `Gemini classified ${payload.company} as ${payload.sponsorshipStatus} (${payload.visaSubclass}).`,
          source: 'gemini-scan',
        },
      ],
    };
    setRoles((prev) => [newRole, ...prev]);
    setDetailDrawerRoleId(newRole.id);
    setBannerNotice({
      type: 'success',
      message: `Added ${newRole.company} — ${newRole.title} and opened Sponsorship Evidence.`,
    });
    return newRole;
  };

  const allAgentLogs = useMemo(() => {
    const entries: Array<
      WorkflowEvent & {roleId: string; company: string; trackingCode: string}
    > = [];
    for (const evt of cvEvents) {
      entries.push({
        ...evt,
        roleId: roles[0]?.id ?? '',
        company: 'Master CV Baseline',
        trackingCode: profile.candidateId,
      });
    }
    for (const role of roles) {
      for (const evt of role.events) {
        entries.push({
          ...evt,
          roleId: role.id,
          company: role.company,
          trackingCode: role.trackingCode,
        });
      }
    }
    return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [roles, cvEvents, profile.candidateId]);

  const resetDemoWorkspace = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(INITIAL_CANDIDATE_PROFILE);
    setRoles(INITIAL_ROLES);
    setJurisdiction('ALL');
    setDetailDrawerRoleId(null);
    setBannerNotice({
      type: 'success',
      message: 'Workspace restored to default global corridor baseline.',
    });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeView,
        setActiveView,
        jurisdiction,
        setJurisdiction,
        profile,
        updateProfile,
        isIngestingCv,
        ingestCvFile,
        removeSourceDocument,
        addCategorizedSkill,
        removeCategorizedSkill,
        toggleTargetJurisdiction,
        roles,
        detailDrawerRoleId,
        openDetailDrawer,
        closeDetailDrawer,
        modalCopilotRoleId,
        openCopilotModal,
        closeCopilotModal,
        isScanModalOpen,
        setIsScanModalOpen,
        bannerNotice,
        clearBannerNotice,
        auditingRoleIds,
        tailoringRoleIds,
        toggleSaveRole,
        auditRoleVisa,
        generateTailoredDiff,
        toggleDiffHunk,
        setAllDiffHunks,
        deployApplication,
        updateRoleStage,
        addScannedRole,
        allAgentLogs,
        resetDemoWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return ctx;
}
