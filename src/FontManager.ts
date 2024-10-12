import { StyleManager } from "./utils/StyleManager";
import { IFontAdapter, OpenTypeFontAdapter } from "./utils/FontAdapter";

export interface FontStyle {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  fontFamily?: string;
}

export class FontManager {
  private fonts: { [key: string]: any } = {};
  private fontPaths: { [key: string]: { [style: string]: string } } = {
    RobotoMono: {
      Regular: "/assets/fonts/RobotoMono-Regular.ttf",
      Bold: "/assets/fonts/RobotoMono-Bold.ttf",
      Italic: "/assets/fonts/RobotoMono-Italic.ttf",
      BoldItalic: "/assets/fonts/RobotoMono-BoldItalic.ttf",
    },
  };
  private fontAdapter: IFontAdapter;

  constructor() {
    this.fontAdapter = new OpenTypeFontAdapter();
  }

  async loadFonts(): Promise<void> {
    const fontPromises = [];

    for (const [fontFamily, styles] of Object.entries(this.fontPaths)) {
      for (const [style, filePath] of Object.entries(styles)) {
        fontPromises.push(this.loadFont(filePath, `${fontFamily}-${style}`));
      }
    }

    try {
      await Promise.all(fontPromises);
    } catch (error) {
      console.error("Erreur lors du chargement des polices :", error);
    }
  }

  private async loadFont(url: string, key: string): Promise<void> {
    const font = await this.fontAdapter.loadFont(url);
    if (font) {
      this.fonts[key] = font;
    }
  }

  async getFormattedFont(style: FontStyle = {}): Promise<any | undefined> {
    const defaultStyle = StyleManager.getTextRunStyle({});
    const appliedStyle = { ...defaultStyle, ...style };
    const fontFamily = appliedStyle.fontFamily || "RobotoMono";
    const fontStyleKey = this.getFontStyleKey(appliedStyle);
    const fontKey = `${fontFamily}-${fontStyleKey}`;

    if (this.fonts[fontKey]) {
      return this.fonts[fontKey];
    }

    await this.loadFonts();
    return this.fonts[fontKey];
  }

  private getFontStyleKey(style: FontStyle): string {
    if (style.bold && style.italic) return "BoldItalic";
    if (style.bold) return "Bold";
    if (style.italic) return "Italic";
    return "Regular";
  }
}
