export function saveData() {
    const mindmap = document.getElementById('mindmap');
    localStorage.setItem('mindmap', mindmap.innerHTML);
}

export function loadData() {
    const savedMap = localStorage.getItem('mindmap');
    if (savedMap) {
        document.getElementById('mindmap').innerHTML = savedMap;
    }
}

export function exportMap() {
    const mindmap = document.getElementById('mindmap').innerHTML;
    const blob = new Blob([mindmap], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.style.display = 'none';
    a.href = url;
    a.download = "mindmap.html";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
}
