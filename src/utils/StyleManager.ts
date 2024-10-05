import { styleDataset } from "../StyleDefaults";
import { TextRun } from "../DocumentStructure"; // Import des éléments de document

export class StyleManager {
  // Méthode pour fusionner les styles manquants avec les valeurs par défaut
  static resolveStyle(customStyle: any, defaultStyle: any) {
    const resolvedStyle = { ...defaultStyle };
    for (const key in customStyle) {
      if (customStyle.hasOwnProperty(key) && customStyle[key] !== undefined) {
        resolvedStyle[key] = customStyle[key];
      }
    }
    return resolvedStyle;
  }

  // Méthode utilitaire pour compléter les styles des TextRuns
  static completeTextRuns(textRuns: TextRun[]): TextRun[] {
    return textRuns.map((run) => ({
      ...run,
      style: this.getTextRunStyle(run.style),
    }));
  }

  // Gestion des styles pour les TextRuns
  static getTextRunStyle(customStyle: any) {
    const defaultStyle = styleDataset.textRun;
    return this.resolveStyle(customStyle, defaultStyle);
  }

  // Gestion des styles pour les Paragraphes
  static getParagraphStyle(customStyle: any) {
    const defaultStyle = styleDataset.paragraph;
    return this.resolveStyle(customStyle, defaultStyle);
  }

  // Gestion des styles pour les Listes
  static getListStyle(customStyle: any) {
    const defaultStyle = styleDataset.list;
    return this.resolveStyle(customStyle, defaultStyle);
  }
}
