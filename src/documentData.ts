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
        }, // Un objet de style vide même s'il n'y a pas de styles spécifiques
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
              text: " and ",
              style: {
                bold: false,
                italic: false,
                color: "black",
              },
            },
            {
              text: "italic text ",
              style: {
                bold: true,
                italic: true,
                color: "black",
              },
            },
            {
              text: "in the same paragraph. accepts an object where we can change the",
              style: {
                bold: false,
                italic: false,
                color: "black",
              },
            },
            {
              text: " accepts an object where we can change the",
              style: {
                bold: false,
                italic: false,
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
