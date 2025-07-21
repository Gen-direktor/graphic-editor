class LayerManager {
  constructor() {
    this.layers = [];
    this.currentLayerIndex = 0;
    this.initBaseLayer();
  }

  initBaseLayer() {
    this.addLayer('Фон');
  }

  addLayer(name = `Слой ${this.layers.length + 1}`) {
    const layer = {
      name,
      canvas: document.createElement('canvas'),
      visible: true,
      opacity: 1
    };
    
    layer.canvas.width = 1000000;
    layer.canvas.height = 1000000;
    this.layers.push(layer);
    this.updateLayersUI();
  }

  updateLayersUI() {
    const layersList = document.getElementById('layersList');
    layersList.innerHTML = this.layers.map((layer, index) => `
      <div class="layer-item">
        <input type="checkbox" ${layer.visible ? 'checked' : ''}>
        <span>${layer.name}</span>
        <input type="range" min="0" max="1" step="0.1" value="${layer.opacity}">
      </div>
    `).join('');
  }
}
