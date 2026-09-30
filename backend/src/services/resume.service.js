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

  return { resume, version };
};

export const analyzeVersion = async (userId, resumeId, versionId, targetRole) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) throw new ApiError(404, "Resume not found.");

  const targetVersionId = versionId || resume.currentVersionId;
  const version = await Version.findOne({ _id: targetVersionId, resumeId: resume._id });
  if (!version) throw new ApiError(404, "Resume version not found.");

  const analysisResult = await geminiAnalyzeResume(
    version.parsedSections,
    version.rawText,
    targetRole || "General Software Engineer"
  );

  // Check if analysis already exists for this version, update or create
  let analysis = await Analysis.findOne({ versionId: version._id });
  if (analysis) {
    analysis.atsScore = analysisResult.atsScore;
    analysis.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    analysis.summary = analysisResult.summary;
    analysis.scoreBreakdown = analysisResult.scoreBreakdown;
    analysis.issues = analysisResult.issues;
    analysis.strengths = analysisResult.strengths;
    analysis.keywordsPresent = analysisResult.keywordsPresent;
    analysis.keywordsMissing = analysisResult.keywordsMissing;
    analysis.bulletRewrites = analysisResult.bulletRewrites;
    await analysis.save();
  } else {
    analysis = await Analysis.create({
      versionId: version._id,
      atsScore: analysisResult.atsScore,
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      summary: analysisResult.summary,
      scoreBreakdown: analysisResult.scoreBreakdown,
      issues: analysisResult.issues,
      strengths: analysisResult.strengths,
      keywordsPresent: analysisResult.keywordsPresent,
      keywordsMissing: analysisResult.keywordsMissing,
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

  // Auto-analyze new version
  const newAnalysis = await analyzeVersion(userId, resume._id, newVersion._id);

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
