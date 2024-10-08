// src/DocumentStructure.ts

import {
  DocumentText,
  ParagraphElement,
  ListElement,
  ListItemElement,
  TextRunElement,
} from "./types";
import { ElementFactory } from "./ElementFactory";

export class Document {
  elements: (Paragraph | List)[];

  constructor(data: DocumentText) {
    this.elements = data.content.elements.map((element) => {
      return ElementFactory.createElement(element);
    });
  }
}

export class Paragraph {
  text: TextContent;
  paragraphStyle?: { heading?: string; lineHeight?: number };

  constructor(data: ParagraphElement) {
    this.text = new TextContent(data.text);
    this.paragraphStyle = data.paragraphStyle;
  }
}

export class List {
  items: ListItem[];
  listStyle: { ordered: boolean; lineHeight?: number };

  constructor(data: ListElement) {
    this.items = data.items.map((item) => new ListItem(item));
    this.listStyle = data.listStyle;
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
