import { Document, Paragraph, List } from "../DocumentStructure"; // Importer Paragraph et List
import { FontManager } from "../FontManager";
import { ParagraphRenderer } from "./ParagraphRenderer"; // Importer la classe de rendu des paragraphes
import { ListRenderer } from "./ListRenderer"; // Importer la classe de rendu des listes

export class TypesRenderer {
  private context: CanvasRenderingContext2D;
  private paragraphRenderer: ParagraphRenderer;
  private listRenderer: ListRenderer;
  private fontManager: FontManager;
  private canvasWidth: number;
  private canvasHeight: number;
  private padding: { top: number; right: number; bottom: number; left: number };

  constructor(
    context: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    this.context = context;
    this.fontManager = new FontManager(); // Gestion des polices centralisée
    this.paragraphRenderer = new ParagraphRenderer(context, this.fontManager);
    this.listRenderer = new ListRenderer(context, this.fontManager);
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.padding = padding;
  }

  async renderDocument(document: Document): Promise<void> {
    // Charger toutes les polices avant de commencer le rendu
    await this.fontManager.loadFonts();

    let y = this.padding.top;

    for (const element of document.elements) {
      if (element instanceof Paragraph) {
        y = await this.paragraphRenderer.renderParagraph(
          element,
          y,
          this.canvasWidth,
          this.padding
        );
      } else if (element instanceof List) {
        y = await this.listRenderer.renderList(
          element,
          y,
          this.canvasWidth,
          this.padding
        );
      }
    }
  }
}
