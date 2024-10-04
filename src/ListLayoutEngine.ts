import { ListItem, TextRun } from "./Document";
import { FontManager } from "./FontManager";
import { LayoutLine } from "./TextLayoutEngine";
import { styleDataset } from "./styleDataset"; // Import des styles par défaut
import { Font } from "opentype.js";
import { BaseLayoutEngine } from "./BaseLayoutEngine"; // Classe de base commune

export class ListLayoutEngine extends BaseLayoutEngine {
  constructor(
    fontManager: FontManager,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    super(fontManager, canvasWidth, padding);
  }

  // Implémentation de la méthode layoutListItem
  async layoutListItem(item: ListItem, index: number): Promise<LayoutLine[]> {
    return this.layoutTextRuns(item.text.textRuns); // Utilise la logique commune depuis BaseLayoutEngine
  }

  // Implémentation de la méthode abstraite 'layoutElement'
  async layoutElement(item: ListItem): Promise<LayoutLine[]> {
    return this.layoutListItem(item, 0); // Utilise layoutListItem pour l'implémentation
  }
}
