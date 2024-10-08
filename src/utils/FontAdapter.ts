import opentype, { Font, Path } from "opentype.js";

// Interface pour encapsuler l'utilisation de la bibliothèque de police
export interface IFontAdapter {
  loadFont(url: string): Promise<Font | undefined>;
  getAdvanceWidth(text: string, font: Font, fontSize: number): number;
  getPath(
    text: string,
    font: Font,
    fontSize: number,
    x: number,
    y: number
  ): Path;
  charToGlyph(char: string, font: Font): any;
}

// Implémentation avec opentype.js
export class OpenTypeFontAdapter implements IFontAdapter {
  async loadFont(url: string): Promise<Font | undefined> {
    return new Promise((resolve, reject) => {
      opentype.load(url, (err, font) => {
        if (err || !font) {
          reject(new Error(`Erreur lors du chargement de la police : ${url}`));
        } else {
          resolve(font);
        }
      });
    });
  }

  getAdvanceWidth(text: string, font: Font, fontSize: number): number {
    return font.getAdvanceWidth(text, fontSize);
  }

  getPath(
    text: string,
    font: Font,
    fontSize: number,
    x: number,
    y: number
  ): Path {
    return font.getPath(text, x, y, fontSize);
  }

  charToGlyph(char: string, font: Font): any {
    return font.charToGlyph(char);
  }
}

// Exporter également les types Font et Path pour les autres fichiers
export { Font, Path };
