// src/FontManager.ts

import opentype, { Font, Path } from "opentype.js";
import { FontStyle, generateFontKey } from "./utils/fontUtils";

type GlyphCache = { [char: string]: Path };

export class FontManager {
  private fonts: { [key: string]: Font } = {};
  private fontPaths: { [key: string]: { [style: string]: string } } = {
    RobotoMono: {
      Regular: "/assets/fonts/RobotoMono-Regular.ttf",
      Bold: "/assets/fonts/RobotoMono-Bold.ttf",
      Italic: "/assets/fonts/RobotoMono-Italic.ttf",
      BoldItalic: "/assets/fonts/RobotoMono-BoldItalic.ttf",
      Light: "/assets/fonts/RobotoMono-Light.ttf",
      LightItalic: "/assets/fonts/RobotoMono-LightItalic.ttf",
      Medium: "/assets/fonts/RobotoMono-Medium.ttf",
      MediumItalic: "/assets/fonts/RobotoMono-MediumItalic.ttf",
      SemiBold: "/assets/fonts/RobotoMono-SemiBold.ttf",
      SemiBoldItalic: "/assets/fonts/RobotoMono-SemiBoldItalic.ttf",
      Thin: "/assets/fonts/RobotoMono-Thin.ttf",
      ThinItalic: "/assets/fonts/RobotoMono-ThinItalic.ttf",
      ExtraLight: "/assets/fonts/RobotoMono-ExtraLight.ttf",
      ExtraLightItalic: "/assets/fonts/RobotoMono-ExtraLightItalic.ttf",
    },
    // Ajoutez d'autres familles de polices et styles si nécessaire
  };
  private glyphCache: {
    [fontKey: string]: GlyphCache;
  } = {}; // Cache des glyphes

  constructor() {
    // Initialise le gestionnaire de polices
  }

  // Charge toutes les polices définies dans fontPaths
  async loadFonts(): Promise<void> {
    const fontPromises = [];

    for (const [fontFamily, styles] of Object.entries(this.fontPaths)) {
      for (const [style, filePath] of Object.entries(styles)) {
        fontPromises.push(this.loadFont(filePath, `${fontFamily}-${style}`));
      }
    }

    try {
      // Attendre le chargement de toutes les polices
      await Promise.all(fontPromises);
      console.log("Toutes les polices ont été chargées avec succès.");
    } catch (error) {
      console.error("Erreur lors du chargement des polices :", error);
    }
  }

  // Charge une police spécifique à partir de son URL et la stocke avec une clé unique
  private loadFont(url: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      opentype.load(url, (err, font) => {
        if (err || !font) {
          reject(new Error(`Erreur lors du chargement de la police : ${key}`));
        } else {
          this.fonts[key] = font;
          console.log(`Police chargée : ${key}`);
          resolve();
        }
      });
    });
  }

  // Retourne la police correspondant aux styles demandés, ou undefined si non trouvée
  async getFont(style: FontStyle): Promise<Font | undefined> {
    const fontFamily = style.fontFamily || "RobotoMono";
    const fontStyleKey = this.getFontStyleKey(style);
    const fontKey = `${fontFamily}-${fontStyleKey}`;

    console.log(`Recherche de la police avec la clé : ${fontKey}`);

    return this.fonts[fontKey];
  }

  // Détermine la clé de style de la police (ex: Regular, Bold, Italic)
  private getFontStyleKey(style: FontStyle): string {
    let fontStyle = "Regular"; // Style par défaut
    if (style.bold && style.italic) fontStyle = "BoldItalic";
    else if (style.bold) fontStyle = "Bold";
    else if (style.italic) fontStyle = "Italic";
    else if (style.fontWeight) fontStyle = style.fontWeight; // Vérification directe pour la propriété fontWeight
    return fontStyle;
  }

  // Met en cache et retourne le chemin du glyphe pour un caractère donné, une police et une taille spécifiques
  getGlyphPath(char: string, font: Font, fontSize: number): Path | null {
    const fontKey = font.familyName;

    if (!this.glyphCache[fontKey]) {
      this.glyphCache[fontKey] = {};
    }

    const glyphCache = this.glyphCache[fontKey];

    if (glyphCache[char]) {
      return glyphCache[char];
    }

    // Calculer et mettre en cache le chemin du glyphe
    const glyph = font.charToGlyph(char);
    if (!glyph) return null;

    const path = glyph.getPath(0, 0, fontSize);
    glyphCache[char] = path;

    // Limiter la taille du cache pour éviter la surcharge mémoire
    if (Object.keys(glyphCache).length > 1000) {
      console.warn(
        `Cache de glyphes de ${fontKey} est plein. Suppression de glyphes.`
      );
      delete glyphCache[Object.keys(glyphCache)[0]];
    }

    return path;
  }
}
