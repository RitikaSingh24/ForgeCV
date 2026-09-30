import mongoose from "mongoose";

const scoreBreakdownSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    score: { type: Number, required: true },
    max: { type: Number, required: true, default: 100 },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    severity: { type: String, enum: ["high", "medium", "low"], required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    section: { type: String, default: "General" },
  },
  { _id: false }
);

const strengthSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false }
);

const bulletRewriteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    section: { type: String, required: true },
    original: { type: String, required: true },
    improved: { type: String, required: true },
    reason: { type: String, required: true },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    versionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      required: true,
      index: true,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    scoreBreakdown: [scoreBreakdownSchema],
    issues: [issueSchema],
    strengths: [strengthSchema],
    keywordsPresent: [{ type: String }],
    keywordsMissing: [{ type: String }],
    bulletRewrites: [bulletRewriteSchema],
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;
