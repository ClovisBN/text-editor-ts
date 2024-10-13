export class CaretRenderer {
  private context: CanvasRenderingContext2D;
  private caretVisible: boolean;
  private caretBlinkInterval: any;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.caretVisible = true;
  }

  startBlinking(x: number, y: number, height: number) {
    this.stopBlinking(); // S'assure qu'il n'y a pas plusieurs intervalles actifs
    this.caretBlinkInterval = setInterval(() => {
      this.caretVisible = !this.caretVisible;
      this.renderCaret(x, y, height);
    }, 500); // Alterne la visibilité toutes les 500ms
  }

  stopBlinking() {
    if (this.caretBlinkInterval) {
      clearInterval(this.caretBlinkInterval);
      this.caretBlinkInterval = null;
      this.caretVisible = false;
    }
  }

  renderCaret(x: number, y: number, height: number) {
    this.context.clearRect(x, y, 2, height); // Efface l'ancien caret

    if (this.caretVisible) {
      this.context.fillStyle = "black";
      this.context.fillRect(x, y, 2, height); // Dessine un caret vertical de 2px
    }
  }
}
