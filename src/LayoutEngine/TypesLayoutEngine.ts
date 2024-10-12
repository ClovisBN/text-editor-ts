import { Paragraph } from "../DocumentStructure";
import { ParagraphLayoutEngine } from "./ParagraphLayoutEngine";

export interface LayoutLine {
  textRuns: { textRun: any; font: any | undefined }[];
  width: number;
  maxAscender: number;
  maxDescender: number;
}

export class TypesLayoutEngine {
  private paragraphLayoutEngine: ParagraphLayoutEngine; // Plus optionnel
  private canvasWidth: number;
  private padding: { top: number; right: number; bottom: number; left: number };

  constructor(
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number },
    paragraphLayoutEngine: ParagraphLayoutEngine // Plus optionnel, on force à l'initialisation
  ) {
    this.canvasWidth = canvasWidth;
    this.padding = padding;
    this.paragraphLayoutEngine = paragraphLayoutEngine; // Doit toujours être fourni
  }

  setCanvasWidth(width: number): void {
    this.canvasWidth = width;
    this.paragraphLayoutEngine.setCanvasWidth(width);
  }

  setPadding(padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }): void {
    this.padding = padding;
    this.paragraphLayoutEngine.setPadding(padding);
  }

  async layoutParagraph(paragraph: Paragraph) {
    return this.paragraphLayoutEngine.layoutParagraph(paragraph);
  }
}
