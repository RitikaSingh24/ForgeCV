import { v4 as uuidv4 } from "uuid";
import Resume from "../models/Resume.model.js";
import Version from "../models/Version.model.js";
import Analysis from "../models/Analysis.model.js";
import ApiError from "../utils/ApiError.js";
import { extractText } from "./pdf.service.js";
import { parseResume, analyzeResume as geminiAnalyzeResume, applyRewrites } from "./gemini.service.js";
import { uploadToS3, getSignedUrl, deleteFromS3 } from "./s3.service.js";

export const createResumeFromUpload = async (userId, file) => {
  if (!file) throw new ApiError(400, "Please upload a PDF resume file.");

  const rawText = await extractText(file.buffer);
  const parsedSections = await parseResume(rawText);

  const candidateName = parsedSections.basics?.name?.trim();
  const title = candidateName ? `${candidateName}'s Resume` : file.originalname.replace(/\.pdf$/i, "");

  const s3Key = `resumes/${userId}/${uuidv4()}.pdf`;
  await uploadToS3(file.buffer, s3Key, "application/pdf");

  const resume = await Resume.create({
    title,
    userId,
  });

  const version = await Version.create({
    resumeId: resume._id,
    label: "V1",
    sourceType: "upload",
    parsedSections,
    rawText,
    s3Key,
    score: null,
  });

  resume.currentVersionId = version._id;
  await resume.save();

  // Auto-run ATS Analysis so score and AI report are generated immediately upon upload
  const analysis = await analyzeVersion(userId, resume._id, version._id);

  return { resume, version, analysis };
};

const normalizeToken = (str) => {
  if (!str || typeof str !== "string") return "";
  let s = str.toLowerCase().trim();
  s = s.replace(/[\.\-\s\/]/g, "");
  if (s === "reactjs" || s === "react") return "react";
  if (s === "nodejs" || s === "node") return "node";
  if (s === "typescript" || s === "ts") return "typescript";
  if (s === "javascript" || s === "js") return "javascript";
  if (s === "vuejs" || s === "vue") return "vue";
  if (s === "nextjs" || s === "next") return "next";
  return s;
};

const isKeywordInText = (kw, rawText, normRawText) => {
  if (!kw || typeof kw !== "string") return false;
  const cleanKw = kw.trim();
  if (!cleanKw) return false;

  const normKw = normalizeToken(cleanKw);
  if (!normKw) return false;

  if (normRawText.includes(normKw)) return true;

  const lowerKw = cleanKw.toLowerCase();
  const lowerRaw = (rawText || "").toLowerCase();
  if (lowerRaw.includes(lowerKw)) return true;

  const aliases = [];
  if (normKw === "react") aliases.push("react", "reactjs", "react.js");
  if (normKw === "node") aliases.push("node", "nodejs", "node.js");
  if (normKw === "typescript") aliases.push("typescript", "ts");
  if (normKw === "javascript") aliases.push("javascript", "js");
  if (normKw === "vue") aliases.push("vue", "vuejs", "vue.js");
  if (normKw === "next") aliases.push("next", "nextjs", "next.js");

  for (const alias of aliases) {
    if (lowerRaw.includes(alias) || normRawText.includes(alias.replace(/[\.\-\s\/]/g, ""))) {
      return true;
    }
  }

  return false;
};

const processJdKeywords = (rawText, geminiPresent = [], geminiMissing = []) => {
  const combined = [...(geminiPresent || []), ...(geminiMissing || [])];
  if (!combined.length) return { keywordsPresent: [], keywordsMissing: [] };

  const normRawText = (rawText || "").toLowerCase().replace(/[\.\-\s\/]/g, "");

  const presentSet = new Set();
  const missingSet = new Set();
  const seenNorm = new Set();

  combined.forEach((kw) => {
    if (!kw || typeof kw !== "string") return;
    const cleanKw = kw.trim();
    if (!cleanKw) return;

    const normKw = normalizeToken(cleanKw);
    if (!normKw || seenNorm.has(normKw)) return;
    seenNorm.add(normKw);

    if (isKeywordInText(cleanKw, rawText, normRawText)) {
      presentSet.add(cleanKw);
    } else {
      missingSet.add(cleanKw);
    }
  });

  return {
    keywordsPresent: Array.from(presentSet),
    keywordsMissing: Array.from(missingSet).slice(0, 15),
  };
};

