import { ListItem } from "../DocumentStructure";
import { FontManager } from "../FontManager";
import { LayoutLine } from "./TypesLayoutEngine";
import { StyleManager } from "../utils/StyleManager"; // Utilisation de StyleManager
import { TextRunLayoutEngine } from "./TextRunLayoutEngine"; // Classe de base commune

export class ListLayoutEngine extends TextRunLayoutEngine {
  constructor(
    fontManager: FontManager,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    super(fontManager, canvasWidth, padding);
  }

  // Utilise une méthode utilitaire pour compléter les styles et gérer les TextRuns
  async layoutListItem(item: ListItem, index: number): Promise<LayoutLine[]> {
    const textRuns = StyleManager.completeTextRuns(item.text.textRuns); // Utilisation d'une méthode utilitaire pour gérer les styles
    return this.layoutTextRuns(textRuns); // Utilise la logique commune depuis TextRunLayoutEngine
  }

  // Implémentation de la méthode abstraite 'layoutElement'
  async layoutElement(item: ListItem): Promise<LayoutLine[]> {
    return this.layoutListItem(item, 0); // Utilise layoutListItem pour l'implémentation
  }
}
