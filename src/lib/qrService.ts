import QRCode from "qrcode";
import { QrOptions, QrResult } from "../types/index.js";

export async function generateQrCode(options: QrOptions): Promise<QrResult> {
  const { text, format = "png", size = 300 } = options;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Text parameter is required and cannot be empty");
  }

  if (text.length > 2000) {
    throw new Error("Text length exceeds the maximum limit of 2000 characters");
  }

  const width = Math.min(Math.max(Number(size) || 300, 50), 2000);

  if (format === "svg") {
    const svgString = await QRCode.toString(text, {
      type: "svg",
      width,
      margin: 2
    });
    return {
      format: "svg",
      data: svgString,
      contentType: "image/svg+xml"
    };
  }

  if (format === "base64") {
    const dataUrl = await QRCode.toDataURL(text, {
      width,
      margin: 2
    });
    return {
      format: "base64",
      data: dataUrl,
      contentType: "text/plain"
    };
  }

  const pngBuffer = await QRCode.toBuffer(text, {
    type: "png",
    width,
    margin: 2
  });

  return {
    format: "png",
    data: pngBuffer,
    contentType: "image/png"
  };
}
