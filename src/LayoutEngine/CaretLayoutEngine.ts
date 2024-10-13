import { Document } from "../DocumentStructure";
import { FontManager } from "../FontManager";
import { ParagraphLayoutEngine } from "./ParagraphLayoutEngine";

export class CaretLayoutEngine {
  private fontManager: FontManager;
  private paragraphLayoutEngine: ParagraphLayoutEngine;

  constructor(
    fontManager: FontManager,
    paragraphLayoutEngine: ParagraphLayoutEngine
  ) {
    this.fontManager = fontManager;
    this.paragraphLayoutEngine = paragraphLayoutEngine;
  }

  async getCaretPosition(
    document: Document,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ): Promise<{ x: number; y: number; height: number }> {
    const firstParagraph = document.elements[0]; // Prend le premier élément du document
    const lines = await this.paragraphLayoutEngine.layoutParagraph(
      firstParagraph
    );

    const firstLine = lines[0];
    const firstTextRun = firstLine.textRuns[0]; // Premier `textRun` du premier élément
    const font = firstTextRun.font;
    const fontSize = firstTextRun.textRun.style.fontSize || 12;

    // Calcul du scale pour ajuster la taille du texte en fonction de la police
    const scale = fontSize / (font?.unitsPerEm || 1000);
    const ascender = (font?.ascender || fontSize) * scale; // Hauteur au-dessus de la ligne de base (ascender)
    const descender = Math.abs((font?.descender || fontSize * 0.2) * scale); // Hauteur sous la ligne de base (descender)

    const caretHeight = ascender + descender; // Hauteur totale du caret = ascender + descender

    // On place le haut du caret directement à l'ascender
    const y = padding.top + scale; // Le haut du caret est positionné directement en fonction du padding

    const x = padding.left; // Le caret est au début du texte, donc x = padding.left

    return { x, y, height: caretHeight }; // Renvoie la position x, y et la hauteur du caret
  }
}
