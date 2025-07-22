export class LayerManager {
    constructor(canvas) {
        this.layers = [];
        this.currentLayerIndex = 0;
        this.cache = new Map();
        
        this.initBaseLayer(canvas);
    }

    initBaseLayer(canvas) {
        this.layers.push({
            canvas: canvas,
            ctx: canvas.getContext('2d'),
            visible: true,
            locked: false
        });
    }

    createLayer() {
        const newCanvas = document.createElement('canvas');
        newCanvas.width = this.layers[0].canvas.width;
        newCanvas.height = this.layers[0].canvas.height;
        
        this.layers.push({
            canvas: newCanvas,
            ctx: newCanvas.getContext('2d'),
            visible: true,
            locked: false
        });
    }

    cacheCurrentLayer() {
        const layer = this.getCurrentLayer();
        const imageData = layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
        this.cache.set(Date.now(), imageData);
    }

    getCurrentLayer() {
        return this.layers[this.currentLayerIndex];
    }
}