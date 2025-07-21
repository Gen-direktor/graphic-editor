class GraphicEditor {
  constructor() {
    this.canvas = document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.currentTool = 'pencil';
    
    this.initEventListeners();
    this.setupTools();
  }

  initEventListeners() {
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
    this.canvas.addEventListener('mouseout', () => this.isDrawing = false);
  }

  setupTools() {
    document.getElementById('pencil').addEventListener('click', () => this.setTool('pencil'));
    document.getElementById('brush').addEventListener('click', () => this.setTool('brush'));
    document.getElementById('eraser').addEventListener('click', () => this.setTool('eraser'));
  }

  setTool(tool) {
    this.currentTool = tool;
    this.ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    this.ctx.lineWidth = tool === 'brush' ? 10 : 5;
  }

  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    [this.lastX, this.lastY] = [e.clientX - rect.left, e.clientY - rect.top];
  }

  draw(e) {
    if (!this.isDrawing) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = this.currentTool === 'eraser' ? 'rgba(0,0,0,1)' : '#000';
    this.ctx.stroke();

    [this.lastX, this.lastY] = [x, y];
  }
}

window.addEventListener('load', () => new GraphicEditor());
