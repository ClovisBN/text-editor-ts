import { Document, Paragraph } from "../DocumentStructure"; // Import seulement Paragraph
import { FontManager } from "../FontManager";
import { ParagraphRenderer } from "./ParagraphRenderer"; // Importer la classe de rendu des paragraphes
import { CaretRenderer } from "./CaretRenderer"; // Importer le CaretRenderer
import { CaretLayoutEngine } from "../LayoutEngine/CaretLayoutEngine"; // Importer le CaretLayoutEngine
import { ParagraphLayoutEngine } from "../LayoutEngine/ParagraphLayoutEngine"; // Importer ParagraphLayoutEngine

export class TypesRenderer {
  private context: CanvasRenderingContext2D;
  private paragraphRenderer: ParagraphRenderer;
  private caretRenderer: CaretRenderer; // Nouveau renderer pour le caret
  private caretLayoutEngine: CaretLayoutEngine; // Nouveau layout engine pour le caret
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
    this.caretRenderer = new CaretRenderer(context); // Initialisation du CaretRenderer

    // Correction : Initialisation correcte de l'instance de ParagraphLayoutEngine
    const paragraphLayoutEngine = new ParagraphLayoutEngine(
      this.fontManager,
      canvasWidth,
      padding
    );

    this.caretLayoutEngine = new CaretLayoutEngine(
      this.fontManager,
      paragraphLayoutEngine
    ); // Utilisation de l'instance correcte
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
      }
    }

    // Calculer et dessiner le caret après le rendu du document
    const caretPosition = await this.caretLayoutEngine.getCaretPosition(
      document,
      this.canvasWidth,
      this.padding
    );
    this.caretRenderer.startBlinking(
      caretPosition.x,
      caretPosition.y,
      caretPosition.height
    );
  }
}
