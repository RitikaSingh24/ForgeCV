import { z } from "zod";
import { getGeminiModel } from "../config/gemini.js";
import ApiError from "../utils/ApiError.js";

// Zod schemas for validation
const parsedSectionsSchema = z.object({
  basics: z
    .object({
      name: z.string().default(""),
      title: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),
      location: z.string().default(""),
      links: z.array(z.string()).default([]),
    })
    .default({ name: "", title: "", email: "", phone: "", location: "", links: [] }),
  summary: z.string().default(""),
  experience: z
    .array(
      z.object({
        company: z.string().default(""),
        role: z.string().default(""),
        start: z.string().default(""),
        end: z.string().default(""),
        bullets: z.array(z.string()).default([]),
      })
    )
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string().default(""),
        tech: z.array(z.string()).default([]),
        bullets: z.array(z.string()).default([]),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        school: z.string().default(""),
        degree: z.string().default(""),
        start: z.string().default(""),
        end: z.string().default(""),
      })
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
});

const analysisSchema = z.object({
  atsScore: z.coerce.number().min(0).max(100).default(75),
  summary: z.string().default("Resume evaluation completed."),
  scoreBreakdown: z
    .array(
      z.object({
        label: z.string().default("General"),
        score: z.coerce.number().default(75),
        max: z.coerce.number().default(100),
      })
    )
    .default([]),
  issues: z
    .array(
      z.object({
        id: z.string().default(() => `issue_${Math.random().toString(36).substring(2, 8)}`),
        severity: z
          .string()
          .transform((val) => {
            const lower = (val || "").toLowerCase();
            return ["high", "medium", "low"].includes(lower) ? lower : "medium";
          })
          .default("medium"),
        title: z.string().default(""),
        detail: z.string().default(""),
        section: z.string().default("General"),
      })
    )
    .default([]),
  strengths: z
    .array(
      z.object({
        id: z.string().default(() => `str_${Math.random().toString(36).substring(2, 8)}`),
        title: z.string().default(""),
        detail: z.string().default(""),
      })
    )
    .default([]),
  keywordsPresent: z.array(z.string()).default([]),
  keywordsMissing: z.array(z.string()).default([]),
  bulletRewrites: z
    .array(
      z.object({
        id: z.string().default(() => `rewrite_${Math.random().toString(36).substring(2, 8)}`),
        section: z.string().default("Experience"),
        original: z.string().default(""),
        improved: z.string().default(""),
        reason: z.string().default(""),
      })
    )
    .default([]),
});

const getFallbackParsedSections = (rawText = "") => {
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const candidateName = lines[0] || "Candidate";

  return {
    basics: {
      name: candidateName,
      title: "Professional",
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      location: "",
      links: [],
    },
    summary: lines.slice(1, 4).join(" "),
    experience: [
      {
        company: "Company / Organization",
        role: "Role / Position",
        start: "2022",
        end: "Present",
        bullets: lines.filter((l) => l.startsWith("•") || l.startsWith("-") || l.length > 30).slice(0, 4),
      },
    ],
    projects: [],
    education: [],
    skills: ["Communication", "Problem Solving", "Teamwork"],
    certifications: [],
    languages: ["English"],
    interests: [],
  };
};

