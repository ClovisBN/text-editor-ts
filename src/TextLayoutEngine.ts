import { Paragraph, ListItem, TextRun, List } from "./Document";
import { FontManager } from "./FontManager";
import { defaultStyles } from "./styles";
import { Font } from "opentype.js";

export interface LayoutLine {
  textRuns: { textRun: TextRun; font: Font | undefined }[];
  width: number;
  maxAscender: number;
  maxDescender: number;
}

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

  async layoutParagraph(paragraph: Paragraph): Promise<LayoutLine[]> {
    const maxWidth =
      this.canvasWidth - (this.padding.left + this.padding.right);
    const textRuns = paragraph.text.textRuns;
    const lineHeight = paragraph.paragraphStyle?.lineHeight || 1.2;

    // Utiliser getFormattedFont pour centraliser la gestion des polices
    const fontPromises = textRuns.map((run) =>
      this.fontManager.getFormattedFont(run.style)
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
      const fontSize = run.style.fontSize || defaultStyles.paragraph.fontSize;
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

  async layoutListItem(
    item: ListItem,
    list: List,
    index: number
  ): Promise<LayoutLine[]> {
    const maxWidth = this.canvasWidth - this.padding.left - this.padding.right;
    const lineHeight = list.listStyle?.lineHeight || 1;

    const numberText = `${index + 1}. `;
    const numberRun = new TextRun({
      text: numberText,
      style: defaultStyles.list,
    });
    const numberFont = await this.fontManager.getFormattedFont(numberRun.style);
    const numberFontSize =
      numberRun.style.fontSize || defaultStyles.list.fontSize;
    const numberWidth = numberFont
      ? numberFont.getAdvanceWidth(numberText, numberFontSize)
      : 0;

    const textRuns = item.text.textRuns;
    const fontPromises = textRuns.map((run) =>
      this.fontManager.getFormattedFont(run.style)
    );
    const fonts = await Promise.all(fontPromises);

    let lines: LayoutLine[] = [];
    let currentLine: LayoutLine = {
      textRuns: [],
      width: numberWidth,
      maxAscender: 0,
      maxDescender: 0,
    };

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

        let wordWidth = font ? font.getAdvanceWidth(word, fontSize) : 0;
        let spaceWidth =
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
}
