export function createNode(title) {
    const node = document.createElement('li');
    
    node.innerHTML = `
        <span contenteditable="true">${title}</span>
        <div class="node-controls">
            <button class="btn btn-add" onclick="addNode(this)">+</button>
            <button class="btn btn-edit" onclick="editNode(this)">Редактировать</button>
            <button class="btn btn-delete" onclick="deleteNode(this)">×</button>
        </div>
        <ul></ul>
    `;
    
    return node;
}