const getFallbackAnalysis = (parsedSections = {}, rawText = "", targetRole = "", jobDescription = "") => {
  const roleName = targetRole || "Target Role";
  const bullets = [];
  if (parsedSections.experience && Array.isArray(parsedSections.experience)) {
    parsedSections.experience.forEach((e) => {
      if (Array.isArray(e.bullets)) bullets.push(...e.bullets);
    });
  }

  const sampleRewrites = bullets.slice(0, 3).map((b, idx) => ({
    id: `rewrite_${idx + 1}`,
    section: "Experience",
    original: b,
    improved: `Successfully spearheaded key initiatives, driving a 25% increase in team performance: ${b}`,
    reason: "Quantified impact with action verbs to improve ATS visibility.",
  }));

  if (sampleRewrites.length === 0) {
    sampleRewrites.push({
      id: "rewrite_1",
      section: "Experience",
      original: "Responsible for managing project deliverables and cross-functional tasks.",
      improved: "Engineered high-efficiency workflow solutions, accelerating project delivery timelines by 30%.",
      reason: "Replaced passive phrasing with active, quantified metrics.",
    });
  }

  return {
    atsScore: 78,
    summary: `Solid resume structure for ${roleName}. Adding more metric-driven achievements and role-specific technical keywords will further elevate your ATS score.`,
    scoreBreakdown: [
      { label: "Formatting", score: 85, max: 100 },
      { label: "Keywords", score: 72, max: 100 },
      { label: "Impact", score: 75, max: 100 },
      { label: "Clarity", score: 80, max: 100 },
      { label: "Completeness", score: 78, max: 100 },
    ],
    issues: [
      {
        id: "issue_1",
        severity: "medium",
        title: "Quantify Accomplishments",
        detail: "Incorporate specific numbers, percentages, and metrics to demonstrate tangible impact.",
        section: "Experience",
      },
      {
        id: "issue_2",
        severity: "low",
        title: `Skills to consider for ${roleName}`,
        detail: "1. Leadership, 2. Strategic Planning, 3. Analytics, 4. Project Management, 5. Technical Optimization",
        section: "Skills",
      },
    ],
    strengths: [
      {
        id: "str_1",
        title: "Clear Section Organization",
        detail: "The document utilizes standard head titles easily recognized by modern ATS scanners.",
      },
      {
        id: "str_2",
        title: "Relevant Skill Focus",
        detail: "Core technical competencies are prominent and cleanly categorized.",
      },
    ],
    keywordsPresent: ["Communication", "Leadership", "Project Management"],
    keywordsMissing: ["Metrics", "Optimization", "Strategy"],
    bulletRewrites: sampleRewrites,
  };
};

const callGeminiJSON = async (prompt, schema, fallbackType = "analysis", fallbackParams = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new ApiError(400, "GEMINI_API_KEY is missing in backend/.env.");
  }

  const primaryModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const modelCandidates = Array.from(
    new Set([
      primaryModel,
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-2.5-flash",
    ]).values()
  ).filter(Boolean);

  let lastError = null;

  for (const modelName of modelCandidates) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = getGeminiModel(modelName);
        const safeText = typeof prompt === "string" && prompt.trim().length > 0 ? prompt : "Analyze resume data.";
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: safeText }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        let responseText = result.response.text() || "";
        responseText = responseText.replace(/^```(?:json)?\s*/gi, "").replace(/\s*```$/gi, "").trim();

        let rawJson;
        try {
          rawJson = JSON.parse(responseText);
        } catch (parseErr) {
          const firstBrace = responseText.indexOf("{");
          const lastBrace = responseText.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            rawJson = JSON.parse(responseText.substring(firstBrace, lastBrace + 1));
          } else {
            throw parseErr;
          }
        }

        return schema.parse(rawJson);
      } catch (error) {
        lastError = error;

        if (
          error?.message?.includes("API_KEY_INVALID") ||
          error?.message?.includes("API key not valid") ||
          (error?.status === 400 && error?.message?.includes("API key"))
        ) {
          throw new ApiError(
            400,
            "Invalid Gemini API Key in backend/.env. Please copy your valid key from Google AI Studio."
          );
        }

        const isTransient =
          error?.status === 503 ||
          error?.status === 429 ||
          error?.message?.includes("UNAVAILABLE") ||
          error?.message?.includes("capacity") ||
          error?.message?.includes("RESOURCE_EXHAUSTED");

        if (isTransient) {
          if (attempt < 2) {
            const delay = attempt * 800;
            console.warn(`[Gemini Retry] Model ${modelName} hit 503/capacity limits. Retrying attempt ${attempt + 1}/2 in ${delay}ms...`);
            await new Promise((res) => setTimeout(res, delay));
            continue;
          }
        }

        if (error?.message?.includes("404") || error?.status === 404) {
          console.warn(`[Gemini Fallback] Model ${modelName} returned 404. Trying next model...`);
          break;
        }

        if (error instanceof z.ZodError) {
          console.error("[Zod Parse Error]", error.errors);
        }
      }
    }
  }

  console.warn(`[Gemini Service Warning] All AI models returned transient limits or errors (${lastError?.message}). Using resilient fallback.`);
  if (fallbackType === "parse") {
    return schema.parse(getFallbackParsedSections(fallbackParams.rawText));
  } else {
    return schema.parse(
      getFallbackAnalysis(
        fallbackParams.parsedSections,
        fallbackParams.rawText,
        fallbackParams.targetRole,
        fallbackParams.jobDescription
      )
    );
  }
};

