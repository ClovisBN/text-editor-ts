declare module "opentype.js" {
  export interface Glyph {
    index: number;
    name: string;
    unicode: number;
    unicodes: number[];
    path: Path;
    advanceWidth: number;
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    draw: (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      fontSize: number
    ) => void;
    getPath: (x: number, y: number, fontSize: number) => Path;
  }

  export interface Font {
    familyName: string;
    styleName: string;
    unitsPerEm: number;
    ascender: number;
    descender: number;
    numGlyphs: number;
    glyphs: {
      glyphs: Glyph[];
      get: (index: number) => Glyph;
    };
    getPath: (
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options?: any
    ) => Path;
    draw: (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options?: any
    ) => void;
    charToGlyph: (char: string) => Glyph;
    stringToGlyphs: (text: string) => Glyph[];
    getAdvanceWidth: (text: string, fontSize: number, options?: any) => number; // Ajout de la méthode getAdvanceWidth
  }

  export interface Path {
    commands: any[];
    fill: string;
    draw: (ctx: CanvasRenderingContext2D) => void;
    getBoundingBox: () => {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
  }

  export function load(
    url: string,
    callback: (err: any, font: Font) => void
  ): void;
  export function loadSync(url: string): Font;
}
