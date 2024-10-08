import { Paragraph, List, ListItem, TextRun } from "../DocumentStructure"; // Import de ListItem
import { Font } from "opentype.js"; // Import de Font depuis opentype.js
import { ParagraphLayoutEngine } from "./ParagraphLayoutEngine";
import { ListLayoutEngine } from "./ListLayoutEngine";

export interface LayoutLine {
  textRuns: { textRun: TextRun; font: Font | undefined }[];
  width: number;
  maxAscender: number;
  maxDescender: number;
}

export class TypesLayoutEngine {
  private paragraphLayoutEngine?: ParagraphLayoutEngine;
  private listLayoutEngine?: ListLayoutEngine;
  private canvasWidth: number;
  private padding: { top: number; right: number; bottom: number; left: number };

  constructor(
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number },
    paragraphLayoutEngine?: ParagraphLayoutEngine, // Optionnel pour ParagraphRenderer
    listLayoutEngine?: ListLayoutEngine // Optionnel pour ListRenderer
  ) {
    this.canvasWidth = canvasWidth;
    this.padding = padding;
    this.paragraphLayoutEngine = paragraphLayoutEngine;
    this.listLayoutEngine = listLayoutEngine;
  }

  // Ajustement des méthodes pour utiliser les layout engines si présents
  setCanvasWidth(width: number): void {
    this.canvasWidth = width;
    if (this.paragraphLayoutEngine) {
      this.paragraphLayoutEngine.setCanvasWidth(width);
    }
    if (this.listLayoutEngine) {
      this.listLayoutEngine.setCanvasWidth(width);
    }
  }

  setPadding(padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }): void {
    this.padding = padding;
    if (this.paragraphLayoutEngine) {
      this.paragraphLayoutEngine.setPadding(padding);
    }
    if (this.listLayoutEngine) {
      this.listLayoutEngine.setPadding(padding);
    }
  }

  async layoutParagraph(paragraph: Paragraph) {
    if (!this.paragraphLayoutEngine) {
      throw new Error("ParagraphLayoutEngine is not initialized");
    }
    return this.paragraphLayoutEngine.layoutParagraph(paragraph);
  }

  async layoutListItem(item: ListItem, index: number) {
    if (!this.listLayoutEngine) {
      throw new Error("ListLayoutEngine is not initialized");
    }
    return this.listLayoutEngine.layoutListItem(item, index);
  }
}
