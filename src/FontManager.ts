import opentype, { Font, Path } from "opentype.js";
import { FontStyle } from "./utils/fontUtils";
import { styleDataset } from "./StyleDefaults"; // Import des styles par défaut

type GlyphCache = { [char: string]: Path };

export class FontManager {
  private fonts: { [key: string]: Font } = {};
  private fontPaths: { [key: string]: { [style: string]: string } } = {
    RobotoMono: {
      Regular: "/assets/fonts/RobotoMono-Regular.ttf",
      Bold: "/assets/fonts/RobotoMono-Bold.ttf",
      Italic: "/assets/fonts/RobotoMono-Italic.ttf",
      BoldItalic: "/assets/fonts/RobotoMono-BoldItalic.ttf",
    },
    // Ajoutez d'autres familles de polices si nécessaire
  };
  private glyphCache: { [fontKey: string]: GlyphCache } = {}; // Cache des glyphes

  // Charge toutes les polices définies dans fontPaths
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

  private loadFont(url: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      opentype.load(url, (err, font) => {
        if (err || !font) {
          reject(new Error(`Erreur lors du chargement de la police : ${key}`));
        } else {
          this.fonts[key] = font;
          resolve();
        }
      });
    });
  }

  // Nouvelle méthode pour centraliser et appliquer les styles de police
  async getFormattedFont(style: FontStyle = {}): Promise<Font | undefined> {
    const appliedStyle = { ...styleDataset.textRun, ...style }; // Utiliser le style par défaut si absent
    const fontFamily = appliedStyle.fontFamily || "RobotoMono";
    const fontStyleKey = this.getFontStyleKey(appliedStyle); // Utiliser une méthode privée pour obtenir le style de police
    const fontKey = `${fontFamily}-${fontStyleKey}`;

    // Vérifier si la police est déjà chargée
    if (this.fonts[fontKey]) {
      return this.fonts[fontKey];
    }

    // Si non trouvée, charger la police
    await this.loadFonts();

    // Vérifier à nouveau après chargement
    return this.fonts[fontKey];
  }

  // Méthode privée pour déterminer le style de la police (Regular, Bold, Italic, etc.)
  private getFontStyleKey(style: FontStyle): string {
    if (style.bold && style.italic) return "BoldItalic";
    if (style.bold) return "Bold";
    if (style.italic) return "Italic";
    return "Regular";
  }

  getGlyphPath(char: string, font: Font, fontSize: number): Path | null {
    const fontKey = font.familyName;

    if (!this.glyphCache[fontKey]) {
      this.glyphCache[fontKey] = {};
    }

    const glyphCache = this.glyphCache[fontKey];

    if (glyphCache[char]) {
      return glyphCache[char];
    }

    const glyph = font.charToGlyph(char);
    if (!glyph) return null;

    const path = glyph.getPath(0, 0, fontSize);
    glyphCache[char] = path;

    if (Object.keys(glyphCache).length > 1000) {
      delete glyphCache[Object.keys(glyphCache)[0]];
    }

    return path;
  }
}
