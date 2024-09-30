import { TextRun } from "./Document";
import { FontManager } from "./FontManager";
import { Font, Path } from "opentype.js";
import {
  renderTextFallback,
  getFontStyle,
  calculateTextWidth,
} from "./utils/renderUtils";

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

  async renderTextRun(
    textRun: TextRun,
    x: number,
    baselineY: number,
    font?: Font
  ): Promise<number> {
    if (!font) {
      font = await this.fontManager.getFont(textRun.style);
    }

    if (font) {
      const advanceWidth = this.renderTextPath(font, textRun, x, baselineY);
      x += advanceWidth;
    } else {
      renderTextFallback(this.context, textRun, x, baselineY);
      x += calculateTextWidth(this.context, textRun.text);
    }

    return x;
  }

  private renderTextPath(
    font: Font,
    textRun: TextRun,
    x: number,
    y: number
  ): number {
    const fontSize = textRun.style.fontSize || 16;
    this.context.save();

    // Définir la couleur du texte
    this.context.fillStyle = textRun.style.color || "black";

    // Dessiner le texte avec la police appropriée
    const path: Path = font.getPath(textRun.text, x, y, fontSize);
    path.draw(this.context);

    this.context.restore(); // Restaurer le contexte après le rendu

    // Calculer l'avance horizontale en utilisant getAdvanceWidth
    const advanceWidth = font.getAdvanceWidth(textRun.text, fontSize);

    return advanceWidth;
  }
}
