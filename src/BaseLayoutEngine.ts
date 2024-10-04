import { TextRun } from "./Document";
import { FontManager } from "./FontManager";
import { LayoutLine } from "./TextLayoutEngine";
import { styleDataset } from "./styleDataset"; // Import des styles par défaut

export abstract class BaseLayoutEngine {
  protected fontManager: FontManager;
  protected canvasWidth: number;
  protected padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  constructor(
    fontManager: FontManager,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    this.fontManager = fontManager;
    this.canvasWidth = canvasWidth;
    this.padding = padding;
  }

  setCanvasWidth(width: number): void {
    this.canvasWidth = width;
  }

  setPadding(padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }): void {
    this.padding = padding;
  }

  // Méthode commune pour la mise en page des TextRun, partagée entre paragraphe et liste
  protected async layoutTextRuns(textRuns: TextRun[]): Promise<LayoutLine[]> {
    const maxWidth = this.canvasWidth - this.padding.left - this.padding.right;

    const fontPromises = textRuns.map((run) =>
      this.fontManager.getFormattedFont({
        ...styleDataset.textRun, // Valeur par défaut
        ...run.style, // Valeur JSON prioritaire
      })
    );
    const fonts = await Promise.all(fontPromises);

    let lines: LayoutLine[] = [];
    let currentLine: LayoutLine = {
      textRuns: [],
      width: 0,
      maxAscender: 0,
      maxDescender: 0,
    };

    for (let i = 0; i < textRuns.length; i++) {
      const run = textRuns[i];
      const font = fonts[i];
      const fontSize = run.style.fontSize || styleDataset.textRun.fontSize;
      const words = run.text.split(" ");

      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        const wordWithSpace = j < words.length - 1 ? word + " " : word;

        const wordWidth = font ? font.getAdvanceWidth(word, fontSize) : 0;
        const spaceWidth =
          j < words.length - 1
            ? font
              ? font.getAdvanceWidth(" ", fontSize)
              : 0
            : 0;

        if (
          currentLine.width + wordWidth + spaceWidth > maxWidth &&
          currentLine.textRuns.length > 0
        ) {
          lines.push(currentLine);
          currentLine = {
            textRuns: [],
            width: 0,
            maxAscender: 0,
            maxDescender: 0,
          };
        }

        const scale = fontSize / (font?.unitsPerEm || 1000);
        const ascender = (font?.ascender || fontSize) * scale;
        const descender = Math.abs(
          (font?.descender || -fontSize * 0.2) * scale
        );

        if (ascender > currentLine.maxAscender)
          currentLine.maxAscender = ascender;
        if (descender > currentLine.maxDescender)
          currentLine.maxDescender = descender;

        currentLine.textRuns.push({
          textRun: new TextRun({ text: wordWithSpace, style: run.style }),
          font,
        });

        currentLine.width += wordWidth;
        if (j < words.length - 1) {
          currentLine.width += spaceWidth;
        }
      }
    }

    if (currentLine.textRuns.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  // Méthode abstraite à implémenter par les sous-classes
  abstract layoutElement(element: any): Promise<LayoutLine[]>;
}
