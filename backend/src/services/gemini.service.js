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
  atsScore: z.number().min(0).max(100),
  summary: z.string(),
  scoreBreakdown: z.array(
    z.object({
      label: z.string(),
      score: z.number(),
      max: z.number().default(100),
    })
  ),
  issues: z.array(
    z.object({
      id: z.string(),
      severity: z.enum(["high", "medium", "low"]),
      title: z.string(),
      detail: z.string(),
      section: z.string().default("General"),
    })
  ),
  strengths: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      detail: z.string(),
    })
  ),
  keywordsPresent: z.array(z.string()),
  keywordsMissing: z.array(z.string()),
  bulletRewrites: z.array(
    z.object({
      id: z.string(),
      section: z.string(),
      original: z.string(),
      improved: z.string(),
      reason: z.string(),
    })
  ),
});

const callGeminiJSON = async (prompt, schema, retryCount = 1) => {
  const model = getGeminiModel();
  let attempts = 0;

  while (attempts <= retryCount) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = result.response.text();
      const rawJson = JSON.parse(responseText);
      return schema.parse(rawJson);
    } catch (error) {
      attempts++;
      if (error?.status === 429 || error?.message?.includes("quota") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
        throw new ApiError(503, "Gemini AI service is currently busy or quota exceeded. Please try again in a few moments.");
      }
      if (attempts > retryCount) {
        if (error instanceof z.ZodError) {
          throw new ApiError(500, "Gemini response did not match the expected format.");
        }
        throw new ApiError(500, error.message || "Failed to communicate with AI model.");
      }
    }
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

  return callGeminiJSON(prompt, parsedSectionsSchema);
};

export const analyzeResume = async (parsedSections, rawText, targetRole = "General Software Engineer") => {
  const prompt = `
Analyze this resume for target role "${targetRole}" and generate an ATS evaluation report as JSON.
Format strict JSON matching this structure:
{
  "atsScore": number (0 to 100),
  "summary": "2-3 sentence overview of resume quality",
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
    { "id": "rewrite_1", "section": "Experience", "original": "exact original bullet", "improved": "stronger quantified action bullet", "reason": "why it's better" }
  ]
}

Resume Content:
${JSON.stringify(parsedSections)}
Raw Text Snippet:
${rawText.slice(0, 1500)}
`;

  return callGeminiJSON(prompt, analysisSchema);
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
