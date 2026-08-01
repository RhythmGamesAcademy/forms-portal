import html2canvas from "html2canvas";

/**
 * Wait for all fonts to be loaded before rendering.
 * Zen Kurenaido may take time to load on first use.
 */
async function waitForFonts(): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  // Extra safety: small delay for font rendering
  await new Promise((resolve) => setTimeout(resolve, 200));
}

/**
 * Generate a PNG from a DOM element and trigger download.
 */
export async function generatePng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  await waitForFonts();

  const canvas = await html2canvas(element, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: 794,
    height: element.scrollHeight,
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  if (!blob) {
    throw new Error("PNG generation failed");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format today's date as YYYY/MM/DD for display in the document.
 */
export function formatDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

/**
 * Format today's date as YYYYMMDD for filenames.
 */
export function formatDateForFilename(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}
