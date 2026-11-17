export type WorkspaceView =
  | 'discover'
  | 'saved'
  | 'applications'
  | 'profile'
  | 'visa-radar'
  | 'agent-logs';

export type VisaCorridor =
  | 'UK_SWV'
  | 'EU_BLUE_CARD'
  | 'US_H1B_O1'
  | 'AU_CA_GTS';

export type JurisdictionScope = 'ALL' | 'UK_EU' | 'US' | 'AU_CA';

export type TargetJurisdictionId =
  | 'uk'
  | 'de'
  | 'nl'
  | 'ie'
  | 'us'
  | 'au'
  | 'ca';

export type SkillCategory = 'languages' | 'infrastructure' | 'architecture';

export interface CategorizedSkill {
  id: string;
  name: string;
  category: SkillCategory;
  levelLabel?: string;
  badgeLabel?: string;
}

export interface SourceDocumentMeta {
  fileName: string;
  fileSizeLabel: string;
  sha256: string;
  uploadedAt: string;
  extractedText: string;
}

export interface RegulatoryClassification {
  title: string;
  detail: string;
}

export type SponsorshipStatus = 'verified' | 'stated' | 'unclear' | 'ineligible';

export type PipelineStage =
  | 'discovered'
  | 'visa_screened'
  | 'resume_tailored'
  | 'submitted'
  | 'sponsor_interview';

export interface CandidateProfile {
  candidateId: string;
  name: string;
  avatarUrl: string;
  currentTitle: string;
  yearsExperience: number;
  highestDegree: string;
  citizenship: string;
  currentLocation: string;
  targetSalaryUsd: number;
  preferredCorridors: VisaCorridor[];
  selectedJurisdictions: TargetJurisdictionId[];
  summary: string;
  experienceBullets: string[];
  skills: string[];
  categorizedSkills: CategorizedSkill[];
  identifiedClassifications: RegulatoryClassification[];
  sourceDocument: SourceDocumentMeta | null;
}

export interface VisaAuditResult {
  eligibilityStatus: 'eligible' | 'conditional' | 'ineligible';
  recommendedSubclass: string;
  salaryThresholdCheck: string;
  occupationCodeMatch: string;
  summary: string;
  keyFindings: string[];
  complianceRisks: string[];
  nextSteps: string[];
  auditedAt: string;
}

export interface DiffHunk {
  id: string;
  section: string;
  originalText: string;
  optimizedText: string;
  rationale: string;
  accepted: boolean;
}

export interface TailoredDiffSession {
  overallStrategy: string;
  visaKeywordNotes: string[];
  hunks: DiffHunk[];
  generatedAt: string;
  directive?: string;
}

export interface WorkflowEvent {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  source?: 'gemini-audit' | 'gemini-diff' | 'gemini-scan' | 'gemini-cv' | 'pipeline';
}

export interface OpportunityRole {
  id: string;
  trackingCode: string;
  company: string;
  title: string;
  location: string;
  countryFlag: string;
  corridor: VisaCorridor;
  visaSubclass: string;
  sponsorshipStatus: SponsorshipStatus;
  sponsorRegistryId: string;
  sponsorshipEvidence: string;
  corridorThresholdNote: string;
  salaryDisplay: string;
  salaryNumericUsd: number;
  relocationPackage: string;
  contractType: string;
  orgGroup: string;
  workModel: string;
  fitScore: number;
  poolLabel: string;
  saved: boolean;
  postedAt: string;
  requiredSkills: string[];
  description: string;
  originalPostingText: string;
  stage: PipelineStage;
  audit?: VisaAuditResult;
  diffSession?: TailoredDiffSession;
  deployedResumeText?: string;
  deployedAt?: string;
  events: WorkflowEvent[];
}
