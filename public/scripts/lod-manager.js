export class LODManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.qualityLevels = {
            high: 1.0,
            medium: 0.7,
            low: 0.4
        };
        this.currentQuality = 'high';
        this.zoomLevel = 1.0;
    }

    update() {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const memLimit = performance.memory?.jsHeapSizeLimit || 0;
        
        if(isMobile) {
            this.currentQuality = memLimit > 1e9 ? 'medium' : 'low';
        }
        
        const scale = this.zoomLevel * this.qualityLevels[this.currentQuality];
        this.canvas.width = this.canvas.offsetWidth * scale;
        this.canvas.height = this.canvas.offsetHeight * scale;
    }

    setZoom(scale) {
        this.zoomLevel = Math.min(Math.max(scale, 0.5), 3.0);
        this.update();
    }
}
