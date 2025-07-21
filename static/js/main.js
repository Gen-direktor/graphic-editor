// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    initMindmap();
    loadData();
});

// Основная функция инициализации
function initMindmap() {
    // Получаем основной элемент карты
    const mindmap = document.getElementById('mindmap');
    
    // Обработчик добавления нового узла
    function addNode(element) {
        const parent = element.parentNode.parentNode;
        const newLi = document.createElement('li');
        newLi.innerHTML = `
            <span contenteditable="true">Новая тема</span>
            <div class="node-controls">
                <button class="btn btn-add" onclick="addNode(this)">+</button>
                <button class="btn btn-edit" onclick="editNode(this)">Редактировать</button>
                <button class="btn btn-delete" onclick="deleteNode(this)">×</button>
            </div>
            <ul></ul>
        `;
        parent.appendChild(newLi);
        saveData();
    }

    // Добавление корневой темы
    function addRootNode() {
        const newLi = document.createElement('li');
        newLi.innerHTML = `
            <span contenteditable="true">Новая корневая тема</span>
            <div class="node-controls">
                <button class="btn btn-add" onclick="addNode(this)">+</button>
                <button class="btn btn-edit" onclick="editNode(this)">Редактировать</button>
                <button class="btn btn-delete" onclick="deleteNode(this)">×</button>
            </div>
            <ul></ul>
        `;
        mindmap.getElementsByTagName('ul')[0].appendChild(newLi);
        saveData();
    }

    // Удаление узла
    function deleteNode(element) {
        const parent = element.parentNode.parentNode;
        parent.parentNode.removeChild(parent);
        saveData();
    }

    // Редактирование узла
    function editNode(element) {
        const nodeText = element.parentNode.querySelector('span');
        const currentText = nodeText.innerHTML;
        
        const input = document.createElement('input');
        input.value = currentText;
        input.addEventListener('blur', () => {
            nodeText.innerHTML = input.value;
            document.body.removeChild(input);
            saveData();
        });
        
        document.body.appendChild(input);
        input.focus();
    }

    // Сохранение данных в localStorage
    function saveData() {
        const mapData = mindmap.innerHTML;
        localStorage.setItem('mindmap', mapData);
    }

    // Загрузка данных из localStorage
    function loadData() {
        const savedMap = localStorage.getItem('mindmap');
        if (savedMap) {
            mindmap.innerHTML = savedMap;
        }
    }

    // Экспорт карты
    function exportMap() {
        const mapData = mindmap.innerHTML;
        const blob = new Blob([mapData], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = "mindmap.html";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    }

    // Добавляем обработчики событий
    document.querySelector('.btn-add').addEventListener('click', addRootNode);
    document.querySelector('.btn-save').addEventListener('click', saveData);
    document.querySelector('.btn-export').addEventListener('click', exportMap);
}

