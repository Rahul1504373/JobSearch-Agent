import 'dotenv/config';
import express, {type Request, type Response} from 'express';
import mammoth from 'mammoth';
import path from 'path';
import {fileURLToPath} from 'url';
import {GoogleGenAI, Type} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Add a valid key in Settings > Secrets.',
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function handleGeminiError(res: Response, err: unknown, context: string) {
  console.error(`[${context}] Gemini API error:`, err);
  const message =
    err instanceof Error ? err.message : 'Unexpected server error calling Gemini API.';
  const statusMatch = message.match(/\b(400|401|403|404|429|500|503)\b/);
  const statusCode = statusMatch ? Number(statusMatch[1]) : 500;
  res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
    error: message,
  });
}

const app = express();
app.use(express.json({limit: '22mb'}));

app.post('/api/cv/ingest', async (req: Request, res: Response) => {
  try {
    const {fileName, mimeType, fileBase64, textContent} = req.body ?? {};
    if (!fileName || (!fileBase64 && !textContent)) {
      res.status(400).json({error: 'Missing uploaded CV file payload.'});
      return;
    }

    const lowerName = String(fileName).toLowerCase();
    const isPdf =
      mimeType === 'application/pdf' || lowerName.endsWith('.pdf');
    const isDocx =
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      lowerName.endsWith('.docx');

    let extractedPlainText = typeof textContent === 'string' ? textContent : '';

    if (isDocx && typeof fileBase64 === 'string') {
      const buffer = Buffer.from(fileBase64, 'base64');
      const result = await mammoth.extractRawText({buffer});
      extractedPlainText = result.value ?? '';
    } else if (!isPdf && !extractedPlainText && typeof fileBase64 === 'string') {
      extractedPlainText = Buffer.from(fileBase64, 'base64').toString('utf8');
    }

    const ai = getAiClient();
    const instructionPrompt = `Parse this candidate's CV / Resume and extract structured profile credentials, verifiable engineering competencies, and immigration occupation classifications.

Guidelines:
- Stay strictly truthful to the uploaded document; never fabricate degrees, employers, or skills not supported by the CV.
- Categorize up to 14 key competencies across three categories:
  1) "languages" (programming languages & core runtimes)
  2) "infrastructure" (cloud, databases, Kubernetes, messaging, distributed primitives)
  3) "architecture" (system scale, high-throughput metrics, architecture patterns)
- Provide concise levelLabel (e.g. "Expert (7 yrs)", "Proficient (4 yrs)", "Advanced", "Core Spec") and badgeLabel (e.g. "96% match", "High Demand", or empty string if none).
- Extract 3 to 5 crisp, high-impact experience bullets from the CV's work history.
- Provide clean plain-text transcript in "extractedText" so the user can preview the parsed document.`;

    const contents = isPdf
      ? {
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: String(fileBase64),
              },
            },
            {text: instructionPrompt},
          ],
        }
      : `${instructionPrompt}\n\nCV Document (${fileName}):\n${extractedPlainText.slice(0, 45000)}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction:
          'You are a precision technical CV parser and global immigration skill classifier. Return strict JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {type: Type.STRING},
            currentTitle: {type: Type.STRING},
            yearsExperience: {type: Type.INTEGER},
            highestDegree: {type: Type.STRING},
            citizenship: {type: Type.STRING},
            currentLocation: {type: Type.STRING},
            summary: {type: Type.STRING},
            experienceBullets: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
            },
            extractedText: {
              type: Type.STRING,
              description: 'Clean readable plain-text summary/transcript of the parsed CV.',
            },
            categorizedSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {type: Type.STRING},
                  category: {
                    type: Type.STRING,
                    description: 'Must be one of: languages, infrastructure, architecture',
                  },
                  levelLabel: {type: Type.STRING},
                  badgeLabel: {type: Type.STRING},
                },
                required: ['name', 'category', 'levelLabel', 'badgeLabel'],
              },
            },
            identifiedClassifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {type: Type.STRING},
                  detail: {type: Type.STRING},
                },
                required: ['title', 'detail'],
              },
            },
          },
          required: [
            'name',
            'currentTitle',
            'yearsExperience',
            'highestDegree',
            'summary',
            'experienceBullets',
            'extractedText',
            'categorizedSkills',
            'identifiedClassifications',
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim());
    const validCategories = new Set(['languages', 'infrastructure', 'architecture']);
    const categorizedSkills = Array.isArray(parsed.categorizedSkills)
      ? parsed.categorizedSkills.map((s: Record<string, unknown>, idx: number) => ({
          id: `skill-${Date.now()}-${idx}`,
          name: String(s.name ?? 'Skill'),
          category: validCategories.has(String(s.category))
            ? String(s.category)
            : 'infrastructure',
          levelLabel: String(s.levelLabel ?? ''),
          badgeLabel: String(s.badgeLabel ?? ''),
        }))
      : [];

    res.json({
      ...parsed,
      extractedText:
        String(parsed.extractedText || extractedPlainText || '').trim(),
      categorizedSkills,
    });
  } catch (err) {
    handleGeminiError(res, err, 'api/cv/ingest');
  }
});

app.post('/api/visa/analyze', async (req: Request, res: Response) => {
  try {
    const {profile, role} = req.body ?? {};
    if (!profile || !role) {
      res.status(400).json({error: 'Missing candidate profile or target role payload.'});
      return;
    }

    const ai = getAiClient();
    const prompt = `Evaluate cross-border visa sponsorship eligibility for this IT candidate and role.

