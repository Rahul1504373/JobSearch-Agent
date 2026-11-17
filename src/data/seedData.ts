import type {
  CandidateProfile,
  JurisdictionScope,
  OpportunityRole,
  PipelineStage,
  SponsorshipStatus,
  TargetJurisdictionId,
  VisaCorridor,
} from '../types';

export const TARGET_JURISDICTION_CARDS: Array<{
  id: TargetJurisdictionId;
  country: string;
  flag: string;
  program: string;
  corridor: VisaCorridor;
  floorLabel: string;
  reqMinLabel: string;
}> = [
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    program: 'Skilled Worker Visa',
    corridor: 'UK_SWV',
    floorLabel: '£90,000+',
    reqMinLabel: 'Req. min: £38,700',
  },
  {
    id: 'de',
    country: 'Germany',
    flag: '🇩🇪',
    program: 'EU Blue Card (IT)',
    corridor: 'EU_BLUE_CARD',
    floorLabel: '€100,000+',
    reqMinLabel: 'Req. min: €45,300',
  },
  {
    id: 'nl',
    country: 'Netherlands',
    flag: '🇳🇱',
    program: 'Highly Skilled Migrant',
    corridor: 'EU_BLUE_CARD',
    floorLabel: '€110,000+',
    reqMinLabel: 'Req. min: €64,000',
  },
  {
    id: 'ie',
    country: 'Ireland',
    flag: '🇮🇪',
    program: 'Critical Skills (CSEP)',
    corridor: 'EU_BLUE_CARD',
    floorLabel: '€95,000+',
    reqMinLabel: 'Req. min: €38,000',
  },
  {
    id: 'us',
    country: 'United States',
    flag: '🇺🇸',
    program: 'H-1B & O-1A',
    corridor: 'US_H1B_O1',
    floorLabel: '$185,000+',
    reqMinLabel: 'DOL Prevailing L3/L4',
  },
  {
    id: 'au',
    country: 'Australia',
    flag: '🇦🇺',
    program: 'Subclass 482 Skills',
    corridor: 'AU_CA_GTS',
    floorLabel: 'A$195,000+',
    reqMinLabel: 'Req. min: A$73,150',
  },
  {
    id: 'ca',
    country: 'Canada',
    flag: '🇨🇦',
    program: 'Global Talent Stream',
    corridor: 'AU_CA_GTS',
    floorLabel: 'CA$175,000+',
    reqMinLabel: 'NOC 21231 Median',
  },
];

export const CORRIDOR_META: Record<
  VisaCorridor,
  {
    label: string;
    shortLabel: string;
    statutoryNote: string;
    salaryFloor: string;
    processingTime: string;
  }
> = {
  UK_SWV: {
    label: 'UK Skilled Worker',
    shortLabel: 'Tier 2 / Skilled Worker',
    statutoryNote: 'SOC 2134 / 2136 · Home Office Sponsor Licence',
    salaryFloor: '£49,400 going rate (SOC 2134)',
    processingTime: '3 weeks standard · 5 days priority',
  },
  EU_BLUE_CARD: {
    label: 'EU Blue Card (DE & NL)',
    shortLabel: 'EU Blue Card / IND HSM',
    statutoryNote: 'DE §18g AufenthG · NL IND Highly Skilled Migrant',
    salaryFloor: '€45,300 DE / €64,000+ NL HSM',
    processingTime: '2–4 weeks fast-track',
  },
  US_H1B_O1: {
    label: 'US H-1B & O-1',
    shortLabel: 'H-1B / O-1A',
    statutoryNote: 'Specialty Occupation LCA · Extraordinary Ability',
    salaryFloor: 'DOL Prevailing Wage Level II–IV',
    processingTime: '15 business days (Premium Processing)',
  },
  AU_CA_GTS: {
    label: 'Australia 482 & Canada GTS',
    shortLabel: 'AU 482 / CA GTS',
    statutoryNote: 'Skills in Demand 482 · ESDC Global Talent Stream',
    salaryFloor: 'A$73,150 TSMIT / CA$80,000+ NOC 21231',
    processingTime: '2 weeks (CA GTS) · 3–6 weeks (AU 482)',
  },
};

export const JURISDICTION_META: Record<
  JurisdictionScope,
  {label: string; agentBanner: string; corridors: VisaCorridor[]}
