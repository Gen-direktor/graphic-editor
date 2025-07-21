import { initMindMap } from './components/MindMap.js';
import { saveData, loadData } from './utils/storage.js';

document.addEventListener('DOMContentLoaded', () => {
    initMindMap();
    loadData();
});

window.saveMap = () => {
    saveData();
};

window.loadMap = () => {
    loadData();
};
