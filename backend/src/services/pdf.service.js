import { createRequire } from "module";
import ApiError from "../utils/ApiError.js";

const require = createRequire(import.meta.url);
const pdfPkg = require("pdf-parse");

export const extractText = async (buffer) => {
  try {
    let text = "";

    if (typeof pdfPkg === "function") {
      const data = await pdfPkg(buffer);
      text = data?.text ? data.text.trim() : "";
    } else if (pdfPkg.PDFParse) {
      const parser = new pdfPkg.PDFParse({ data: buffer });
      const data = await parser.getText();
      text = data?.text ? data.text.trim() : "";
    } else if (pdfPkg.default && typeof pdfPkg.default === "function") {
      const data = await pdfPkg.default(buffer);
      text = data?.text ? data.text.trim() : "";
    }

    if (!text || text.length < 100) {
      throw new ApiError(
        422,
        "Resume text could not be extracted or PDF is scanned/empty. Please upload a text-based PDF resume."
      );
    }

    return text;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(422, `Failed to parse PDF document: ${error.message || "Invalid PDF format"}`);
  }
};
