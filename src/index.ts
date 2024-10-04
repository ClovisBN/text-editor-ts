import "./CanvasEditorElement"; // Assure l'importation du Custom Element
import { CanvasRenderer } from "./CanvasRenderer";
import { Document } from "./Document";
import { documentText } from "./documentData";
import { FontManager } from "./FontManager";
import { DimensionManager } from "./utils/DimensionManager"; // Importer DimensionManager

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(async () => {
    const canvasEditor = document.querySelector(
      "canvas-editor"
    ) as HTMLElement & { shadowRoot: ShadowRoot };

    if (canvasEditor && canvasEditor.shadowRoot) {
      const canvas = canvasEditor.shadowRoot.querySelector(
        "canvas"
      ) as HTMLCanvasElement;

      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          const { width, height } = DimensionManager.parseSize(
            canvasEditor.getAttribute("size") || "800 600"
          );
          const paddingValues = DimensionManager.parsePadding(
            canvasEditor.getAttribute("padding") || "0"
          );

          const fontManager = new FontManager();
          try {
            await fontManager.loadFonts();
            console.log("Toutes les polices ont été chargées.");

            const renderer = new CanvasRenderer(
              context,
              width,
              height,
              paddingValues
            );
            const doc = new Document(documentText);
            await renderer.renderDocument(doc);
          } catch (error) {
            console.error("Erreur lors du chargement des polices :", error);
          }
        } else {
          console.error("Impossible d'obtenir le contexte 2D du canvas.");
        }
      } else {
        console.error("Élément canvas introuvable dans <canvas-editor>.");
      }
    } else {
      console.error("Élément personnalisé <canvas-editor> introuvable.");
    }
  }, 0);
});
