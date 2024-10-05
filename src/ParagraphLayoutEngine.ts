import { Paragraph } from "./DocumentStructure";
import { FontManager } from "./FontManager";
import { LayoutLine } from "./TextLayoutEngine";
import { StyleManager } from "./utils/StyleManager"; // Utilisation de StyleManager
import { BaseLayoutEngine } from "./BaseLayoutEngine"; // Classe de base commune

export class ParagraphLayoutEngine extends BaseLayoutEngine {
  constructor(
    fontManager: FontManager,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    super(fontManager, canvasWidth, padding);
  }

  // Utilise une méthode utilitaire pour compléter les styles et gérer les TextRuns
  async layoutParagraph(paragraph: Paragraph): Promise<LayoutLine[]> {
    const textRuns = StyleManager.completeTextRuns(paragraph.text.textRuns); // Utilisation d'une méthode utilitaire pour gérer les styles
    return this.layoutTextRuns(textRuns); // Utilise la logique commune depuis BaseLayoutEngine
  }

  // Implémentation de la méthode abstraite 'layoutElement'
  async layoutElement(element: Paragraph): Promise<LayoutLine[]> {
    return this.layoutParagraph(element);
  }
}
