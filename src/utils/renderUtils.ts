// src/renderUtils.ts

import { TextRun } from "../Document";

export function getFontStyle(style: any): string {
  return `${style.bold ? "bold" : ""} ${style.italic ? "italic" : ""} ${
    style.fontSize || 16
  }px ${style.fontFamily || "Arial"}`;
}

export function renderTextFallback(
  context: CanvasRenderingContext2D,
  textRun: TextRun,
  x: number,
  y: number
) {
  console.error(
    `Police non trouvée pour le texte: "${textRun.text}". Utilisation de la police par défaut.`
  );
  context.fillStyle = textRun.style.color || "black";
  context.font = getFontStyle(textRun.style);
  context.fillText(textRun.text, x, y);
}

export function calculateTextWidth(
  context: CanvasRenderingContext2D,
  text: string
): number {
  return context.measureText(text).width;
}
