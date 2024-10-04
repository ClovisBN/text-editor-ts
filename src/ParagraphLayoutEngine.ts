import { Paragraph, TextRun } from "./Document";
import { FontManager } from "./FontManager";
import { LayoutLine } from "./TextLayoutEngine";
import { styleDataset } from "./styleDataset"; // Import du style par défaut
import { Font } from "opentype.js";
import { BaseLayoutEngine } from "./BaseLayoutEngine"; // Classe de base commune

export class ParagraphLayoutEngine extends BaseLayoutEngine {
  constructor(
    fontManager: FontManager,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    super(fontManager, canvasWidth, padding);
  }

  // Implémentation de la méthode layoutParagraph
  async layoutParagraph(paragraph: Paragraph): Promise<LayoutLine[]> {
    const maxWidth =
      this.canvasWidth - (this.padding.left + this.padding.right);
    const textRuns = paragraph.text.textRuns;
    const lineHeight =
      paragraph.paragraphStyle?.lineHeight || styleDataset.paragraph.lineHeight;

    return this.layoutTextRuns(textRuns); // Utilise la logique commune depuis BaseLayoutEngine
  }

  // Implémentation de la méthode abstraite 'layoutElement'
  async layoutElement(element: Paragraph): Promise<LayoutLine[]> {
    return this.layoutParagraph(element);
  }
}
