import { Paragraph } from "../DocumentStructure";
import { TypesLayoutEngine } from "../LayoutEngine/TypesLayoutEngine";
import { TextRunRenderer } from "./TextRunRenderer";
import { FontManager } from "../FontManager";
import { ParagraphLayoutEngine } from "../LayoutEngine/ParagraphLayoutEngine"; // Import uniquement ParagraphLayoutEngine
import { StyleManager } from "../utils/StyleManager"; // Utilisation de StyleManager

export class ParagraphRenderer {
  private context: CanvasRenderingContext2D;
  private textRunRenderer: TextRunRenderer;
  private layoutEngine: TypesLayoutEngine;

  constructor(context: CanvasRenderingContext2D, fontManager: FontManager) {
    this.context = context;
    this.textRunRenderer = new TextRunRenderer(context, fontManager, false);

    const paragraphLayoutEngine = new ParagraphLayoutEngine(fontManager, 0, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    // Création de TypesLayoutEngine uniquement avec ParagraphLayoutEngine
    this.layoutEngine = new TypesLayoutEngine(
      0, // largeur du canvas
      { top: 0, right: 0, bottom: 0, left: 0 }, // padding
      paragraphLayoutEngine
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

    this.context.strokeStyle = "white";
    this.context.lineWidth = 1;

    for (const line of lines) {
      let x = padding.left;
      const { textRuns, maxAscender, maxDescender } = line;
      const baselineY = y + maxAscender;

      const lineHeight = maxAscender + maxDescender;
      const lineWidth = canvasWidth - padding.left - padding.right;

      this.context.strokeRect(x, y, lineWidth, lineHeight);

      for (const runInfo of textRuns) {
        const { textRun, font } = runInfo;
        const style = StyleManager.getTextRunStyle(textRun.style);
        x = await this.textRunRenderer.renderTextRun(
          textRun,
          x,
          baselineY,
          font
        );
      }

      y += maxAscender + maxDescender;
    }
    return y;
  }
}
