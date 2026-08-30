import slugify from "slugify";
import { SlugOptions, SlugResult } from "../types/index.js";

export function generateSlug(options: SlugOptions): SlugResult {
  const { text, lowercase = true, separator = "-" } = options;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Text parameter is required and cannot be empty");
  }

  const rawSlug = slugify(text, {
    replacement: separator,
    lower: lowercase,
    strict: true,
    trim: true
  });

  return {
    slug: rawSlug
  };
}
