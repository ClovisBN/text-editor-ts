import { FontManager } from "../FontManager";
import { ParagraphLayoutEngine } from "./ParagraphLayoutEngine";

export interface LayoutEngine {
  setCanvasWidth(width: number): void;
  setPadding(padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }): void;
}

export class LayoutEngineFactory {
  static createEngine(
    type: "paragraph",
    fontManager: FontManager,
    canvasWidth: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ): LayoutEngine {
    switch (type) {
      case "paragraph":
        return new ParagraphLayoutEngine(fontManager, canvasWidth, padding);
      default:
        throw new Error(`Unknown layout engine type: ${type}`);
    }
  }
}
