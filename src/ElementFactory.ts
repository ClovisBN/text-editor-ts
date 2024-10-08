// src/ElementFactory.ts

import { Paragraph, List } from "./DocumentStructure";

export class ElementFactory {
  static createElement(data: any): Paragraph | List {
    switch (data.type) {
      case "paragraph":
        return new Paragraph(data);
      case "list":
        return new List(data);
      // Ajouter d'autres types si nécessaire
      default:
        throw new Error(`Unknown element type: ${data.type}`);
    }
  }
}
