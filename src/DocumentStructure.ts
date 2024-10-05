import {
  DocumentText,
  ParagraphElement,
  ListElement,
  ListItemElement,
  TextRunElement,
} from "./types";

export class Document {
  elements: (Paragraph | List)[];

  constructor(data: DocumentText) {
    this.elements = data.content.elements.map((element) => {
      if (element.type === "paragraph") {
        return new Paragraph(element);
      } else if (element.type === "list") {
        return new List(element);
      }
      throw new Error("Unknown element type");
    });
  }
}

export class Paragraph {
  text: TextContent;
  paragraphStyle?: { heading?: string; lineHeight?: number }; // Ajout de paragraphStyle

  constructor(data: ParagraphElement) {
    this.text = new TextContent(data.text);
    this.paragraphStyle = data.paragraphStyle; // Assigner le style de paragraphe
  }
}

export class List {
  items: ListItem[];
  listStyle: { ordered: boolean; lineHeight?: number }; // Ajout de listStyle

  constructor(data: ListElement) {
    this.items = data.items.map((item) => new ListItem(item));
    this.listStyle = data.listStyle; // Assigner le style de liste
  }
}

export class ListItem {
  text: TextContent;

  constructor(data: ListItemElement) {
    this.text = new TextContent(data.text);
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
