// src/fontUtils.ts

export interface FontStyle {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?:
    | "Thin"
    | "ExtraLight"
    | "Light"
    | "Regular"
    | "Medium"
    | "SemiBold"
    | "Bold"; // Ajout des poids possibles
}

// Génère une clé unique basée sur le style de police
export function getFontStyleKey(style: FontStyle): string {
  if (style.bold && style.italic) return "bolditalic";
  if (style.bold) return "bold";
  if (style.italic) return "italic";
  return "normal";
}

// Génère une clé de police basée sur le nom de la famille de polices et le style
export function generateFontKey(fontFamily: string, style: FontStyle): string {
  const fontStyleKey = getFontStyleKey(style);
  return `${fontFamily}-${fontStyleKey}`;
}
