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
