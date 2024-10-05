import { TextRun } from "../DocumentStructure";
import { styleDataset } from "../StyleDefaults"; // Importer le styleDataset

export function getFontStyle(style: any): string {
  const resolvedStyle = {
    ...styleDataset.textRun, // Utiliser les valeurs par défaut
    ...style, // Remplacer par les valeurs spécifiques du textRun
  };

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
  const resolvedStyle = {
    ...styleDataset.textRun, // Valeurs par défaut
    ...style, // Valeurs du textRun
  };

  console.error(
    `Police non trouvée pour le texte: "${textRun.text}". Utilisation de la police par défaut.`
  );
  context.fillStyle = resolvedStyle.color || "black"; // Assurer la couleur ici
  context.font = getFontStyle(resolvedStyle);
  context.fillText(textRun.text, x, y);
}

export function calculateTextWidth(
  context: CanvasRenderingContext2D,
  text: string
): number {
  return context.measureText(text).width;
}
