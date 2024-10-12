import { DocumentText, ParagraphElement, TextRunElement } from "./types";

export class Document {
  elements: Paragraph[];

  constructor(data: DocumentText) {
    this.elements = data.content.elements.map((element) => {
      return new Paragraph(element); // Modification pour prendre en compte Paragraph uniquement
    });
  }
}

export class Paragraph {
  text: TextContent;
  paragraphStyle?: { heading?: string; lineHeight?: number };
  bullet?: { listId: string; nestingLevel: number }; // Ajout de la propriété bullet

  constructor(data: ParagraphElement) {
    this.text = new TextContent(data.text);
    this.paragraphStyle = data.paragraphStyle;
    this.bullet = data.bullet; // Assurez-vous que la propriété bullet est assignée correctement
  }
}

export class TextContent {
  textRuns: TextRun[];

  constructor(data: { textRuns: TextRunElement[] }) {
    this.textRuns = data.textRuns.map((run) => new TextRun(run));
  }
}

export class TextRun {
  text: string;
  style: { [key: string]: any };

  constructor(data: TextRunElement) {
    this.text = data.text;
    this.style = data.style || {};
  }
}