> = {
  UK_EU: {
    label: 'UK Tier 2 & EU Blue Card',
    agentBanner: 'UK & EU Relocation Agent Active',
    corridors: ['UK_SWV', 'EU_BLUE_CARD'],
  },
  ALL: {
    label: 'All 4 Global Corridors',
    agentBanner: 'Global Mobility Agent Active',
    corridors: ['UK_SWV', 'EU_BLUE_CARD', 'US_H1B_O1', 'AU_CA_GTS'],
  },
  US: {
    label: 'US H-1B & O-1A',
    agentBanner: 'US Specialty Visa Agent Active',
    corridors: ['US_H1B_O1'],
  },
  AU_CA: {
    label: 'AU 482 & Canada GTS',
    agentBanner: 'APAC & Canada GTS Agent Active',
    corridors: ['AU_CA_GTS'],
  },
};

export const STAGE_META: Record<PipelineStage, {label: string; order: number}> = {
  discovered: {label: 'Discovered', order: 1},
  visa_screened: {label: 'Visa Screened', order: 2},
  resume_tailored: {label: 'Resume Tailored', order: 3},
  submitted: {label: 'Submitted', order: 4},
  sponsor_interview: {label: 'Sponsor Interview', order: 5},
};

export const SPONSORSHIP_META: Record<
  SponsorshipStatus,
  {label: string; registryBadge: string; description: string}
> = {
  verified: {
    label: 'Verified Sponsor',
    registryBadge: 'Live Verified Registry Record',
    description: 'Active government sponsor licence confirmed on official register',
  },
  stated: {
    label: 'Sponsorship Stated',
    registryBadge: 'Sponsorship Stated in Posting',
    description: 'Employer explicitly states visa sponsorship availability in job copy',
  },
  unclear: {
    label: 'Unclear Sponsorship',
    registryBadge: 'Unverified Registry Match',
    description: 'No explicit visa clause found; verify during recruiter screening',
  },
  ineligible: {
    label: 'Ineligible',
    registryBadge: 'Restricted Work Authorization',
    description: 'Requires existing unrestricted local work authorization',
  },
};

