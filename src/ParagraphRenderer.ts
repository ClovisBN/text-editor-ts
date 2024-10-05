import { Paragraph } from "./DocumentStructure";
import { TextLayoutEngine } from "./TextLayoutEngine";
import { TextRenderer } from "./TextRenderer";
import { FontManager } from "./FontManager";
import { ParagraphLayoutEngine } from "./ParagraphLayoutEngine"; // Import
import { ListLayoutEngine } from "./ListLayoutEngine"; // Import
import { StyleManager } from "./utils/StyleManager"; // Utilisation de StyleManager

export class ParagraphRenderer {
  private context: CanvasRenderingContext2D;
  private textRenderer: TextRenderer;
  private layoutEngine: TextLayoutEngine;

  constructor(context: CanvasRenderingContext2D, fontManager: FontManager) {
    this.context = context;
    this.textRenderer = new TextRenderer(context, fontManager, false);

    const paragraphLayoutEngine = new ParagraphLayoutEngine(fontManager, 0, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
    const listLayoutEngine = new ListLayoutEngine(fontManager, 0, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    this.layoutEngine = new TextLayoutEngine(
      paragraphLayoutEngine,
      listLayoutEngine,
      0,
      {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }
    );
  }

  async renderParagraph(
    paragraph: Paragraph,
    y: number,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ): Promise<number> {
    this.layoutEngine.setCanvasWidth(canvasWidth);
    this.layoutEngine.setPadding(padding);

    const lines = await this.layoutEngine.layoutParagraph(paragraph);

    this.context.strokeStyle = "red";
    this.context.lineWidth = 1;

    for (const line of lines) {
      let x = padding.left;
      const { textRuns, maxAscender, maxDescender } = line;
      const baselineY = y + maxAscender;

      const lineHeight = maxAscender + maxDescender;
      const lineWidth = canvasWidth - padding.left - padding.right;

      this.context.strokeRect(x, y, lineWidth, lineHeight);

      // Utilisation correcte des styles avec StyleManager pour chaque TextRun
      for (const runInfo of textRuns) {
        const { textRun, font } = runInfo;

        const style = StyleManager.getTextRunStyle(textRun.style); // Utilisation de StyleManager

        x = await this.textRenderer.renderTextRun(textRun, x, baselineY, font);
      }

      y += maxAscender + maxDescender;
    }
    return y;
  }
}
