// src/CanvasEditorElement.ts
import { CanvasRenderer } from "./CanvasRenderer";
import { Document } from "./Document";
import { DocumentText } from "./types";
import { documentText as defaultDocumentData } from "./documentData";
import { parseSize, parsePadding } from "./utils/canvasUtils"; // Utilitaires pour gérer les tailles et le padding

export interface CanvasEditorOptions {
  size?: string;
  padding?: { top: number; right: number; bottom: number; left: number };
  documentData?: DocumentText;
}

export class CanvasEditorElement extends HTMLElement {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private renderer?: CanvasRenderer;
  private documentData: DocumentText;
  private observer: ResizeObserver;

  constructor() {
    super();
    this.documentData = defaultDocumentData;
    this.attachShadow({ mode: "open" });

    // Initialisation du canvas
    this.canvas = this.createCanvas();
    this.context = this.canvas.getContext("2d");

    // Observateur pour les changements de taille
    this.observer = new ResizeObserver(() => this.resizeCanvas());
  }

  connectedCallback() {
    this.initializeCanvas().then(() => {
      this.renderContent();
    });
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer.unobserve(this);
  }

  static get observedAttributes() {
    return ["size", "padding", "document-data"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === "document-data") {
        try {
          this.documentData = JSON.parse(newValue || "{}");
        } catch (error) {
          console.error("Invalid JSON format for document-data attribute.");
        }
      }
      this.initializeCanvas().then(() => {
        this.renderContent();
      });
    }
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    this.shadowRoot!.appendChild(canvas);
    return canvas;
  }

  private resizeCanvas() {
    const { width, height } = parseSize(this.getAttribute("size") || "800 600");
    const padding = this.getAttribute("padding") || "0";
    const paddingValues = parsePadding(padding);

    const scaleFactor = 4; // Facteur d'échelle pour la haute résolution
    const ratio = window.devicePixelRatio || 1;

    // Configuration de la résolution du canvas
    this.setupHighResolutionCanvas(width, height, scaleFactor * ratio);

    // Réglage du transform pour le ratio
    if (this.context) {
      this.context.setTransform(1, 0, 0, 1, 0, 0); // Reset
      this.context.scale(scaleFactor * ratio, scaleFactor * ratio); // Scale
      // Le padding est maintenant géré dans CanvasRenderer, donc pas besoin de translate ici
    }
  }

  // Méthode pour configurer la résolution et la taille d'affichage du canvas avec un facteur d'échelle
  private setupHighResolutionCanvas(
    width: number,
    height: number,
    resolution: number
  ) {
    // Taille d'affichage en CSS
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Taille réelle en pixels
    this.canvas.width = width * resolution;
    this.canvas.height = height * resolution;
  }

  private async initializeCanvas(): Promise<void> {
    await this.configureCanvas();
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private async configureCanvas(): Promise<void> {
    return new Promise((resolve) => {
      this.resizeCanvas();
      resolve();
    });
  }

  private renderContent() {
    if (this.documentData && this.context) {
      const { width, height } = parseSize(
        this.getAttribute("size") || "800 600"
      );
      const paddingValues = parsePadding(this.getAttribute("padding") || "0");

      // Création du renderer avec les nouveaux paramètres requis
      this.renderer = new CanvasRenderer(
        this.context,
        width,
        height,
        paddingValues
      );
      const doc = new Document(this.documentData);
      this.renderer.renderDocument(doc);
    }
  }

  // Méthode pour accéder au renderer depuis l'extérieur (par exemple, pour définir showGrid)
  public getRenderer(): CanvasRenderer | undefined {
    return this.renderer;
  }
}

customElements.define("canvas-editor", CanvasEditorElement);
