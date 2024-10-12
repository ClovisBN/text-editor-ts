export interface DocumentText {
  id: string;
  title: string;
  content: {
    elements: ParagraphElement[];
  };
}

export interface ParagraphElement {
  type: "paragraph";
  paragraphStyle?: {
    heading?: string;
    lineHeight?: number;
  };
  text: {
    textRuns: TextRunElement[];
  };
  bullet?: {
    listId: string;
    nestingLevel: number;
  }; // Ajout de la propriété bullet ici
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
