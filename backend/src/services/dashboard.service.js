import mongoose from "mongoose";
import Resume from "../models/Resume.model.js";
import Version from "../models/Version.model.js";
import Analysis from "../models/Analysis.model.js";

export const getDashboardData = async (user) => {
  const userId = user._id;

  // Initials helper
  const nameParts = (user.name || "").trim().split(" ");
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (user.name?.[0] || "U").toUpperCase();

  const profile = {
    name: user.name,
    email: user.email,
    initials,
  };

  const userResumes = await Resume.find({ userId });
  const resumeIds = userResumes.map((r) => r._id);

  if (resumeIds.length === 0) {
    return {
      stats: { totalResumes: 0, avgScore: 0, bestScore: 0, improvementDelta: 0 },
      scoreEvolution: [],
      latestAnalysis: null,
      profile,
      versions: [],
      activity: [],
    };
  }

  // Get all versions for user's resumes
  const versions = await Version.find({ resumeId: { $in: resumeIds } }).sort({ createdAt: 1 });
  const versionIds = versions.map((v) => v._id);

  const scores = versions.map((v) => v.score).filter((s) => s !== null && s !== undefined);

  const totalResumes = userResumes.length;
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const firstScore = scores.length > 0 ? scores[0] : 0;
  const latestScore = scores.length > 0 ? scores[scores.length - 1] : 0;
  const improvementDelta = scores.length > 1 ? latestScore - firstScore : 0;

  const scoreEvolution = versions
    .filter((v) => v.score !== null && v.score !== undefined)
    .map((v) => ({
      label: v.label,
      score: v.score,
      at: v.createdAt,
    }));

  // Latest Analysis
  const latestVersion = versions[versions.length - 1];
  let latestAnalysis = null;
  if (latestVersion) {
    const rawAnalysis = await Analysis.findOne({ versionId: latestVersion._id });
    if (rawAnalysis) {
      latestAnalysis = {
        ...rawAnalysis.toObject(),
        resumeId: latestVersion.resumeId,
      };
    }
  }

  // Latest 3 versions with resume title
  const resumeMap = new Map(userResumes.map((r) => [r._id.toString(), r.title]));
  const recentVersions = [...versions]
    .reverse()
    .slice(0, 3)
    .map((v) => ({
      _id: v._id,
      resumeId: v.resumeId,
      resumeTitle: resumeMap.get(v.resumeId.toString()) || "Resume",
      label: v.label,
      sourceType: v.sourceType,
      score: v.score,
      createdAt: v.createdAt,
    }));

  // Build activity feed from versions and analyses
  const analyses = await Analysis.find({ versionId: { $in: versionIds } }).sort({ createdAt: -1 });
  const versionMap = new Map(versions.map((v) => [v._id.toString(), v]));

  const activityEvents = [];

  versions.forEach((v) => {
    activityEvents.push({
      id: `ver_${v._id}`,
      type: v.sourceType === "rewrite" ? "rewrite" : "upload",
      title: v.sourceType === "rewrite" ? `Created version ${v.label}` : `Uploaded initial resume`,
      resumeTitle: resumeMap.get(v.resumeId.toString()) || "Resume",
      versionLabel: v.label,
      score: v.score,
      at: v.createdAt,
    });
  });

  analyses.forEach((a) => {
    const v = versionMap.get(a.versionId.toString());
    if (v) {
      const timeDiff = Math.abs(new Date(a.updatedAt || a.createdAt) - new Date(v.createdAt));
      if (timeDiff > 5000) {
        activityEvents.push({
          id: `an_${a._id}`,
          type: "analysis",
          title: `Analyzed ${v.label} (Score: ${a.atsScore})`,
          resumeTitle: resumeMap.get(v.resumeId.toString()) || "Resume",
          versionLabel: v.label,
          score: a.atsScore,
          at: a.updatedAt || a.createdAt,
        });
      }
    }
  });

  const activity = activityEvents
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 8);

  return {
    stats: {
      totalResumes,
      avgScore,
      bestScore,
      improvementDelta,
    },
    scoreEvolution,
    latestAnalysis,
    profile,
    versions: recentVersions,
    activity,
  };
};
