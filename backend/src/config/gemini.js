import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiModel = (modelName) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY is not configured in backend/.env file.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const selectedModel = modelName || process.env.GEMINI_MODEL || "gemini-3.6-flash";
  return genAI.getGenerativeModel({ model: selectedModel });
};

export default getGeminiModel;
