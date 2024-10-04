import { Paragraph, List, ListItem, TextRun } from "./Document"; // Import de ListItem
import { Font } from "opentype.js"; // Import de Font depuis opentype.js
import { ParagraphLayoutEngine } from "./ParagraphLayoutEngine";
import { ListLayoutEngine } from "./ListLayoutEngine";

export interface LayoutLine {
  textRuns: { textRun: TextRun; font: Font | undefined }[];
  width: number;
  maxAscender: number;
  maxDescender: number;
}

export class TextLayoutEngine {
  private paragraphLayoutEngine: ParagraphLayoutEngine;
  private listLayoutEngine: ListLayoutEngine;
  private canvasWidth: number;
  private padding: { top: number; right: number; bottom: number; left: number };

  constructor(
    paragraphLayoutEngine: ParagraphLayoutEngine,
    listLayoutEngine: ListLayoutEngine,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    this.paragraphLayoutEngine = paragraphLayoutEngine;
    this.listLayoutEngine = listLayoutEngine;
    this.canvasWidth = canvasWidth;
    this.padding = padding;
  }

  setCanvasWidth(width: number): void {
    this.canvasWidth = width;
    this.paragraphLayoutEngine.setCanvasWidth(width);
    this.listLayoutEngine.setCanvasWidth(width);
  }

  setPadding(padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }): void {
    this.padding = padding;
    this.paragraphLayoutEngine.setPadding(padding);
    this.listLayoutEngine.setPadding(padding);
  }

  async layoutParagraph(paragraph: Paragraph) {
    return this.paragraphLayoutEngine.layoutParagraph(paragraph);
  }

  // Utilisation correcte de layoutListItem pour un ListItem
  async layoutListItem(item: ListItem, index: number) {
    return this.listLayoutEngine.layoutListItem(item, index);
  }
}
