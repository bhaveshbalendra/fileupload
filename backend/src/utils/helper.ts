/**
 * Sanitizes a filename by removing or replacing invalid characters
 * @param filename - The filename to sanitize
 * @returns The sanitized filename
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename) return "";

  // Replace invalid characters with underscores
  // Invalid characters: \ / : * ? " < > |
  const sanitized = filename
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_") // Replace multiple spaces with single underscore
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single underscore
    .replace(/^_+|_+$/g, ""); // Remove leading and trailing underscores

  // Ensure filename is not empty after sanitization
  return sanitized || "untitled";
};