export const analyzeVersion = async (userId, resumeId, versionId, targetRole, jobDescription) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) throw new ApiError(404, "Resume not found.");

  const targetVersionId = versionId || resume.currentVersionId;
  const version = await Version.findOne({ _id: targetVersionId, resumeId: resume._id });
  if (!version) throw new ApiError(404, "Resume version not found.");

  let trimmedJD = typeof jobDescription === "string" ? jobDescription.trim() : "";
  if (trimmedJD.length > 0 && (trimmedJD.length < 50 || trimmedJD.length > 8000)) {
    throw new ApiError(400, "Job description must be between 50 and 8000 characters.");
  }

  let finalTargetRole = typeof targetRole === "string" && targetRole.trim().length > 0
    ? targetRole.trim()
    : "";

  const analysisResult = await geminiAnalyzeResume(
    version.parsedSections,
    version.rawText,
    finalTargetRole,
    trimmedJD
  );

  let processedKeywords = { keywordsPresent: [], keywordsMissing: [] };
  if (trimmedJD.length > 0) {
    processedKeywords = processJdKeywords(
      version.rawText,
      analysisResult.keywordsPresent,
      analysisResult.keywordsMissing
    );
  }

  // Check if analysis already exists for this version, update or create
  let analysis = await Analysis.findOne({ versionId: version._id });
  if (analysis) {
    analysis.atsScore = analysisResult.atsScore;
    analysis.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    analysis.targetRole = targetRole !== undefined ? targetRole : (analysis.targetRole || "");
    analysis.jobDescription = trimmedJD;
    analysis.summary = analysisResult.summary;
    analysis.scoreBreakdown = analysisResult.scoreBreakdown;
    analysis.issues = analysisResult.issues;
    analysis.strengths = analysisResult.strengths;
    analysis.keywordsPresent = processedKeywords.keywordsPresent;
    analysis.keywordsMissing = processedKeywords.keywordsMissing;
    analysis.bulletRewrites = analysisResult.bulletRewrites;
    await analysis.save();
  } else {
    analysis = await Analysis.create({
      versionId: version._id,
      atsScore: analysisResult.atsScore,
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      targetRole: targetRole || "",
      jobDescription: trimmedJD,
      summary: analysisResult.summary,
      scoreBreakdown: analysisResult.scoreBreakdown,
      issues: analysisResult.issues,
      strengths: analysisResult.strengths,
      keywordsPresent: processedKeywords.keywordsPresent,
      keywordsMissing: processedKeywords.keywordsMissing,
      bulletRewrites: analysisResult.bulletRewrites,
    });
  }

  version.score = analysisResult.atsScore;
  await version.save();

  return analysis;
};

export const createRewriteVersion = async (userId, resumeId, versionId, appliedRewriteIds = []) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) throw new ApiError(404, "Resume not found.");

  const sourceVersion = await Version.findOne({ _id: versionId, resumeId: resume._id });
  if (!sourceVersion) throw new ApiError(404, "Source version not found.");

  const sourceAnalysis = await Analysis.findOne({ versionId: sourceVersion._id });
  const selectedRewrites = (sourceAnalysis?.bulletRewrites || []).filter((rw) =>
    appliedRewriteIds.includes(rw.id)
  );

  const updatedSections = applyRewrites(sourceVersion.parsedSections, selectedRewrites);

  const existingVersionsCount = await Version.countDocuments({ resumeId: resume._id });
  const nextLabel = `V${existingVersionsCount + 1}`;

  // Build plain text for rawText
  const expBullets = (updatedSections.experience || []).flatMap((e) => e.bullets || []).join("\n");
  const projBullets = (updatedSections.projects || []).flatMap((p) => p.bullets || []).join("\n");
  const newRawText = `${updatedSections.summary || ""}\n${expBullets}\n${projBullets}`;

  const newVersion = await Version.create({
    resumeId: resume._id,
    label: nextLabel,
    sourceType: "rewrite",
    parsedSections: updatedSections,
    rawText: newRawText,
    s3Key: null,
    score: null,
  });

  resume.currentVersionId = newVersion._id;
  await resume.save();

  // Auto-analyze new version, reusing the latest targetRole and jobDescription
  const savedTargetRole = sourceAnalysis?.targetRole || "";
  const savedJobDescription = sourceAnalysis?.jobDescription || "";
  const newAnalysis = await analyzeVersion(userId, resume._id, newVersion._id, savedTargetRole, savedJobDescription);

  return { version: newVersion, analysis: newAnalysis };
};

export const getDiff = async (userId, resumeId, fromVersionId, toVersionId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) throw new ApiError(404, "Resume not found.");

  const fromVersion = await Version.findOne({ _id: fromVersionId, resumeId: resume._id });
  const toVersion = await Version.findOne({ _id: toVersionId, resumeId: resume._id });

  if (!fromVersion || !toVersion) throw new ApiError(404, "One or both specified versions were not found.");

  return {
    fromLabel: fromVersion.label,
    toLabel: toVersion.label,
    fromSections: fromVersion.parsedSections,
    toSections: toVersion.parsedSections,
  };
};

export const getUserResumes = async (userId) => {
  const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

  const result = await Promise.all(
    resumes.map(async (resume) => {
      const versionsCount = await Version.countDocuments({ resumeId: resume._id });
      const currentVersion = await Version.findById(resume.currentVersionId);
      return {
        _id: resume._id,
        title: resume.title,
        versionsCount,
        currentVersion: currentVersion
          ? {
              _id: currentVersion._id,
              label: currentVersion.label,
              sourceType: currentVersion.sourceType,
              score: currentVersion.score,
              createdAt: currentVersion.createdAt,
            }
          : null,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    })
  );

  return result;
};

export const getResumeDetails = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) throw new ApiError(404, "Resume not found.");

  const versions = await Version.find({ resumeId: resume._id }).sort({ createdAt: -1 });

  const versionsWithAnalysis = await Promise.all(
    versions.map(async (v) => {
      const analysis = await Analysis.findOne({ versionId: v._id });
      const downloadUrl = v.s3Key ? await getSignedUrl(v.s3Key) : null;
      return {
        ...v.toObject(),
        analysis: analysis || null,
        downloadUrl,
      };
    })
  );

  return {
    resume,
    versions: versionsWithAnalysis,
  };
};

export const deleteResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) throw new ApiError(404, "Resume not found.");

  const versions = await Version.find({ resumeId: resume._id });
  const versionIds = versions.map((v) => v._id);

  // Delete S3 files
  for (const v of versions) {
    if (v.s3Key) {
      await deleteFromS3(v.s3Key);
    }
  }

  await Analysis.deleteMany({ versionId: { $in: versionIds } });
  await Version.deleteMany({ resumeId: resume._id });
  await Resume.deleteOne({ _id: resume._id });

  return { message: "Resume deleted successfully." };
};
