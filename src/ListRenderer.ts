import { List } from "./Document";
import { TextLayoutEngine } from "./TextLayoutEngine";
import { TextRenderer } from "./TextRenderer";
import { FontManager } from "./FontManager";
import { ParagraphLayoutEngine } from "./ParagraphLayoutEngine";
import { ListLayoutEngine } from "./ListLayoutEngine";
import { styleDataset } from "./styleDataset"; // Import des styles par défaut

export class ListRenderer {
  private context: CanvasRenderingContext2D;
  private textRenderer: TextRenderer;
  private layoutEngine: TextLayoutEngine;

  constructor(context: CanvasRenderingContext2D, fontManager: FontManager) {
    this.context = context;
    this.textRenderer = new TextRenderer(context, fontManager, false);

    const paragraphLayoutEngine = new ParagraphLayoutEngine(fontManager, 0, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
    const listLayoutEngine = new ListLayoutEngine(fontManager, 0, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    this.layoutEngine = new TextLayoutEngine(
      paragraphLayoutEngine,
      listLayoutEngine,
      0,
      {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }
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

      // Fusionner les styles de l'élément avec ceux par défaut
      const style = {
        ...styleDataset.textRun, // Styles par défaut
        ...firstRun.style, // Priorité au style de la structure JSON
      };
      const fontSize = style.fontSize; // Utiliser la taille de police correcte

      // Système de numérotation ou de puces
      if (list.listStyle.ordered) {
        // Numérotation : alignée à droite dans l'espace réservé
        const bullet = `${index + 1}.`;
        this.context.font = `${fontSize}px ${style.fontFamily}`;
        const bulletWidth = this.context.measureText(bullet).width;
        const bulletX = padding.left + listIndentation - bulletWidth;
        this.context.fillText(bullet, bulletX, y + fontSize);
      } else {
        // Puce : centrée dans l'espace réservé
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

      // Rendu du texte de l'élément de la liste avec un espace constant entre la puce/numéro et le texte
      for (const line of lines) {
        let x = padding.left + listIndentation + spacingBetweenBulletAndText;
        const { textRuns, maxAscender, maxDescender } = line;
        const baselineY = y + maxAscender;

        for (const runInfo of textRuns) {
          const { textRun, font } = runInfo;
          x = await this.textRenderer.renderTextRun(
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