export const INITIAL_CANDIDATE_PROFILE: CandidateProfile = {
  candidateId: 'COPILOT-84920',
  name: 'Arjun Deshmukh',
  avatarUrl: '/src/assets/images/avatar_candidate_profile_1794940773999.jpg',
  currentTitle: 'Principal Distributed Systems Engineer',
  yearsExperience: 8,
  highestDegree: 'M.S. Computer Science (UK ENIC / Anabin H+)',
  citizenship: 'India',
  currentLocation: 'Bengaluru, IN',
  targetSalaryUsd: 140000,
  preferredCorridors: ['UK_SWV', 'EU_BLUE_CARD', 'US_H1B_O1', 'AU_CA_GTS'],
  selectedJurisdictions: ['uk', 'de', 'nl', 'ie', 'us', 'au', 'ca'],
  summary:
    'Principal distributed systems and backend engineer with 8+ years designing high-throughput Go, Rust, and Kubernetes payment ledgers handling 42k RPS with 99.995% availability across multi-region cloud clusters.',
  experienceBullets: [
    'Architected event-driven settlement pipeline in Go and Kafka reducing p99 clearing latency from 310ms to 48ms across 14M daily transactions.',
    'Led migration of 28 stateful payment microservices onto multi-AZ Kubernetes with Terraform IaC, automated canary rollouts, and SOC2 audit controls.',
    'Mentored 9 senior engineers, authored RFC specifications for cross-region idempotency, and cut AWS compute spend by $420k/year through Rust worker consolidation.',
  ],
  skills: [
    'Go / Golang',
    'Rust',
    'Python',
    'TypeScript',
    'Kubernetes (K8s)',
    'AWS (EKS, IAM, RDS)',
    'Apache Kafka',
    'Terraform / IaC',
    'Distributed Consensus (Raft/Paxos)',
    'Docker & Containerd',
    'High-Throughput Microservices (100k+ RPS)',
    'Event-Driven Architecture (EDA)',
    'Low-Latency gRPC & eBPF Telemetry',
  ],
  categorizedSkills: [
    {
      id: 'sk-1',
      name: 'Go / Golang',
      category: 'languages',
      levelLabel: 'Expert (7 yrs)',
      badgeLabel: '98% match',
    },
    {
      id: 'sk-2',
      name: 'Rust',
      category: 'languages',
      levelLabel: 'Proficient (3 yrs)',
      badgeLabel: '92% match',
    },
    {
      id: 'sk-3',
      name: 'Python',
      category: 'languages',
      levelLabel: 'Expert (8 yrs)',
      badgeLabel: '95% match',
    },
    {
      id: 'sk-4',
      name: 'TypeScript',
      category: 'languages',
      levelLabel: 'Intermediate',
      badgeLabel: '',
    },
    {
      id: 'sk-5',
      name: 'Kubernetes (K8s)',
      category: 'infrastructure',
      levelLabel: 'Advanced',
      badgeLabel: '',
    },
    {
      id: 'sk-6',
      name: 'AWS (EKS, IAM, RDS)',
      category: 'infrastructure',
      levelLabel: 'Core Spec',
      badgeLabel: '',
    },
    {
      id: 'sk-7',
      name: 'Apache Kafka',
      category: 'infrastructure',
      levelLabel: 'Stream Architect',
      badgeLabel: '',
    },
    {
      id: 'sk-8',
      name: 'Terraform / IaC',
      category: 'infrastructure',
      levelLabel: '',
      badgeLabel: '',
    },
    {
      id: 'sk-9',
      name: 'Distributed Consensus (Raft/Paxos)',
      category: 'infrastructure',
      levelLabel: 'Shortage Radar Rank 1',
      badgeLabel: '',
    },
    {
      id: 'sk-10',
      name: 'Docker & Containerd',
      category: 'infrastructure',
      levelLabel: '',
      badgeLabel: '',
    },
    {
      id: 'sk-11',
      name: 'High-Throughput Microservices (100k+ RPS)',
      category: 'architecture',
      levelLabel: '',
      badgeLabel: 'High Demand',
    },
    {
      id: 'sk-12',
      name: 'Event-Driven Architecture (EDA)',
      category: 'architecture',
      levelLabel: '',
      badgeLabel: '',
    },
    {
      id: 'sk-13',
      name: 'Low-Latency gRPC & eBPF Telemetry',
      category: 'architecture',
      levelLabel: '',
      badgeLabel: '',
    },
  ],
  identifiedClassifications: [
    {
      title: 'UK SOC 2134 / 2136: Programmers & Devs',
      detail: 'Eligible Skilled Worker Shortage & Going Rate Classification (ISCO-08 2512)',
    },
    {
      title: 'Germany MINT Specialist Category',
      detail: 'Accelerated Permanent Residence eligibility under §18g AufenthG (21 mo.)',
    },
  ],
  sourceDocument: {
    fileName: 'Arjun_Deshmukh_Principal_Distributed_Systems.pdf',
    fileSizeLabel: '2.4 MB',
    sha256: '8f9b7c204e119a6d3f0c82e7b914c6a12f6e',
    uploadedAt: '2026-11-16T08:30:00.000Z',
    extractedText: `ARJUN DESHMUKH — Principal Distributed Systems Engineer
Location: Bengaluru, IN | Education: M.S. Computer Science (UK ENIC / Anabin H+)

EXECUTIVE SUMMARY
Principal distributed systems and backend engineer with 8+ years designing high-throughput Go, Rust, and Kubernetes payment ledgers handling 42k RPS with 99.995% availability across multi-region cloud clusters.

KEY EXPERIENCE
• Architected event-driven settlement pipeline in Go and Kafka reducing p99 clearing latency from 310ms to 48ms across 14M daily transactions.
• Led migration of 28 stateful payment microservices onto multi-AZ Kubernetes with Terraform IaC, automated canary rollouts, and SOC2 audit controls.
• Mentored 9 senior engineers, authored RFC specifications for cross-region idempotency, and cut AWS compute spend by $420k/year through Rust worker consolidation.

CORE STACK
Go / Golang, Rust, Python, TypeScript, Kubernetes (K8s), AWS (EKS, IAM, RDS), Apache Kafka, Terraform, Distributed Consensus (Raft/Paxos), gRPC, eBPF.`,
  },
};

