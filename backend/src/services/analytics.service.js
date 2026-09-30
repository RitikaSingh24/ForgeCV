import Resume from "../models/Resume.model.js";
import Version from "../models/Version.model.js";
import Analysis from "../models/Analysis.model.js";

export const getInsightsData = async (user) => {
  const userResumes = await Resume.find({ userId: user._id });
  const resumeIds = userResumes.map((r) => r._id);

  if (resumeIds.length === 0) {
    return {
      scoreTrends: [],
      topIssues: [],
      missingKeywords: [],
      sectionAverages: [],
    };
  }

  const versions = await Version.find({ resumeId: { $in: resumeIds } }).sort({ createdAt: 1 });
  const versionIds = versions.map((v) => v._id);
  const analyses = await Analysis.find({ versionId: { $in: versionIds } });

  // 1. Score Trends
  const scoreTrends = versions
    .filter((v) => v.score !== null && v.score !== undefined)
    .map((v) => ({
      label: v.label,
      score: v.score,
      at: v.createdAt,
    }));

  // 2. Top Recurring Issues
  const issueCounts = new Map();
  analyses.forEach((an) => {
    (an.issues || []).forEach((issue) => {
      const key = issue.title.trim();
      const existing = issueCounts.get(key) || { title: key, count: 0, severity: issue.severity, section: issue.section };
      existing.count += 1;
      issueCounts.set(key, existing);
    });
  });

  const topIssues = Array.from(issueCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 3. Most Missing Keywords
  const keywordCounts = new Map();
  analyses.forEach((an) => {
    (an.keywordsMissing || []).forEach((kw) => {
      const key = kw.trim().toLowerCase();
      if (key) {
        keywordCounts.set(key, (keywordCounts.get(key) || 0) + 1);
      }
    });
  });

  const missingKeywords = Array.from(keywordCounts.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // 4. Section Score Averages
  const sectionScores = new Map();
  analyses.forEach((an) => {
    (an.scoreBreakdown || []).forEach((item) => {
      const label = item.label;
      const existing = sectionScores.get(label) || { total: 0, count: 0, max: item.max || 100 };
      existing.total += item.score;
      existing.count += 1;
      sectionScores.set(label, existing);
    });
  });

  const sectionAverages = Array.from(sectionScores.entries()).map(([label, data]) => ({
    label,
    score: Math.round(data.total / data.count),
    max: data.max,
  }));

  return {
    scoreTrends,
    topIssues,
    missingKeywords,
    sectionAverages,
  };
};

export const getAllVersionsData = async (user) => {
  const userResumes = await Resume.find({ userId: user._id });
  const resumeIds = userResumes.map((r) => r._id);
  const resumeMap = new Map(userResumes.map((r) => [r._id.toString(), r.title]));

  const versions = await Version.find({ resumeId: { $in: resumeIds } }).sort({ createdAt: -1 });

  return versions.map((v) => ({
    _id: v._id,
    resumeId: v.resumeId,
    resumeTitle: resumeMap.get(v.resumeId.toString()) || "Resume",
    label: v.label,
    sourceType: v.sourceType,
    score: v.score,
    createdAt: v.createdAt,
  }));
};

export const getHistoryData = async (user) => {
  const userResumes = await Resume.find({ userId: user._id });
  const resumeIds = userResumes.map((r) => r._id);
  const resumeMap = new Map(userResumes.map((r) => [r._id.toString(), r.title]));

  const versions = await Version.find({ resumeId: { $in: resumeIds } });
  const versionIds = versions.map((v) => v._id);
  const versionMap = new Map(versions.map((v) => [v._id.toString(), v]));

  const analyses = await Analysis.find({ versionId: { $in: versionIds } });

  const events = [];

  versions.forEach((v) => {
    events.push({
      id: `ver_${v._id}`,
      type: v.sourceType === "rewrite" ? "rewrite" : "upload",
      resumeId: v.resumeId,
      resumeTitle: resumeMap.get(v.resumeId.toString()) || "Resume",
      versionLabel: v.label,
      score: v.score,
      at: v.createdAt,
    });
  });

  analyses.forEach((a) => {
    const v = versionMap.get(a.versionId.toString());
    if (v) {
      events.push({
        id: `an_${a._id}`,
        type: "analysis",
        resumeId: v.resumeId,
        resumeTitle: resumeMap.get(v.resumeId.toString()) || "Resume",
        versionLabel: v.label,
        score: a.atsScore,
        at: a.createdAt,
      });
    }
  });

  return events.sort((a, b) => new Date(b.at) - new Date(a.at));
};
