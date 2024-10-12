// src/ElementFactory.ts

import { Paragraph } from "./DocumentStructure";

export class ElementFactory {
  static createElement(data: any): Paragraph {
    switch (data.type) {
      case "paragraph":
        return new Paragraph(data);

      // Ajouter d'autres types si nécessaire
      default:
        throw new Error(`Unknown element type: ${data.type}`);
    }
  }
}
