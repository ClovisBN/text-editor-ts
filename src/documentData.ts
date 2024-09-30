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
              text: "Main Title fg WA",
              style: {
                bold: true,
                fontSize: 34,
                color: "black",
              },
            },
          ],
        },
      },
      {
        type: "paragraph",
        paragraphStyle: {
          lineHeight: 1.2,
        }, // Un objet de style vide même s'il n'y a pas de styles spécifiques
        text: {
          textRuns: [
            {
              text: "This is a sample paragraph with ",
              style: {
                bold: false,
                italic: false,
                fontSize: 16,
                color: "black",
              },
            },
            {
              text: "bold text",
              style: {
                bold: true,
                italic: false,
                fontSize: 16,
                color: "black",
              },
            },
            {
              text: " and ",
              style: {
                bold: false,
                italic: false,
                fontSize: 16,
                color: "black",
              },
            },
            {
              text: "italic text ",
              style: {
                bold: true,
                italic: true,
                fontSize: 16,
                color: "black",
              },
            },
            {
              text: "in the same paragraph.",
              style: {
                bold: false,
                italic: false,
                fontSize: 16,
                color: "black",
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
                color: "black",
              },
            },
          ],
        },
      },
      {
        type: "list",
        listStyle: {
          ordered: false,
        },
        items: [
          {
            type: "listItem",
            text: {
              textRuns: [
                {
                  text: "First item",
                  style: {}, // Un objet de style vide pour chaque textRun
                },
              ],
            },
          },
          {
            type: "listItem",
            text: {
              textRuns: [
                {
                  text: "Second item",
                  style: {},
                },
              ],
            },
          },
          {
            type: "listItem",
            text: {
              textRuns: [
                {
                  text: "Third item",
                  style: {},
                },
              ],
            },
          },
          {
            type: "listItem",
            text: {
              textRuns: [
                {
                  text: "Fourth item",
                  style: {},
                },
              ],
            },
          },
          {
            type: "listItem",
            text: {
              textRuns: [
                {
                  text: "Fifth item",
                  style: {},
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