Candidate Profile:
- Name: ${profile.name}
- Current Title: ${profile.currentTitle}
- Experience: ${profile.yearsExperience} years
- Highest Degree: ${profile.highestDegree}
- Citizenship: ${profile.citizenship}
- Current Location: ${profile.currentLocation}
- Core Skills: ${(profile.skills ?? []).join(', ')}

Target Role:
- Company: ${role.company}
- Title: ${role.title}
- Location: ${role.location}
- Target Corridor: ${role.corridor}
- Listed Subclass: ${role.visaSubclass}
- Sponsorship Status: ${role.sponsorshipStatus}
- Salary Offered: ${role.salaryDisplay}
- Sponsor Registry Notes: ${role.sponsorshipEvidence}
- Role Description: ${role.description}

Assess realistically against current immigration rules for the target corridor (UK Skilled Worker going rates & Sponsor Licence, Germany EU Blue Card §18g / Netherlands IND HSM, US H-1B Specialty Occupation / O-1A, or Australia Subclass 482 Core Skills / Canada Global Talent Stream Category B). Be concise, factual, and deterministic.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction:
          'You are a senior global immigration compliance analyst for technical talent mobility. Return strictly structured JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eligibilityStatus: {
              type: Type.STRING,
              description: 'One of: eligible, conditional, ineligible',
            },
            recommendedSubclass: {
              type: Type.STRING,
              description:
                'Specific visa subclass or permit code, e.g. UK SWV SOC 2134 or DE §18g Blue Card',
            },
            salaryThresholdCheck: {
              type: Type.STRING,
              description:
                'Concise comparison of offered salary against statutory minimum threshold for this corridor.',
            },
            occupationCodeMatch: {
              type: Type.STRING,
              description: 'SOC, ANZSCO, NOC, or ISCO occupation classification assessment.',
            },
            summary: {
              type: Type.STRING,
              description: 'Two-sentence executive compliance summary.',
            },
            keyFindings: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: '3 to 4 concrete positive or neutral compliance checks.',
            },
            complianceRisks: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: '1 to 3 legal or procedural risks or missing evidence items.',
            },
            nextSteps: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: '2 to 3 actionable steps for the applicant before submitting.',
            },
          },
          required: [
            'eligibilityStatus',
            'recommendedSubclass',
            'salaryThresholdCheck',
            'occupationCodeMatch',
            'summary',
            'keyFindings',
            'complianceRisks',
            'nextSteps',
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim());
    res.json({
      ...parsed,
      auditedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleGeminiError(res, err, 'api/visa/analyze');
  }
});

