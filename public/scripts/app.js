import { LayerManager } from './layers.js';
import { QuadTree } from './optimization/quad-tree.js';
import { LODManager } from './optimization/lod-manager.js';

class GraphicEditor {
  constructor() {
    this.canvas = document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.currentTool = 'pencil';
    this.brushSize = 5;
    this.brushColor = '#000000';
    this.blendMode = 'source-over';
    
    // Инициализация систем
    this.layerManager = new LayerManager();
    this.quadTree = new QuadTree({
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height
    }, 4);
    
    this.lodManager = new LODManager(this.canvas);
    this.worker = new Worker('scripts/workers/image-processor.js');
    
    this.initEventListeners();
    this.setupTools();
    this.setupUIHandlers();
  }

  initEventListeners() {
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
    this.canvas.addEventListener('mouseout', () => this.isDrawing = false);
    window.addEventListener('resize', () => this.lodManager.update());
  }

  setupTools() {
    document.getElementById('pencil').addEventListener('click', () => this.setTool('pencil'));
    document.getElementById('brush').addEventListener('click', () => this.setTool('brush'));
    document.getElementById('eraser').addEventListener('click', () => this.setTool('eraser'));
    document.getElementById('newLayer').addEventListener('click', () => this.createNewLayer());
    document.getElementById('mergeLayers').addEventListener('click', () => this.mergeVisibleLayers());
  }

  setupUIHandlers() {
    document.getElementById('brushSize').addEventListener('input', (e) => {
      this.brushSize = parseInt(e.target.value);
      this.ctx.lineWidth = this.brushSize;
    });
    
    document.getElementById('brushColor').addEventListener('input', (e) => {
      this.brushColor = e.target.value;
      this.ctx.strokeStyle = this.brushColor;
    });
    
    document.getElementById('blendMode').addEventListener('change', (e) => {
      this.blendMode = e.target.value;
      this.ctx.globalCompositeOperation = this.blendMode;
    });
  }

  setTool(tool) {
    this.currentTool = tool;
    this.ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : this.blendMode;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : this.brushColor;
  }

  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    [this.lastX, this.lastY] = [e.clientX - rect.left, e.clientY - rect.top];
    
    // Начало новой записи в QuadTree
    this.quadTree.insert({
      x: this.lastX,
      y: this.lastY,
      width: this.ctx.lineWidth,
      height: this.ctx.lineWidth
    });
  }

  draw(e) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    // Обновление QuadTree
    this.quadTree.insert({
      x: x,
      y: y,
      width: this.ctx.lineWidth,
      height: this.ctx.lineWidth
    });

    [this.lastX, this.lastY] = [x, y];
    
    // Оптимизация рендеринга
    this.lodManager.update();
  }

  createNewLayer() {
    this.layerManager.createLayer();
    this.layerManager.cacheCurrentLayer();
    this.updateLayerPreview();
  }

  mergeVisibleLayers() {
    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = this.canvas.width;
    mergedCanvas.height = this.canvas.height;
    const mergedCtx = mergedCanvas.getContext('2d');

    this.layerManager.layers.forEach(layer => {
      if (layer.visible) {
        mergedCtx.drawImage(layer.canvas, 0, 0);
      }
    });

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(mergedCanvas, 0, 0);
    this.layerManager.layers = [{
      canvas: mergedCanvas,
      ctx: mergedCtx,
      visible: true
    }];
  }

  updateLayerPreview() {
    const layersPanel = document.getElementById('layersList');
    layersPanel.innerHTML = '';
    
    this.layerManager.layers.forEach((layer, index) => {
      const layerElement = document.createElement('div');
      layerElement.className = 'layer-item';
      layerElement.innerHTML = `
        <input type="checkbox" ${layer.visible ? 'checked' : ''}>
        <span>Слой ${index + 1}</span>
        <button class="delete-layer">×</button>
      `;
      
      layerElement.querySelector('input').addEventListener('change', (e) => {
        layer.visible = e.target.checked;
      });
      
      layerElement.querySelector('.delete-layer').addEventListener('click', () => {
        this.layerManager.layers.splice(index, 1);
        this.updateLayerPreview();
      });
      
      layersPanel.appendChild(layerElement);
    });
  }

  processWithWorker(operation) {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.worker.postMessage({
      data: imageData.data.buffer,
      operation: operation
    }, [imageData.data.buffer]);

    this.worker.onmessage = (e) => {
      const processed = new ImageData(new Uint8ClampedArray(e.data), this.canvas.width);
      this.ctx.putImageData(processed, 0, 0);
      this.layerManager.cacheCurrentLayer();
    };
  }
}

// Инициализация приложения
window.addEventListener('load', () => {
  const editor = new GraphicEditor();
  
  // Глобальный экспорт для отладки
  window.editor = editor;
});
