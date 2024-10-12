import { Paragraph } from "../DocumentStructure";
import { TextRunRenderer } from "./TextRunRenderer";
import { FontManager } from "../FontManager";
import { TypesLayoutEngine } from "../LayoutEngine/TypesLayoutEngine"; // Utilisation de TypesLayoutEngine
import { ParagraphLayoutEngine } from "../LayoutEngine/ParagraphLayoutEngine"; // Import de ParagraphLayoutEngine
import { StyleManager } from "../utils/StyleManager"; // Utilisation de StyleManager

export class ParagraphRenderer {
  private context: CanvasRenderingContext2D;
  private textRunRenderer: TextRunRenderer;
  private layoutEngine: TypesLayoutEngine;
  private listCounters: { [key: string]: number };

  constructor(context: CanvasRenderingContext2D, fontManager: FontManager) {
    this.context = context;
    this.textRunRenderer = new TextRunRenderer(context, fontManager, false);

    // Créer et passer un ParagraphLayoutEngine valide
    const paragraphLayoutEngine = new ParagraphLayoutEngine(fontManager, 0, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    // Initialisation de TypesLayoutEngine avec ParagraphLayoutEngine
    this.layoutEngine = new TypesLayoutEngine(
      0,
      {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      paragraphLayoutEngine
    ); // Le ParagraphLayoutEngine est requis maintenant

    this.listCounters = {}; // Initialisation des compteurs de liste
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

    const isBulletParagraph = paragraph.bullet !== undefined;

    let bulletText = "";
    if (isBulletParagraph) {
      const { listId } = paragraph.bullet!;

      if (!this.listCounters[listId]) {
        this.listCounters[listId] = 1;
      } else {
        this.listCounters[listId]++;
      }

      bulletText = `${this.listCounters[listId]}.`;
    }

    for (const line of lines) {
      let x = padding.left;
      const { textRuns, maxAscender, maxDescender } = line;
      const baselineY = y + maxAscender;

      if (isBulletParagraph) {
        this.context.font = "bold 16px Arial";
        this.context.fillText(bulletText, x, baselineY);
        x += this.context.measureText(bulletText).width + 10;
      }

      for (const runInfo of textRuns) {
        const { textRun, font } = runInfo;
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
