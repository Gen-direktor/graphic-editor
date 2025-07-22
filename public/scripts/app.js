import { LayerManager } from './layers.js';
import { QuadTree } from './optimization/quad-tree.js';
import { LODManager } from './optimization/lod-manager.js';

class GraphicEditor {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.initCanvasSize();
        
        // Состояние приложения
        this.isDrawing = false;
        this.currentTool = 'pencil';
        this.brushConfig = {
            size: 5,
            color: '#000000',
            opacity: 1.0,
            blendMode: 'source-over'
        };

        // Системы
        this.layerManager = new LayerManager(this.canvas);
        this.quadTree = new QuadTree(this.canvas.getBoundingClientRect());
        this.lodManager = new LODManager(this.canvas);
        this.worker = new Worker('./scripts/workers/image-processor.js');

        this.initEventHandlers();
        this.setupMobileUI();
    }

    initCanvasSize() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
    }

    initEventHandlers() {
        // Десктопные события
        this.canvas.addEventListener('mousedown', this.handleStart.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleEnd.bind(this));
        
        // Мобильные события
        this.canvas.addEventListener('touchstart', this.handleStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleEnd.bind(this));
        
        // UI элементы
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => this.setTool(btn.dataset.tool));
        });
        
        document.getElementById('brushSize').addEventListener('input', e => {
            this.brushConfig.size = e.target.value;
        });
    }

    setupMobileUI() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOptions = document.getElementById('mobileOptions');
        
        mobileMenu.addEventListener('click', () => {
            mobileOptions.style.display = mobileOptions.style.display === 'flex' ? 'none' : 'flex';
        });

        // Жест масштабирования
        let initialDistance = null;
        this.canvas.addEventListener('touchstart', e => {
            if(e.touches.length === 2) {
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        });

        this.canvas.addEventListener('touchmove', e => {
            if(e.touches.length === 2) {
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                
                if(initialDistance) {
                    const scale = currentDistance / initialDistance;
                    this.lodManager.setZoom(scale);
                }
            }
        });
    }

    handleStart(e) {
        e.preventDefault();
        this.isDrawing = true;
        const pos = this.getInputPosition(e);
        this.startNewStroke(pos);
        if(navigator.vibrate) navigator.vibrate(15);
    }

    handleMove(e) {
        if(!this.isDrawing) return;
        e.preventDefault();
        const pos = this.getInputPosition(e);
        this.drawStroke(pos);
    }

    handleEnd() {
        this.isDrawing = false;
        this.layerManager.cacheCurrentLayer();
    }

    getInputPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return {
            x: (clientX - rect.left) * window.devicePixelRatio,
            y: (clientY - rect.top) * window.devicePixelRatio
        };
    }

    startNewStroke(pos) {
        this.currentPath = new Path2D();
        this.currentPath.moveTo(pos.x, pos.y);
        this.quadTree.insert(pos);
    }

    drawStroke(pos) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        
        this.ctx.lineWidth = this.brushConfig.size;
        this.ctx.strokeStyle = this.brushConfig.color;
        this.ctx.globalAlpha = this.brushConfig.opacity;
        this.ctx.globalCompositeOperation = this.brushConfig.blendMode;
        
        this.ctx.stroke();
        
        this.quadTree.insert(pos);
        this.lodManager.update();
    }

    setTool(tool) {
        this.currentTool = tool;
        // Логика выбора инструмента...
    }
}

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
    const editor = new GraphicEditor();
    window.editor = editor; // Для отладки
});
