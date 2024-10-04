import { LayoutLine } from "./TextLayoutEngine";
import { FontManager } from "./FontManager";
import { TextRun } from "./Document";
import { Font, Path } from "opentype.js";
import { renderTextFallback, calculateTextWidth } from "./utils/renderUtils";

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
    if (!font) {
      font = await this.fontManager.getFormattedFont(textRun.style);
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
    const fontSize = textRun.style.fontSize || 12;
    this.context.save();

    this.context.fillStyle = textRun.style.color || "black";

    const path: Path = font.getPath(textRun.text, x, y, fontSize);
    path.draw(this.context);

    this.context.restore();

    return font.getAdvanceWidth(textRun.text, fontSize);
  }
}