export const INITIAL_ROLES: OpportunityRole[] = [
  {
    id: 'role-uk-monzo',
    trackingCode: 'AM-2614',
    company: 'Monzo Bank',
    title: 'Principal Distributed Systems Engineer',
    location: 'London, UK',
    countryFlag: '🇬🇧',
    corridor: 'UK_SWV',
    visaSubclass: 'Tier 2 / Skilled Worker (SOC 2134)',
    sponsorshipStatus: 'verified',
    sponsorRegistryId: 'HO-UKVI-8849201-A',
    sponsorshipEvidence:
      'Active UK Home Office A-rated Skilled Worker Sponsor Licence (Monzo Bank Limited). Covers Certificate of Sponsorship, 5-year Skilled Worker fee, Immigration Health Surcharge, and family dependant relocation.',
    corridorThresholdNote:
      '£110,000–£130,000 base exceeds SOC 2134 going rate (£49,400) by 122%.',
    salaryDisplay: '£110,000 - £130,000 + Equity',
    salaryNumericUsd: 156000,
    relocationPackage: 'Full Relocation + CoS + IHS Covered',
    contractType: 'Full-time Permanent',
    orgGroup: 'Core Banking Ledger',
    workModel: 'Hybrid City of London',
    fitScore: 96,
    poolLabel: 'Top 1% Pool',
    saved: true,
    postedAt: '2026-11-14',
    requiredSkills: ['Go', 'Kafka', 'Kubernetes', 'Distributed Systems', 'PostgreSQL'],
    description:
      'Design fault-tolerant real-time clearing and Faster Payments ledger infrastructure in Go and Kubernetes. Monzo provides full UK Skilled Worker sponsorship and relocation support.',
    originalPostingText: `Monzo Bank — Principal Distributed Systems Engineer (Core Banking Ledger)
Location: London, UK (Hybrid City of London · 2 days/week)
Compensation: £110,000 - £130,000 + Equity + Pension

About the Role:
Join Core Banking Ledger to architect the distributed settlement engine powering 10M+ UK retail and business accounts. You will own consensus safety, idempotent double-entry ledger partitions, and zero-downtime Kubernetes rollouts across Go microservices.

Requirements:
• 7+ years designing high-throughput distributed systems in Go, Rust, or Java
• Deep production experience with Kafka, PostgreSQL partitioning, and multi-AZ Kubernetes
• Track record writing technical RFCs and mentoring senior/staff engineers

Visa & Relocation:
Monzo Bank Limited is an A-rated UK Home Office Skilled Worker Sponsor. We sponsor Tier 2 / Skilled Worker visas (including partner/dependant visas), cover IHS fees, and provide dedicated London relocation assistance.`,
    stage: 'visa_screened',
    audit: {
      eligibilityStatus: 'eligible',
      recommendedSubclass: 'UK Skilled Worker (SOC 2134 — Programmers & Software Developers)',
      salaryThresholdCheck:
        'Offered £110k–£130k exceeds the statutory £49,400 SOC 2134 going rate by >122%.',
      occupationCodeMatch:
        'Exact match to SOC 2134; 8 years distributed ledger experience and M.S. CS satisfy skill level.',
      summary:
        'Candidate satisfies all UK Skilled Worker salary, occupation code, and sponsor licence criteria with full dependant coverage.',
      keyFindings: [
        'Employer verified on UK Home Office Register of Licensed Sponsors (A-rated).',
        'Compensation comfortably clears both general (£38,700) and SOC 2134 (£49,400) thresholds.',
        'M.S. Computer Science enables streamlined ECCTIS English language verification.',
      ],
      complianceRisks: [
        'Prepare ECCTIS degree confirmation or IELTS UKVI certificate before CoS issuance.',
      ],
      nextSteps: [
        'Tailor resume in Diff Copilot to foreground double-entry ledger idempotency and Go scale.',
        'Submit application with UKVI-ready academic transcript summary.',
      ],
      auditedAt: '2026-11-16T09:15:00.000Z',
    },
    events: [
      {
        id: 'evt-1',
        timestamp: '2026-11-15T11:20:00.000Z',
        action: 'Sponsor Registry Verified',
        detail: 'Matched Home Office Sponsor Licence HO-UKVI-8849201-A (A-rated).',
        source: 'pipeline',
      },
      {
        id: 'evt-2',
        timestamp: '2026-11-16T09:15:00.000Z',
        action: 'Visa Audit Completed',
        detail: 'Cleared UK Skilled Worker threshold check (SOC 2134 · 96% Fit).',
        source: 'gemini-audit',
      },
    ],
  },
  {
    id: 'role-de-celonis',
    trackingCode: 'AM-2619',
    company: 'Celonis SE',
    title: 'Principal Platform Engineer — Execution Engine',
    location: 'Munich, Germany',
    countryFlag: '🇩🇪',
    corridor: 'EU_BLUE_CARD',
    visaSubclass: 'DE §18g EU Blue Card',
    sponsorshipStatus: 'verified',
    sponsorRegistryId: 'DE-BA-MUN-44109',
    sponsorshipEvidence:
      'German Federal Employment Agency recognized employer with dedicated Munich Global Mobility counsel supporting §18g EU Blue Card fast-track (§81a accelerated procedure).',
    corridorThresholdNote:
      '€112,000–€128,000 exceeds DE §18g regular Blue Card threshold (€45,300) by 147%.',
    salaryDisplay: '€112,000 - €128,000',
    salaryNumericUsd: 129000,
    relocationPackage: 'Full Relocation + §81a Fast-Track Counsel',
    contractType: 'Full-time Permanent',
    orgGroup: 'Process Execution Core',
    workModel: 'Hybrid Munich',
    fitScore: 93,
    poolLabel: 'Top 3% Pool',
    saved: true,
    postedAt: '2026-11-15',
    requiredSkills: ['Rust', 'Go', 'Kubernetes', 'Distributed Systems', 'AWS'],
    description:
      'Scale low-latency analytical query execution engines in Rust and Go across multi-tenant Kubernetes clusters. Full EU Blue Card (§18g AufenthG) sponsorship included.',
    originalPostingText: `Celonis SE — Principal Platform Engineer (Execution Engine)
Location: Munich, Germany (Hybrid)
Compensation: €112,000 - €128,000

Role Scope:
Build distributed query planners and Rust worker pools for Celonis Process Intelligence Platform. Includes full German EU Blue Card (§18g) visa processing, ANABIN verification guidance, and temporary Munich corporate housing.`,
    stage: 'discovered',
    events: [
      {
        id: 'evt-3',
        timestamp: '2026-11-15T14:45:00.000Z',
        action: 'Sponsor Registry Verified',
        detail: 'Confirmed DE §18g EU Blue Card accelerated §81a eligibility.',
        source: 'pipeline',
      },
    ],
  },
  {
    id: 'role-nl-adyen',
    trackingCode: 'AM-2622',
    company: 'Adyen N.V.',
    title: 'Senior Staff Systems Engineer — Issuing Core',
    location: 'Amsterdam, Netherlands',
    countryFlag: '🇳🇱',
    corridor: 'EU_BLUE_CARD',
    visaSubclass: 'NL IND Highly Skilled Migrant',
    sponsorshipStatus: 'verified',
    sponsorRegistryId: 'NL-IND-REF-30918',
    sponsorshipEvidence:
      'IND Recognized Sponsor (Erkend Referent); 2-week fast-track Kennismigrant permit and 30% Dutch tax ruling advisory included.',
    corridorThresholdNote:
      '€120,000–€142,000 satisfies 2026 IND 30+ Highly Skilled Migrant & 30% ruling caps.',
    salaryDisplay: '€120,000 - €142,000 + RSUs',
    salaryNumericUsd: 141000,
    relocationPackage: 'Full Relocation + 30% Ruling Advisory',
    contractType: 'Full-time Permanent',
    orgGroup: 'Global Card Issuing',
    workModel: 'Hybrid Amsterdam',
    fitScore: 94,
    poolLabel: 'Top 2% Pool',
    saved: true,
    postedAt: '2026-11-13',
    requiredSkills: ['Go', 'PostgreSQL', 'Kafka', 'gRPC', 'Distributed Systems'],
    description:
      'Design zero-downtime card issuing authorization engines in Amsterdam. Adyen is an IND Recognized Sponsor offering 2-week immigration processing and relocation flights.',
    originalPostingText: `Adyen N.V. — Senior Staff Systems Engineer (Issuing Core)
Location: Amsterdam, Netherlands
Compensation: €120,000 - €142,000 + RSUs

Role Scope:
Lead low-latency payment authorization systems at 99.995%+ SLA. Adyen is an IND Erkend Referent providing full Highly Skilled Migrant (Kennismigrant) visa sponsorship for employee and partner.`,
    stage: 'resume_tailored',
    diffSession: {
      overallStrategy:
        'Emphasized high-availability authorization throughput, idempotency RFC leadership, and regulatory audit controls aligned with Dutch IND Highly Skilled Migrant criteria.',
      visaKeywordNotes: [
        'Zero-downtime card authorization',
        'Multi-region idempotency',
        'Regulatory audit compliance',
      ],
      generatedAt: '2026-11-16T15:10:00.000Z',
      hunks: [
        {
          id: 'hunk-1',
          section: 'Executive Summary',
          originalText:
            'Principal distributed systems and backend engineer with 8+ years designing high-throughput Go, Rust, and Kubernetes payment ledgers handling 42k RPS with 99.995% availability across multi-region cloud clusters.',
          optimizedText:
            'Senior Staff Systems Engineer with 8+ years architecting zero-downtime Go and PostgreSQL payment authorization engines handling 42k+ RPS at 99.995% availability across regulated multi-region clusters.',
          rationale:
            'Aligns domain terminology directly to Adyen Issuing Core authorization SLAs and European financial infrastructure compliance.',
          accepted: true,
        },
        {
          id: 'hunk-2',
          section: 'Experience Bullet 1',
          originalText:
            'Architected event-driven settlement pipeline in Go and Kafka reducing p99 clearing latency from 310ms to 48ms across 14M daily transactions.',
          optimizedText:
            'Architected fault-tolerant Go, gRPC, and Kafka settlement pipeline reducing p99 card-clearing latency from 310ms to 48ms across 14M daily regulated transactions.',
          rationale:
            'Highlights gRPC and regulated payment clearing throughput matching Adyen core stack requirements.',
          accepted: true,
        },
      ],
    },
    events: [
      {
        id: 'evt-4',
        timestamp: '2026-11-14T10:00:00.000Z',
        action: 'Sponsor Registry Verified',
        detail: 'IND Erkend Referent status verified on Dutch public register.',
        source: 'pipeline',
      },
      {
        id: 'evt-5',
        timestamp: '2026-11-16T15:10:00.000Z',
        action: 'Resume Diff Generated',
        detail: 'Generated 2 high-impact diff hunks for Issuing Core stack.',
        source: 'gemini-diff',
      },
    ],
  },
  {
    id: 'role-us-stripe',
    trackingCode: 'AM-2608',
    company: 'Stripe',
    title: 'Staff Infrastructure Engineer — Ledger Compute',
    location: 'Seattle, WA, USA',
    countryFlag: '🇺🇸',
    corridor: 'US_H1B_O1',
    visaSubclass: 'US O-1A / H-1B',
    sponsorshipStatus: 'verified',
    sponsorRegistryId: 'DOL-LCA-2026-9914',
    sponsorshipEvidence:
      'Active DOL-certified H-1B LCA filing history (1,400+ approvals) and dedicated O-1A / EB-1B legal counsel for Staff+ engineering hires.',
    corridorThresholdNote:
      '$218,000–$255,000 clears DOL Prevailing Wage Level IV in Seattle MSA.',
    salaryDisplay: '$218,000 - $255,000 + Equity',
    salaryNumericUsd: 236000,
    relocationPackage: 'Full US Immigration Counsel + Relocation',
    contractType: 'Full-time Permanent',
    orgGroup: 'Financial Infrastructure',
    workModel: 'Hybrid Seattle',
    fitScore: 95,
    poolLabel: 'Top 2% Pool',
    saved: true,
    postedAt: '2026-11-12',
    requiredSkills: ['Go', 'Rust', 'AWS', 'Terraform', 'Distributed Systems'],
    description:
      'Lead core reliability and multi-region ledger compute architecture. Stripe sponsors cap-subject H-1B transfers, O-1A petitions for Staff+ engineers, and green card PERM.',
    originalPostingText: `Stripe — Staff Infrastructure Engineer (Ledger Compute)
Location: Seattle, WA (Hybrid)
Compensation: $218,000 - $255,000 + Equity

Role Scope:
Own multi-region ledger availability and deterministic failover across Stripe's global financial infrastructure. Full immigration support including H-1B transfers, O-1A extraordinary ability petitions, and PERM sponsorship.`,
    stage: 'submitted',
    deployedAt: '2026-11-16T18:40:00.000Z',
    deployedResumeText:
      'Staff Infrastructure & Distributed Systems Engineer with 8+ years architecting multi-region Go, Rust, and AWS ledger compute platforms at 99.995% availability...',
    events: [
      {
        id: 'evt-6',
        timestamp: '2026-11-13T08:30:00.000Z',
        action: 'Sponsor Registry Verified',
        detail: 'DOL H-1B LCA filings and O-1A policy verified.',
        source: 'pipeline',
      },
      {
        id: 'evt-7',
        timestamp: '2026-11-16T18:40:00.000Z',
        action: 'Application Deployed',
        detail: 'Submitted tailored Staff Infrastructure resume package.',
        source: 'pipeline',
      },
    ],
  },
  {
    id: 'role-us-allenai',
    trackingCode: 'AM-2625',
    company: 'Allen Institute for AI (Ai2)',
    title: 'Senior Distributed Inference Engineer',
    location: 'Seattle, WA, USA',
    countryFlag: '🇺🇸',
    corridor: 'US_H1B_O1',
    visaSubclass: 'US H-1B Cap-Exempt',
    sponsorshipStatus: 'stated',
    sponsorRegistryId: 'US-CAPEXEMPT-501C3',
    sponsorshipEvidence:
      'Non-profit research institute eligible for Cap-Exempt H-1B petitions year-round without lottery; sponsorship explicitly stated in careers FAQ.',
    corridorThresholdNote:
      'Exempt from annual H-1B cap lottery; $185k–$215k clears DOL Level III wage.',
    salaryDisplay: '$185,000 - $215,000',
    salaryNumericUsd: 200000,
    relocationPackage: 'Cap-Exempt H-1B Filing + $12k Relocation',
    contractType: 'Full-time Permanent',
    orgGroup: 'Inference Systems Lab',
    workModel: 'Hybrid Seattle',
    fitScore: 89,
    poolLabel: 'Top 5% Pool',
    saved: false,
    postedAt: '2026-11-16',
    requiredSkills: ['Rust', 'Kubernetes', 'Go', 'AWS', 'gRPC'],
    description:
      'Build distributed model serving orchestration and cluster scheduling pipelines in Rust and Kubernetes. Eligible for year-round Cap-Exempt H-1B sponsorship.',
    originalPostingText: `Ai2 — Senior Distributed Inference Engineer
Location: Seattle, WA
Compensation: $185,000 - $215,000

Role Scope:
Architect GPU cluster orchestration and high-throughput Rust inference gateways. As a 501(c)(3) research institute, Ai2 sponsors Cap-Exempt H-1B visas year-round.`,
    stage: 'discovered',
    events: [
      {
        id: 'evt-8',
        timestamp: '2026-11-16T12:00:00.000Z',
        action: 'Cap-Exempt Flag Detected',
        detail: 'Identified year-round H-1B Cap-Exempt non-profit classification.',
        source: 'pipeline',
      },
    ],
  },
  {
    id: 'role-au-canva',
    trackingCode: 'AM-2631',
    company: 'Canva',
    title: 'Staff Cloud Platform Engineer — Edge Compute',
    location: 'Sydney, Australia',
    countryFlag: '🇦🇺',
    corridor: 'AU_CA_GTS',
    visaSubclass: 'AU Subclass 482',
    sponsorshipStatus: 'verified',
    sponsorRegistryId: 'AU-DHA-SBS-55210',
    sponsorshipEvidence:
      'Accredited Australian Standard Business Sponsor supporting Subclass 482 Skills in Demand (Core Skills stream) and employer-nominated PR pathway.',
    corridorThresholdNote:
      'A$215k–A$245k exceeds Specialist Skills Stream (A$135k) & Core TSMIT (A$73.15k).',
    salaryDisplay: 'A$215,000 - A$245,000 + Super',
    salaryNumericUsd: 151000,
    relocationPackage: 'Subclass 482 Sponsorship + Sydney Relocation',
    contractType: 'Full-time Permanent',
    orgGroup: 'Global Edge Platform',
    workModel: 'Hybrid Sydney',
    fitScore: 91,
    poolLabel: 'Top 4% Pool',
    saved: true,
    postedAt: '2026-11-14',
    requiredSkills: ['Go', 'Kubernetes', 'Terraform', 'AWS', 'Distributed Systems'],
    description:
      'Scale global edge routing and multi-region Kubernetes control planes in Sydney. Canva provides accredited Subclass 482 sponsorship, flights, and temporary housing.',
    originalPostingText: `Canva — Staff Cloud Platform Engineer (Edge Compute)
Location: Sydney, Australia (Hybrid)
Compensation: A$215,000 - A$245,000 + Superannuation

Role Scope:
Lead multi-region Kubernetes edge compute traffic routing. Canva provides accredited Subclass 482 visa sponsorship and full international relocation.`,
    stage: 'sponsor_interview',
    deployedAt: '2026-11-11T16:20:00.000Z',
    events: [
      {
        id: 'evt-9',
        timestamp: '2026-11-10T09:00:00.000Z',
        action: 'Sponsor Registry Verified',
        detail: 'Accredited Subclass 482 Standard Business Sponsor confirmed.',
        source: 'pipeline',
      },
      {
        id: 'evt-10',
        timestamp: '2026-11-11T16:20:00.000Z',
        action: 'Application Deployed',
        detail: 'Submitted tailored Edge Compute application.',
        source: 'pipeline',
      },
      {
        id: 'evt-11',
        timestamp: '2026-11-15T06:00:00.000Z',
        action: 'Sponsor Interview Scheduled',
        detail: 'Technical Architecture & Mobility Screening booked for Nov 20.',
        source: 'pipeline',
      },
    ],
  },
  {
    id: 'role-ca-shopify',
    trackingCode: 'AM-2634',
    company: 'Shopify',
    title: 'Staff Backend Engineer — Checkout Scale',
    location: 'Toronto, Canada',
    countryFlag: '🇨🇦',
    corridor: 'AU_CA_GTS',
    visaSubclass: 'CA GTS Cat B (NOC 21231)',
    sponsorshipStatus: 'stated',
    sponsorRegistryId: 'CA-ESDC-GTS-21231',
    sponsorshipEvidence:
      'Posting explicitly confirms international relocation via Canada Global Talent Stream Category B (2-week LMIA processing for Software Engineers NOC 21231).',
    corridorThresholdNote:
      'CA$195k–CA$225k exceeds Ontario NOC 21231 prevailing median wage.',
    salaryDisplay: 'CA$195,000 - CA$225,000 + Equity',
    salaryNumericUsd: 152000,
    relocationPackage: 'GTS Work Permit + Relocation Stipend',
    contractType: 'Full-time Permanent',
    orgGroup: 'Checkout Core',
    workModel: 'Toronto Hub / Remote CA',
    fitScore: 88,
    poolLabel: 'Top 5% Pool',
    saved: false,
    postedAt: '2026-11-15',
    requiredSkills: ['Go', 'Kafka', 'PostgreSQL', 'Kubernetes', 'TypeScript'],
    description:
      'Engineer high-concurrency flash-sale checkout pipelines serving millions of merchants. Supports Canada Global Talent Stream Category B work permit sponsorship.',
    originalPostingText: `Shopify — Staff Backend Engineer (Checkout Scale)
Location: Toronto, Canada
Compensation: CA$195,000 - CA$225,000 + Equity

Role Scope:
Build resilient checkout settlement systems handling peak global traffic. Supports Global Talent Stream Category B relocation.`,
    stage: 'discovered',
    events: [
      {
        id: 'evt-12',
        timestamp: '2026-11-15T19:15:00.000Z',
        action: 'GTS Corridor Matched',
        detail: 'Matched NOC 21231 Global Talent Stream Category B.',
        source: 'pipeline',
      },
    ],
  },
  {
    id: 'role-uk-finscale-unclear',
    trackingCode: 'AM-2640',
    company: 'FinScale Technologies',
    title: 'Lead Site Reliability Engineer — Cloud Core',
    location: 'Manchester, UK',
    countryFlag: '🇬🇧',
    corridor: 'UK_SWV',
    visaSubclass: 'UK SWV (Unverified)',
    sponsorshipStatus: 'unclear',
    sponsorRegistryId: 'PENDING-ENTITY-CHECK',
    sponsorshipEvidence:
      'Trading name does not cleanly match UK Home Office Sponsor Register and job copy omits CoS policy; confirm legal entity name during recruiter screen.',
    corridorThresholdNote:
      '£88,000–£102,000 clears UK SWV salary threshold if licence is held by parent entity.',
    salaryDisplay: '£88,000 - £102,000',
    salaryNumericUsd: 121000,
    relocationPackage: 'Not Specified',
    contractType: 'Full-time Permanent',
    orgGroup: 'Commercial Cloud Ops',
    workModel: 'Hybrid Manchester',
    fitScore: 82,
    poolLabel: 'Top 10% Pool',
    saved: false,
    postedAt: '2026-11-16',
    requiredSkills: ['Kubernetes', 'Terraform', 'AWS', 'Go'],
    description:
      'Own multi-region Kubernetes cluster reliability and SOC2 infrastructure automation for UK commercial banking integrations.',
    originalPostingText: `FinScale Technologies — Lead Site Reliability Engineer
Location: Manchester, UK (Hybrid)
Compensation: £88,000 - £102,000

Note: No explicit visa sponsorship terms stated in posting.`,
    stage: 'discovered',
    events: [
      {
        id: 'evt-13',
        timestamp: '2026-11-16T07:50:00.000Z',
        action: 'Unclear Sponsorship Flagged',
        detail: 'Entity name mismatch on UK Register — manual verification required.',
        source: 'pipeline',
      },
    ],
  },
  {
    id: 'role-us-gov-ineligible',
    trackingCode: 'AM-2644',
    company: 'Aegis Defense Cloud',
    title: 'Principal Systems Architect — FedRAMP High',
    location: 'Reston, VA, USA',
    countryFlag: '🇺🇸',
    corridor: 'US_H1B_O1',
    visaSubclass: 'No Sponsorship (ITAR)',
    sponsorshipStatus: 'ineligible',
    sponsorRegistryId: 'BLOCKED-ITAR-CLEARANCE',
    sponsorshipEvidence:
      'Explicit US Citizenship and active Secret Clearance required under ITAR & FedRAMP High regulations; sponsorship legally unavailable.',
    corridorThresholdNote: 'Blocked by statutory US citizenship / clearance requirement.',
    salaryDisplay: '$210,000 - $240,000',
    salaryNumericUsd: 225000,
    relocationPackage: 'None (US Citizen Only)',
    contractType: 'Full-time Permanent',
    orgGroup: 'Sovereign Enclave',
    workModel: 'On-site Reston, VA',
    fitScore: 64,
    poolLabel: 'Compliance Blocked',
    saved: false,
    postedAt: '2026-11-14',
    requiredSkills: ['Rust', 'AWS', 'Terraform', 'Kubernetes'],
    description:
      'Architect sovereign defense cloud enclaves requiring active US federal security clearance and unrestricted citizenship authorization.',
    originalPostingText: `Aegis Defense Cloud — Principal Systems Architect
Location: Reston, VA (On-site)
Requirement: US Citizenship and Secret Clearance required. No visa sponsorship.`,
    stage: 'discovered',
    events: [
      {
        id: 'evt-14',
        timestamp: '2026-11-14T16:05:00.000Z',
        action: 'Compliance Gate Blocked',
        detail: 'Blocked by ITAR / US Citizenship compliance rule.',
        source: 'pipeline',
      },
    ],
  },
];
