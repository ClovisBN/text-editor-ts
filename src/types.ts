export interface DocumentText {
  id: string;
  title: string;
  content: {
    elements: (ParagraphElement | ListElement)[];
  };
}

export interface ParagraphElement {
  type: "paragraph";
  paragraphStyle?: {
    heading?: string;
    lineHeight?: number; // Ajout de lineHeight pour le style d'interligne
  };
  text: {
    textRuns: TextRunElement[];
  };
}

export interface ListElement {
  type: "list";
  listStyle: {
    ordered: boolean;
    lineHeight?: number; // Ajout de lineHeight pour le style d'interligne
  };
  items: ListItemElement[];
}

export interface ListItemElement {
  type: "listItem";
  text: {
    textRuns: TextRunElement[];
  };
}

export interface TextRunElement {
  text: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    fontSize?: number;
    color?: string;
    fontFamily?: string;
  };
}
