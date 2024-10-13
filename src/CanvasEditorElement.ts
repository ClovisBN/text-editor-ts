import { TypesRenderer } from "./Renderer/TypesRenderer";
import { Document } from "./DocumentStructure";
import { DocumentText } from "./types";
import { documentText as defaultDocumentData } from "./exampleDocumentData";
import { DimensionManager } from "./utils/DimensionManager"; // Importer DimensionManager

export interface CanvasEditorOptions {
  size?: string;
  padding?: { top: number; right: number; bottom: number; left: number };
  documentData?: DocumentText;
}

export class CanvasEditorElement extends HTMLElement {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private renderer?: TypesRenderer;
  private documentData: DocumentText;
  private observer: ResizeObserver;

  private size: { width: number; height: number } = { width: 800, height: 600 }; // Valeurs par défaut
  private padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }; // Valeurs par défaut

  constructor() {
    super();
    this.documentData = defaultDocumentData;
    this.attachShadow({ mode: "open" });

    // Initialisation du canvas
    this.canvas = this.createCanvas();
    this.context = this.canvas.getContext("2d");

    // Initialiser les attributs
    this.initializeAttributes();

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
      this.initializeAttributes();
      this.initializeCanvas().then(() => {
        this.renderContent();
      });
    }
  }

  // Nouvelle méthode pour initialiser et gérer les attributs HTML
  private initializeAttributes() {
    // Initialiser la taille à partir de l'attribut 'size' ou utiliser la taille par défaut
    const sizeAttribute = this.getAttribute("size") || "800 600";
    this.size = DimensionManager.parseSize(sizeAttribute);

    // Initialiser le padding à partir de l'attribut 'padding' ou utiliser le padding par défaut
    const paddingAttribute = this.getAttribute("padding") || "0";
    this.padding = DimensionManager.parsePadding(paddingAttribute);

    // Initialiser les données du document à partir de l'attribut 'document-data'
    const documentDataAttribute = this.getAttribute("document-data");
    if (documentDataAttribute) {
      try {
        this.documentData = JSON.parse(documentDataAttribute);
      } catch (error) {
        console.error("Invalid JSON format for document-data attribute.");
        this.documentData = defaultDocumentData;
      }
    } else {
      this.documentData = defaultDocumentData;
    }
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    this.shadowRoot!.appendChild(canvas);
    return canvas;
  }

  private resizeCanvas() {
    const { width, height } = this.size || { width: 800, height: 600 }; // Gérer le cas où size est undefined
    const paddingValues = this.padding || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }; // Gérer le cas où padding est undefined

    const scaleFactor = 3;
    const ratio = window.devicePixelRatio || 1;

    this.setupHighResolutionCanvas(width, height, scaleFactor * ratio);

    if (this.context) {
      this.context.setTransform(1, 0, 0, 1, 0, 0); // Reset
      this.context.scale(scaleFactor * ratio, scaleFactor * ratio); // Scale
    }
  }

  private setupHighResolutionCanvas(
    width: number,
    height: number,
    resolution: number
  ) {
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

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
      const { width, height } = this.size;
      const paddingValues = this.padding;

      this.renderer = new TypesRenderer(
        this.context,
        width,
        height,
        paddingValues
      );
      const doc = new Document(this.documentData);
      this.renderer.renderDocument(doc);
    }
  }

  public getRenderer(): TypesRenderer | undefined {
    return this.renderer;
  }
}

customElements.define("canvas-editor", CanvasEditorElement);
