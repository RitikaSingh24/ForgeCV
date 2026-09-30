import mongoose from "mongoose";

const defaultParsedSections = () => ({
  basics: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    links: [],
  },
  summary: "",
  experience: [], // [{ company, role, start, end, bullets: [] }]
  projects: [],   // [{ name, tech: [], bullets: [] }]
  education: [],  // [{ school, degree, start, end }]
  skills: [],
  certifications: [],
  languages: [],
  interests: [],
});

const versionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: true, // e.g. "V1", "V2"
    },
    sourceType: {
      type: String,
      enum: ["upload", "rewrite"],
      default: "upload",
    },
    parsedSections: {
      type: mongoose.Schema.Types.Mixed,
      default: defaultParsedSections,
    },
    rawText: {
      type: String,
      default: "",
    },
    s3Key: {
      type: String,
      default: null,
    },
    score: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Version = mongoose.model("Version", versionSchema);
export default Version;
