import { TextRun } from "../DocumentStructure";
import { StyleManager } from "../utils/StyleManager"; // Import mis à jour

export function getFontStyle(style: any): string {
  const resolvedStyle = StyleManager.getTextRunStyle(style);

  return `${resolvedStyle.bold ? "bold" : ""} ${
    resolvedStyle.italic ? "italic" : ""
  } ${resolvedStyle.fontSize || 16}px ${resolvedStyle.fontFamily || "Arial"}`;
}

export function renderTextFallback(
  context: CanvasRenderingContext2D,
  textRun: TextRun,
  style: any,
  x: number,
  y: number
) {
  const resolvedStyle = StyleManager.getTextRunStyle(style);

  console.error(
    `Police non trouvée pour le texte: "${textRun.text}". Utilisation de la police par défaut.`
  );
  context.fillStyle = resolvedStyle.color || "black";
  context.font = getFontStyle(resolvedStyle);
  context.fillText(textRun.text, x, y);
}

export function calculateTextWidth(
  context: CanvasRenderingContext2D,
  text: string
): number {
  return context.measureText(text).width;
}
