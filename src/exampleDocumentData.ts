import { DocumentText } from "./types";

export const documentText: DocumentText = {
  id: "doc123",
  title: "Example Document",
  content: {
    elements: [
      {
        type: "paragraph",
        paragraphStyle: {
          heading: "HEADING_1",
        },
        text: {
          textRuns: [
            {
              text: "Main Title Wg",
              style: {
                bold: true,
                fontSize: 36,
                color: "green",
              },
            },
          ],
        },
      },
      {
        type: "paragraph",
        paragraphStyle: {
          lineHeight: 1,
        },
        text: {
          textRuns: [
            {
              text: "In the example below, This is a sample paragraph with ",
              style: {
                bold: false,
                italic: false,
                color: "black",
              },
            },
            {
              text: "bold text ",
              style: {
                bold: true,
                italic: false,
                color: "black",
              },
            },
            {
              text: "My first critique involves an interface that I came in contact with while working on an assignment for this ",
              style: {
                bold: false,
                italic: true,
                color: "black",
              },
            },
            {
              text: "and (TextWrangler on Mac) that may.",
              style: {
                bold: true,
                italic: false,
                color: "red",
              },
            },
          ],
        },
      },
      {
        type: "paragraph",
        paragraphStyle: {
          heading: "HEADING_2",
        },
        text: {
          textRuns: [
            {
              text: "Subheading",
              style: {
                bold: true,
                fontSize: 18,
                color: "red",
              },
            },
          ],
        },
      },
      {
        type: "paragraph",
        paragraphStyle: {
          lineHeight: 1,
        },
        text: {
          textRuns: [
            {
              text: "Second bullet point\n",
              style: {},
            },
          ],
        },
        bullet: {
          listId: "kix.abc123",
          nestingLevel: 0,
        },
      },
      {
        type: "paragraph",
        paragraphStyle: {
          lineHeight: 1,
        },
        text: {
          textRuns: [
            {
              text: "First bullet point\n",
              style: {},
            },
          ],
        },
        bullet: {
          listId: "kix.abc123",
          nestingLevel: 0,
        },
      },
      {
        type: "paragraph",
        paragraphStyle: {
          lineHeight: 1,
        },
        text: {
          textRuns: [
            {
              text: "In the example below, This is a sample paragraph with ",
              style: {
                bold: false,
                italic: false,
                color: "black",
              },
            },
            {
              text: "bold text",
              style: {
                bold: true,
                italic: false,
                color: "black",
              },
            },
            {
              text: "My first critique involves an interface that I came in contact with while working on an assignment for this ",
              style: {
                bold: false,
                italic: true,
                color: "black",
              },
            },
          ],
        },
      },
      {
        type: "paragraph",
        paragraphStyle: {
          lineHeight: 1,
        },
        text: {
          textRuns: [
            {
              text: "Second bullet point\n",
              style: {},
            },
          ],
        },
        bullet: {
          listId: "kix.abc123",
          nestingLevel: 0,
        },
      },
    ],
  },
};
