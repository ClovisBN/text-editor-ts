import { List } from "../DocumentStructure";
import { TypesLayoutEngine } from "../LayoutEngine/TypesLayoutEngine";
import { TextRunRenderer } from "./TextRunRenderer";
import { FontManager } from "../FontManager";
import { ListLayoutEngine } from "../LayoutEngine/ListLayoutEngine"; // Import uniquement ListLayoutEngine
import { StyleManager } from "../utils/StyleManager"; // Utilisation de StyleManager

export class ListRenderer {
  private context: CanvasRenderingContext2D;
  private textRunRenderer: TextRunRenderer;
  private layoutEngine: TypesLayoutEngine;

  constructor(context: CanvasRenderingContext2D, fontManager: FontManager) {
    this.context = context;
    this.textRunRenderer = new TextRunRenderer(context, fontManager, false);

    const listLayoutEngine = new ListLayoutEngine(fontManager, 0, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    // Création de TypesLayoutEngine uniquement avec ListLayoutEngine
    this.layoutEngine = new TypesLayoutEngine(
      0, // largeur du canvas
      { top: 0, right: 0, bottom: 0, left: 0 }, // padding
      undefined, // ParagraphLayoutEngine n'est pas nécessaire ici
      listLayoutEngine
    );
  }

  async renderList(
    list: List,
    y: number,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ): Promise<number> {
    this.layoutEngine.setCanvasWidth(canvasWidth);
    this.layoutEngine.setPadding(padding);

    const listIndentation = 30; // Largeur fixe pour l'espace réservé aux puces ou numéros
    const spacingBetweenBulletAndText = 10; // Espace fixe entre la puce/le numéro et le texte

    for (const [index, item] of list.items.entries()) {
      const lines = await this.layoutEngine.layoutListItem(item, index);
      const firstRun = item.text.textRuns[0];

      // Utilisation de StyleManager pour fusionner les styles
      const style = StyleManager.getTextRunStyle(firstRun.style);

      const fontSize = style.fontSize; // Utiliser la taille de police correcte

      // Système de numérotation ou de puces
      if (list.listStyle.ordered) {
        const bullet = `${index + 1}.`;
        this.context.font = `${fontSize}px ${style.fontFamily}`;
        const bulletWidth = this.context.measureText(bullet).width;
        const bulletX = padding.left + listIndentation - bulletWidth;
        this.context.fillText(bullet, bulletX, y + fontSize);
      } else {
        const bulletRadius = 0.2 * fontSize;
        const bulletX = padding.left + listIndentation / 2;
        this.context.beginPath();
        this.context.arc(
          bulletX,
          y + fontSize / 2,
          bulletRadius,
          0,
          2 * Math.PI
        );
        this.context.fill();
      }

      for (const line of lines) {
        let x = padding.left + listIndentation + spacingBetweenBulletAndText;
        const { textRuns, maxAscender, maxDescender } = line;
        const baselineY = y + maxAscender;

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
    }
    return y;
  }
}
