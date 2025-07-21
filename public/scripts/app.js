class GraphicEditor {
  constructor() {
    this.canvas = document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.initCanvas();
    this.initEventListeners();
    this.layerManager = new LayerManager();
  }

  initCanvas() {
    this.canvas.width = 1000000;
    this.canvas.height = 1000000;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  initEventListeners() {
    // Обработчики инструментов
    document.getElementById('pencilTool').addEventListener('click', () => this.setTool('pencil'));
    document.getElementById('brushTool').addEventListener('click', () => this.setTool('brush'));
    document.getElementById('eraserTool').addEventListener('click', () => this.setTool('eraser'));
    
    // Обработчики холста
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
  }

  setTool(tool) {
    this.currentTool = tool;
    // Обновление UI
  }

  startDrawing(e) {
    this.isDrawing = true;
    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
  }

  draw(e) {
    if (!this.isDrawing) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
    
    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
  }
}

// Инициализация при загрузке
window.addEventListener('load', () => new GraphicEditor());
