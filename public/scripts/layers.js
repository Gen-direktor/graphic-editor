class LayerManager {
  constructor() {
    this.layers = [];
    this.currentLayerIndex = 0;
  }

  createLayer(name = `Слой ${this.layers.length + 1}`) {
    const layer = {
      name,
      canvas: document.createElement('canvas'),
      ctx: null,
      visible: true
    };
    layer.canvas.width = 1024;
    layer.canvas.height = 768;
    layer.ctx = layer.canvas.getContext('2d');
    this.layers.push(layer);
  }

  getCurrentLayer() {
    return this.layers[this.currentLayerIndex];
  }
}

export const layerManager = new LayerManager();
class LayerManager {
  constructor() {
    this.cache = new Map();
    this.historyStack = [];
  }

  cacheLayer(layer) {
    const key = `layer-${Date.now()}`;
    this.cache.set(key, {
      data: layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height),
      timestamp: Date.now()
    });
    return key;
  }

  restoreLayer(key) {
    if(this.cache.has(key)) {
      const { data } = this.cache.get(key);
      this.getCurrentLayer().ctx.putImageData(data, 0, 0);
    }
  }
}