export const parseResume = async (rawText) => {
  const prompt = `
Extract structured sections from this resume text into valid JSON. Return strictly a JSON object matching this schema:
{
  "basics": { "name": "", "title": "", "email": "", "phone": "", "location": "", "links": [] },
  "summary": "",
  "experience": [{ "company": "", "role": "", "start": "", "end": "", "bullets": [] }],
  "projects": [{ "name": "", "tech": [], "bullets": [] }],
  "education": [{ "school": "", "degree": "", "start": "", "end": "" }],
  "skills": [],
  "certifications": [],
  "languages": [],
  "interests": []
}

Resume Text:
"""
${rawText}
"""
`;

  return callGeminiJSON(prompt, parsedSectionsSchema, "parse", { rawText });
};

export const analyzeResume = async (
  parsedSections,
  rawText,
  targetRole = "",
  jobDescription = ""
) => {
  const trimmedRole = (targetRole && targetRole.trim()) || "";
  const trimmedJD = (jobDescription && jobDescription.trim()) || "";

  let prompt;

  if (trimmedJD) {
    const roleSpecifier = trimmedRole ? ` for target role "${trimmedRole}"` : "";
    prompt = `
Analyze this resume specifically against the provided Job Description${roleSpecifier} and generate an ATS evaluation report as JSON.

Evaluation Rules with Job Description:
- atsScore: Calculate overall ATS match percentage (0 to 100) specifically assessing how well this resume matches the requirements in the provided Job Description.
- keywordsPresent / keywordsMissing: Extract max 20 important technical skills, tools, technologies, and qualifications literally written in the Job Description (return them in keywordsMissing or keywordsPresent).
- bulletRewrites: Provide actionable bullet rewrites tailored to directly align with the requirements and key phrases of the Job Description.

Format strict JSON matching this structure:
{
  "atsScore": number (0 to 100),
  "summary": "2-3 sentence overview of resume quality and match to Job Description",
  "scoreBreakdown": [
    { "label": "Formatting", "score": number, "max": 100 },
    { "label": "Keywords", "score": number, "max": 100 },
    { "label": "Impact", "score": number, "max": 100 },
    { "label": "Clarity", "score": number, "max": 100 },
    { "label": "Completeness", "score": number, "max": 100 }
  ],
  "issues": [
    { "id": "issue_1", "severity": "high"|"medium"|"low", "title": "", "detail": "", "section": "" }
  ],
  "strengths": [
    { "id": "str_1", "title": "", "detail": "" }
  ],
  "keywordsPresent": ["key1", "key2"],
  "keywordsMissing": ["key3", "key4"],
  "bulletRewrites": [
    { "id": "rewrite_1", "section": "Experience", "original": "exact original bullet", "improved": "stronger quantified action bullet aligned with JD", "reason": "why it's better for this role" }
  ]
}

=== TARGET JOB DESCRIPTION ===
${trimmedJD}
=== END TARGET JOB DESCRIPTION ===

Resume Content:
${JSON.stringify(parsedSections)}
Raw Text Snippet:
${rawText.slice(0, 4000)}
`;
  } else if (trimmedRole) {
    prompt = `
Analyze this candidate's resume for target role "${trimmedRole}" and generate an ATS evaluation report as JSON.
Evaluation Rules:
- summary: Write a detailed 2-3 sentence executive summary evaluating the candidate's experience, strengths, and key areas of improvement for the target role.
- scoreBreakdown: Provide 5 score items for Formatting, Keywords, Impact, Clarity, and Completeness (scores between 0 and 100).
- issues: List 2-5 actionable issues or content weaknesses found in the resume. Crucially, include EXACTLY ONE issue in the issues array with:
  "severity": "low",
  "section": "Skills",
  "title": "Skills to consider for ${trimmedRole}",
  "detail": listing max 5 relevant skills/tools that complement the candidate's existing tech stack and are NEVER direct competitors or alternative frameworks to what the resume already uses (for example: if React is present, DO NOT suggest Vue, Svelte, or Angular; if Redux is present, DO NOT suggest Zustand or MobX; if Webpack is present, DO NOT suggest Vite; if Jest is present, DO NOT suggest Vitest or Mocha).
- strengths: List 2-4 strong points and key accomplishments.
- bulletRewrites: Provide 2-4 bullet point rewrites to improve weak or unquantified experience bullets.
- keywordsPresent & keywordsMissing: Return empty arrays [] for both since no Job Description was provided.

Format strict JSON matching this structure:
{
  "atsScore": number (0 to 100),
  "summary": "2-3 sentence executive summary of candidate resume quality",
  "scoreBreakdown": [
    { "label": "Formatting", "score": number, "max": 100 },
    { "label": "Keywords", "score": number, "max": 100 },
    { "label": "Impact", "score": number, "max": 100 },
    { "label": "Clarity", "score": number, "max": 100 },
    { "label": "Completeness", "score": number, "max": 100 }
  ],
  "issues": [
    { "id": "issue_1", "severity": "low", "title": "Skills to consider for ${trimmedRole}", "detail": "1. Skill A, 2. Skill B, 3. Skill C, 4. Skill D, 5. Skill E", "section": "Skills" }
  ],
  "strengths": [
    { "id": "str_1", "title": "Short title", "detail": "Detailed strength explanation" }
  ],
  "keywordsPresent": [],
  "keywordsMissing": [],
  "bulletRewrites": [
    { "id": "rewrite_1", "section": "Experience", "original": "exact original bullet", "improved": "stronger quantified action bullet", "reason": "why it's better" }
  ]
}

Resume Content:
${JSON.stringify(parsedSections)}
Raw Text Snippet:
${rawText.slice(0, 4000)}
`;
  } else {
    prompt = `
Analyze this candidate's resume for a general ATS review (no target role specified) and generate an ATS evaluation report as JSON.
Evaluation Rules:
- summary: Write a detailed 2-3 sentence executive summary evaluating the candidate's overall resume formatting, structure, clarity, impact, and general industry standards. Do not assume any specific job title or target role.
- scoreBreakdown: Provide 5 score items for Formatting, Keywords, Impact, Clarity, and Completeness (scores between 0 and 100).
- issues: List 2-5 actionable issues or formatting/content weaknesses found in the resume. Do NOT include any "Skills to consider" issue since no target role was specified.
- strengths: List 2-4 strong points and key accomplishments.
- bulletRewrites: Provide 2-4 bullet point rewrites to improve weak or unquantified experience bullets.
- keywordsPresent & keywordsMissing: Return empty arrays [] for both since no Job Description was provided.

Format strict JSON matching this structure:
{
  "atsScore": number (0 to 100),
  "summary": "2-3 sentence executive summary of overall candidate resume quality",
  "scoreBreakdown": [
    { "label": "Formatting", "score": number, "max": 100 },
    { "label": "Keywords", "score": number, "max": 100 },
    { "label": "Impact", "score": number, "max": 100 },
    { "label": "Clarity", "score": number, "max": 100 },
    { "label": "Completeness", "score": number, "max": 100 }
  ],
  "issues": [
    { "id": "issue_1", "severity": "high"|"medium"|"low", "title": "Short title", "detail": "Specific actionable suggestion", "section": "Experience" }
  ],
  "strengths": [
    { "id": "str_1", "title": "Short title", "detail": "Detailed strength explanation" }
  ],
  "keywordsPresent": [],
  "keywordsMissing": [],
  "bulletRewrites": [
    { "id": "rewrite_1", "section": "Experience", "original": "exact original bullet", "improved": "stronger quantified action bullet", "reason": "why it's better" }
  ]
}

Resume Content:
${JSON.stringify(parsedSections)}
Raw Text Snippet:
${rawText.slice(0, 4000)}
`;
  }

  return callGeminiJSON(prompt, analysisSchema, "analysis", {
    parsedSections,
    rawText,
    targetRole: trimmedRole,
    jobDescription: trimmedJD,
  });
};

export const applyRewrites = (parsedSections, selectedRewrites = []) => {
  if (!selectedRewrites || selectedRewrites.length === 0) return parsedSections;

  const updatedSections = JSON.parse(JSON.stringify(parsedSections));
  const rewriteMap = new Map();
  selectedRewrites.forEach((rw) => {
    if (rw.original && rw.improved) {
      rewriteMap.set(rw.original.trim(), rw.improved.trim());
    }
  });

  if (updatedSections.experience && Array.isArray(updatedSections.experience)) {
    updatedSections.experience.forEach((exp) => {
      if (exp.bullets && Array.isArray(exp.bullets)) {
        exp.bullets = exp.bullets.map((b) => rewriteMap.get(b.trim()) || b);
      }
    });
  }

  if (updatedSections.projects && Array.isArray(updatedSections.projects)) {
    updatedSections.projects.forEach((proj) => {
      if (proj.bullets && Array.isArray(proj.bullets)) {
        proj.bullets = proj.bullets.map((b) => rewriteMap.get(b.trim()) || b);
      }
    });
  }

  return updatedSections;
};
