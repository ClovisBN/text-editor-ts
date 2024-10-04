import { Document, Paragraph, List } from "./Document";
import { TextLayoutEngine } from "./TextLayoutEngine";
import { TextRenderer } from "./TextRenderer";
import { FontManager } from "./FontManager";
import { DimensionManager } from "./utils/DimensionManager"; // Importer DimensionManager

export class CanvasRenderer {
  private context: CanvasRenderingContext2D;
  private fontManager: FontManager;
  private layoutEngine: TextLayoutEngine;
  private textRenderer: TextRenderer;
  private showGrid: boolean = false;
  private canvasWidth: number;
  private canvasHeight: number;
  private padding: { top: number; right: number; bottom: number; left: number };

  constructor(
    context: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    padding: { top: number; right: number; bottom: number; left: number }
  ) {
    this.context = context;
    this.fontManager = new FontManager();
    this.layoutEngine = new TextLayoutEngine(
      this.fontManager,
      canvasWidth,
      padding
    );
    this.textRenderer = new TextRenderer(
      this.context,
      this.fontManager,
      this.showGrid
    );
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.padding = padding;
  }

  setShowGrid(showGrid: boolean) {
    this.showGrid = showGrid;
  }

  async renderDocument(document: Document): Promise<void> {
    await this.fontManager.loadFonts();
    let y = this.padding.top;

    for (const element of document.elements) {
      if (element instanceof Paragraph) {
        y = await this.renderParagraph(element, y);
      } else if (element instanceof List) {
        y = await this.renderList(element, y);
      }
    }
  }

  private async renderParagraph(
    paragraph: Paragraph,
    y: number
  ): Promise<number> {
    const lines = await this.layoutEngine.layoutParagraph(paragraph);

    this.context.strokeStyle = "red";
    this.context.lineWidth = 1;

    for (const line of lines) {
      let x = this.padding.left;
      const { textRuns, maxAscender, maxDescender } = line;
      const baselineY = y + maxAscender;

      const lineHeight = maxAscender + maxDescender;
      const lineWidth =
        this.canvasWidth - this.padding.left - this.padding.right;

      this.context.strokeRect(x, y, lineWidth, lineHeight);

      for (const runInfo of textRuns) {
        const { textRun, font } = runInfo;
        x = await this.textRenderer.renderTextRun(textRun, x, baselineY, font);
      }

      y += maxAscender + maxDescender;
    }
    return y;
  }

  private async renderList(list: List, y: number): Promise<number> {
    for (const [index, item] of list.items.entries()) {
      const lines = await this.layoutEngine.layoutListItem(item, list, index);
      for (const line of lines) {
        let x = this.padding.left;
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
