import { Paragraph, ListItem, TextRun, List } from "./Document";
import { FontManager } from "./FontManager";
import { defaultStyles } from "./styles";
import { Font } from "opentype.js";

export class TextLayoutEngine {
  private fontManager: FontManager;
  private canvasWidth: number;
  private padding: { top: number; right: number; bottom: number; left: number };

  constructor(
    fontManager: FontManager,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    this.fontManager = fontManager;
    this.canvasWidth = canvasWidth;
    this.padding = padding;
  }

  async layoutParagraph(paragraph: Paragraph) {
    const maxWidth = this.canvasWidth - this.padding.left - this.padding.right;
    const textRuns = paragraph.text.textRuns;

    const lineHeight = paragraph.paragraphStyle?.lineHeight || 1.2; // Ajout du système d'interligne

    const fontPromises = textRuns.map((run) =>
      this.fontManager.getFont(run.style)
    );
    const fonts = await Promise.all(fontPromises);

    let lines: any[] = [];
    let currentLine: any = {
      textRuns: [] as any[],
      width: 0,
      maxAscender: 0,
      maxDescender: 0,
    };

    for (let i = 0; i < textRuns.length; i++) {
      const run = textRuns[i];
      const font = fonts[i];
      const fontSize = run.style.fontSize || defaultStyles.paragraph.fontSize;
      const words = run.text.split(" ");

      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        const wordWithSpace = j < words.length - 1 ? word + " " : word;

        let wordWidth = await this.measureTextWidth(
          wordWithSpace,
          font,
          fontSize
        );

        if (
          currentLine.width + wordWidth > maxWidth &&
          currentLine.textRuns.length > 0
        ) {
          // Ligne pleine, on la stocke et on en crée une nouvelle
          lines.push(currentLine);
          currentLine = {
            textRuns: [],
            width: 0,
            maxAscender: 0,
            maxDescender: 0,
          };
        }

        // Calcul des métriques pour la ligne courante
        const scale = fontSize / (font?.unitsPerEm || 1000);
        const ascender = (font?.ascender || fontSize) * scale;
        const descender = Math.abs(
          (font?.descender || -fontSize * 0.2) * scale
        );

        if (ascender > currentLine.maxAscender)
          currentLine.maxAscender = ascender;
        if (descender > currentLine.maxDescender)
          currentLine.maxDescender = descender;

        // Ajouter le mot à la ligne courante
        currentLine.textRuns.push({
          textRun: new TextRun({ text: wordWithSpace, style: run.style }),
          font,
        });
        currentLine.width += wordWidth;
      }
    }

    // Ajouter la dernière ligne si elle n'est pas vide
    if (currentLine.textRuns.length > 0) {
      lines.push(currentLine);
    }

    // Appliquer l'interligne
    lines.forEach((line) => {
      const lineHeightPx = (line.maxAscender + line.maxDescender) * lineHeight;
      line.maxDescender = lineHeightPx - line.maxAscender;
    });

    return lines;
  }

  async layoutListItem(item: ListItem, list: List, index: number) {
    const maxWidth = this.canvasWidth - this.padding.left - this.padding.right;

    const lineHeight = list.listStyle?.lineHeight || 1; // Interligne pour la liste

    const numberText = `${index + 1}. `;
    const numberRun = new TextRun({
      text: numberText,
      style: defaultStyles.list,
    });
    const numberFont = await this.fontManager.getFont(numberRun.style);
    const numberFontSize =
      numberRun.style.fontSize || defaultStyles.list.fontSize;
    const numberWidth = await this.measureTextWidth(
      numberText,
      numberFont,
      numberFontSize
    );

    const textRuns = item.text.textRuns;

    const fontPromises = textRuns.map((run) =>
      this.fontManager.getFont(run.style)
    );
    const fonts = await Promise.all(fontPromises);

    let lines: any[] = [];
    let currentLine: any = {
      textRuns: [] as any[],
      width: numberWidth,
      maxAscender: 0,
      maxDescender: 0,
    };

    // Ajouter le numéro de la liste au début de la première ligne
    const scaleNumber = numberFontSize / (numberFont?.unitsPerEm || 1000);
    const ascenderNumber =
      (numberFont?.ascender || numberFontSize) * scaleNumber;
    const descenderNumber = Math.abs(
      (numberFont?.descender || -numberFontSize * 0.2) * scaleNumber
    );

    currentLine.textRuns.push({
      textRun: numberRun,
      font: numberFont,
    });
    if (ascenderNumber > currentLine.maxAscender)
      currentLine.maxAscender = ascenderNumber;
    if (descenderNumber > currentLine.maxDescender)
      currentLine.maxDescender = descenderNumber;

    for (let i = 0; i < textRuns.length; i++) {
      const run = textRuns[i];
      const font = fonts[i];
      const fontSize = run.style.fontSize || defaultStyles.list.fontSize;
      const words = run.text.split(" ");

      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        const wordWithSpace = j < words.length - 1 ? word + " " : word;

        let wordWidth = await this.measureTextWidth(
          wordWithSpace,
          font,
          fontSize
        );

        if (
          currentLine.width + wordWidth > maxWidth &&
          currentLine.textRuns.length > 0
        ) {
          // Ligne pleine, on la stocke et on en crée une nouvelle
          lines.push(currentLine);
          currentLine = {
            textRuns: [],
            width: 0,
            maxAscender: 0,
            maxDescender: 0,
          };
        }

        // Calcul des métriques pour la ligne courante
        const scale = fontSize / (font?.unitsPerEm || 1000);
        const ascender = (font?.ascender || fontSize) * scale;
        const descender = Math.abs(
          (font?.descender || -fontSize * 0.2) * scale
        );

        if (ascender > currentLine.maxAscender)
          currentLine.maxAscender = ascender;
        if (descender > currentLine.maxDescender)
          currentLine.maxDescender = descender;

        // Ajouter le mot à la ligne courante
        currentLine.textRuns.push({
          textRun: new TextRun({ text: wordWithSpace, style: run.style }),
          font,
        });
        currentLine.width += wordWidth;
      }
    }

    // Ajouter la dernière ligne si elle n'est pas vide
    if (currentLine.textRuns.length > 0) {
      lines.push(currentLine);
    }

    // Appliquer l'interligne
    lines.forEach((line) => {
      const lineHeightPx = (line.maxAscender + line.maxDescender) * lineHeight;
      line.maxDescender = lineHeightPx - line.maxAscender;
    });

    return lines;
  }

  private async measureTextWidth(
    text: string,
    font: Font | undefined,
    fontSize: number
  ): Promise<number> {
    if (font) {
      return font.getAdvanceWidth(text, fontSize);
    } else {
      // Utiliser le contexte du canvas pour mesurer
      return 0; // Remplacez cette partie si nécessaire pour l'intégration avec un contexte
    }
  }
}
