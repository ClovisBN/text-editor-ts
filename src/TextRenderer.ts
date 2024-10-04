import { LayoutLine } from "./TextLayoutEngine";
import { FontManager } from "./FontManager";
import { TextRun } from "./Document";
import { Font, Path } from "opentype.js";
import { renderTextFallback, calculateTextWidth } from "./utils/renderUtils";
import { styleDataset } from "./styleDataset"; // Importer le styleDataset

export class TextRenderer {
  private context: CanvasRenderingContext2D;
  private fontManager: FontManager;
  private showGrid: boolean;

  constructor(
    context: CanvasRenderingContext2D,
    fontManager: FontManager,
    showGrid: boolean
  ) {
    this.context = context;
    this.fontManager = fontManager;
    this.showGrid = showGrid;
  }

  // Méthode pour appliquer les styles avec fallback sur styleDataset
  private getResolvedStyle(textRun: TextRun) {
    return {
      fontSize: textRun.style?.fontSize || styleDataset.textRun.fontSize,
      fontStyle: textRun.style?.fontStyle || styleDataset.textRun.fontStyle,
      bold: textRun.style?.bold ?? styleDataset.textRun.bold,
      italic: textRun.style?.italic ?? styleDataset.textRun.italic,
      color: textRun.style?.color || styleDataset.textRun.color,
      fontFamily: textRun.style?.fontFamily || styleDataset.textRun.fontFamily,
    };
  }

  async renderLines(lines: LayoutLine[], startX: number, startY: number) {
    let y = startY;
    for (const line of lines) {
      let x = startX;
      const baselineY = y + line.maxAscender;

      for (const { textRun, font } of line.textRuns) {
        x = await this.renderTextRun(textRun, x, baselineY, font);
      }

      y += line.maxAscender + line.maxDescender; // Passer à la ligne suivante
    }
  }

  async renderTextRun(
    textRun: TextRun,
    x: number,
    baselineY: number,
    font?: Font
  ): Promise<number> {
    // Résoudre les styles avec fallback
    const style = this.getResolvedStyle(textRun);

    if (!font) {
      font = await this.fontManager.getFormattedFont(style);
    }

    if (font) {
      const advanceWidth = this.renderTextPath(
        font,
        textRun,
        style,
        x,
        baselineY
      );
      x += advanceWidth;
    } else {
      renderTextFallback(this.context, textRun, style, x, baselineY);
      x += calculateTextWidth(this.context, textRun.text);
    }

    return x;
  }

  private renderTextPath(
    font: Font,
    textRun: TextRun,
    style: { fontSize: number; color: string },
    x: number,
    y: number
  ): number {
    const fontSize = style.fontSize;

    // Sauvegarder l'état du contexte une seule fois
    this.context.save();

    // Appliquer le style avant de dessiner le texte
    this.applyTextStyle(style);

    const path: Path = font.getPath(textRun.text, x, y, fontSize);
    path.fill = this.context.fillStyle as string; // Appliquer explicitement la couleur
    path.draw(this.context); // Dessiner le texte

    this.context.restore(); // Restaurer le contexte

    return font.getAdvanceWidth(textRun.text, fontSize);
  }

  // Méthode pour appliquer les styles (couleur, taille, etc.)
  private applyTextStyle(style: { fontSize: number; color: string }) {
    this.context.fillStyle = style.color; // Appliquer la couleur
    console.log("Couleur appliquée :", style.color);
  }
}
