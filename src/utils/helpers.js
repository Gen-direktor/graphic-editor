export function getRandomId() {
    return Math.random().toString(36).substr(2, 9);
}

export function formatDate() {
    return new Date().toLocaleString();
}