app.post('/api/copilot/tailor', async (req: Request, res: Response) => {
  try {
    const {profile, role, directive} = req.body ?? {};
    if (!profile || !role) {
      res.status(400).json({error: 'Missing candidate profile or target role payload.'});
      return;
    }

    const ai = getAiClient();
    const bullets: string[] = Array.isArray(profile.experienceBullets)
      ? profile.experienceBullets
      : [];

    const prompt = `Tailor this IT candidate's resume sections for the target cross-border role and its visa occupation classification.

Candidate Base Resume:
1. Section "Executive Summary":
${profile.summary}

2. Section "Experience Bullet 1":
${bullets[0] ?? ''}

3. Section "Experience Bullet 2":
${bullets[1] ?? ''}

4. Section "Experience Bullet 3":
${bullets[2] ?? ''}

5. Section "Core Technical Stack":
${(profile.skills ?? []).join(', ')}

Target Role & Visa Context:
- Company: ${role.company}
- Title: ${role.title}
- Location: ${role.location}
- Corridor & Subclass: ${role.corridor} (${role.visaSubclass})
- Required Skills: ${(role.requiredSkills ?? []).join(', ')}
- Job Description: ${role.description}
${directive ? `- Candidate Directive: ${directive}` : ''}

Instructions:
Return one diff hunk per non-empty section above (4 to 5 hunks). CRITICAL: For every hunk, set "originalText" to the EXACT verbatim input text of that section, and set "optimizedText" to a sharper, ATS- and visa-specialty-occupation-aligned rewrite that remains truthful to the candidate's baseline experience.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction:
          'You are an executive technical resume editor specializing in cross-border IT visa sponsorship alignment (specialty occupation clarity, measurable impact, and exact ATS terminology). Never fabricate degrees or employers.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallStrategy: {
              type: Type.STRING,
              description:
                'Concise 1-2 sentence tailoring strategy tying technical depth to the target visa corridor.',
            },
            visaKeywordNotes: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: '3 to 4 key technical and occupation keywords emphasized.',
            },
            hunks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {type: Type.STRING},
                  section: {type: Type.STRING},
                  originalText: {type: Type.STRING},
                  optimizedText: {type: Type.STRING},
                  rationale: {type: Type.STRING},
                },
                required: ['id', 'section', 'originalText', 'optimizedText', 'rationale'],
              },
            },
          },
          required: ['overallStrategy', 'visaKeywordNotes', 'hunks'],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim());
    const hunks = Array.isArray(parsed.hunks)
      ? parsed.hunks.map((h: Record<string, unknown>, idx: number) => ({
          id: typeof h.id === 'string' && h.id ? h.id : `hunk-${idx + 1}`,
          section: String(h.section ?? `Section ${idx + 1}`),
          originalText: String(h.originalText ?? ''),
          optimizedText: String(h.optimizedText ?? ''),
          rationale: String(h.rationale ?? ''),
          accepted: true,
        }))
      : [];

    res.json({
      overallStrategy: String(parsed.overallStrategy ?? ''),
      visaKeywordNotes: Array.isArray(parsed.visaKeywordNotes) ? parsed.visaKeywordNotes : [],
      hunks,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleGeminiError(res, err, 'api/copilot/tailor');
  }
});

app.post('/api/jobs/scan', async (req: Request, res: Response) => {
  try {
    const {rawText, companyHint, titleHint, corridorHint} = req.body ?? {};
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 20) {
      res.status(400).json({error: 'Paste at least 20 characters of a job posting to scan.'});
      return;
    }

    const ai = getAiClient();
    const prompt = `Extract structured visa sponsorship and job metadata from this job posting.

Optional Hints:
- Company Hint: ${companyHint || 'None'}
- Title Hint: ${titleHint || 'None'}
- Corridor Hint: ${corridorHint || 'Auto-detect'}

Job Posting Text:
${rawText.trim()}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction:
          'You classify international IT job descriptions for visa sponsorship readiness. Output strict JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            company: {type: Type.STRING},
            title: {type: Type.STRING},
            location: {type: Type.STRING},
            corridor: {
              type: Type.STRING,
              description: 'Must be one of: UK_SWV, EU_BLUE_CARD, US_H1B_O1, AU_CA_GTS',
            },
            visaSubclass: {
              type: Type.STRING,
              description: 'Short tabular code e.g. UK SWV 2134, DE §18g, US H-1B, AU 482, CA GTS',
            },
            sponsorshipStatus: {
              type: Type.STRING,
              description: 'Must be one of: verified, stated, unclear, ineligible',
            },
            sponsorshipEvidence: {
              type: Type.STRING,
              description: '1-sentence rationale citing the sponsorship language or lack thereof.',
            },
            salaryDisplay: {
              type: Type.STRING,
              description: 'Formatted salary string, or "Compensation Unspecified" if missing.',
            },
            salaryNumericUsd: {
              type: Type.INTEGER,
              description: 'Estimated annual gross salary in USD integer for sorting/filtering.',
            },
            relocationPackage: {
              type: Type.STRING,
              description: 'e.g. Full Relocation + Visa Fees, Visa Fees Only, or Not Specified',
            },
            workModel: {
              type: Type.STRING,
              description: 'One of: Hybrid, On-site, Remote-in-country',
            },
            requiredSkills: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
            },
            description: {
              type: Type.STRING,
              description: 'Clean 2-3 sentence summary of role scope and technical stack.',
            },
          },
          required: [
            'company',
            'title',
            'location',
            'corridor',
            'visaSubclass',
            'sponsorshipStatus',
            'sponsorshipEvidence',
            'salaryDisplay',
            'salaryNumericUsd',
            'relocationPackage',
            'workModel',
            'requiredSkills',
            'description',
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim());
    res.json(parsed);
  } catch (err) {
    handleGeminiError(res, err, 'api/jobs/scan');
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerCopilot AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
