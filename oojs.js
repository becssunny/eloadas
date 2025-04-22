// Az OOP alkalmazás fő osztályai és funkcionalitása

// Alaposztály minden alakzathoz
class Shape {
    constructor(type, color, size) {
        this.type = type;
        this.color = color;
        this.size = size;
        this.element = null;
        this.id = `shape-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Alakzat létrehozása és DOM-hoz adása
    draw(container) {
        this.element = document.createElement('div');
        this.element.id = this.id;
        this.element.className = `shape ${this.type}`;
        this.element.style.backgroundColor = this.color;
        
        // Alapvető stílusok beállítása
        this.element.style.position = 'absolute';
        this.element.style.cursor = 'grab';
        
        // Kezdő pozíció randomizálása a konténeren belül
        const maxX = container.clientWidth - this.size;
        const maxY = container.clientHeight - this.size;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        this.element.style.left = `${randomX}px`;
        this.element.style.top = `${randomY}px`;
        
        // Események hozzáadása
        this.addEventListeners();
        
        // DOM-hoz adás
        container.appendChild(this.element);
        
        // Alakzatok számának frissítése
        updateShapeCounter();
        
        return this;
    }
    
    // Eseménykezelők hozzáadása
    addEventListeners() {
        // Mozgatás (Drag) kezelése
        this.element.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        
        // Törlés dupla kattintásra
        this.element.addEventListener('dblclick', this.delete.bind(this));
    }
    
    // Mozgatás kezdete
    onDragStart(e) {
        if (e.button !== 0) return; // Csak bal kattintásra reagáljon
        
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startLeft = parseInt(this.element.style.left) || 0;
        this.startTop = parseInt(this.element.style.top) || 0;
        
        this.element.style.cursor = 'grabbing';
        this.element.style.zIndex = 1000; // Előtérbe hozás
        
        e.preventDefault();
    }
    
    // Mozgatás közben
    onDragMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        // Új pozíció kiszámítása
        const newLeft = this.startLeft + deltaX;
        const newTop = this.startTop + deltaY;
        
        // Korlátok beállítása a rajzterületen belül
        const container = document.getElementById('drawing-area');
        const maxX = container.clientWidth - this.element.offsetWidth;
        const maxY = container.clientHeight - this.element.offsetHeight;
        
        // Pozíció frissítése a korlátok figyelembevételével
        this.element.style.left = `${Math.max(0, Math.min(maxX, newLeft))}px`;
        this.element.style.top = `${Math.max(0, Math.min(maxY, newTop))}px`;
    }
    
    // Mozgatás vége
    onDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.element.style.cursor = 'grab';
        this.element.style.zIndex = 999; // Visszaállítás egy kicsit alacsonyabbra
    }
    
    // Alakzat törlése
    delete() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            updateShapeCounter();
        }
    }
}

// Téglalap alakzat osztály
class Rectangle extends Shape {
    constructor(color, size) {
        super('rectangle', color, size);
    }
    
    draw(container) {
        super.draw(container);
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size * 0.8}px`;
        return this;
    }
}

// Kör alakzat osztály
class Circle extends Shape {
    constructor(color, size) {
        super('circle', color, size);
    }
    
    draw(container) {
        super.draw(container);
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.borderRadius = '50%';
        return this;
    }
}

// Háromszög alakzat osztály
class Triangle extends Shape {
    constructor(color, size) {
        super('triangle', color, size);
    }
    
    draw(container) {
        super.draw(container);
        
        // Eltávolítjuk az alapértelmezett háttérszínt
        this.element.style.backgroundColor = 'transparent';
        
        // Háromszög méretezése
        const halfSize = this.size / 2;
        
        // Háromszög stílusok módosítása
        this.element.style.width = '0';
        this.element.style.height = '0';
        this.element.style.borderLeft = `${halfSize}px solid transparent`;
        this.element.style.borderRight = `${halfSize}px solid transparent`;
        this.element.style.borderBottom = `${this.size}px solid ${this.color}`;
        
        return this;
    }
}

// Globális változók és segédfüggvények
let shapes = [];

// Alakzatok számának frissítése
function updateShapeCounter() {
    const shapeElements = document.querySelectorAll('.shape');
    const countElement = document.getElementById('shape-count');
    if (countElement) {
        countElement.textContent = shapeElements.length;
    }
}

// Méret érték megjelenítése
function updateSizeLabel() {
    const sizeSlider = document.getElementById('shape-size');
    const sizeValue = document.getElementById('size-value');
    if (sizeSlider && sizeValue) {
        sizeValue.textContent = sizeSlider.value;
    }
}

// Új alakzat létrehozása a felhasználói beállítások alapján
function createNewShape() {
    const container = document.getElementById('drawing-area');
    const typeSelect = document.getElementById('shape-type');
    const colorInput = document.getElementById('shape-color');
    const sizeInput = document.getElementById('shape-size');
    
    if (!container || !typeSelect || !colorInput || !sizeInput) {
        console.error('Hiányzó form elemek!');
        return;
    }
    
    const type = typeSelect.value;
    const color = colorInput.value;
    const size = parseInt(sizeInput.value);
    
    let shape;
    
    // Létrehozzuk a megfelelő típusú alakzatot
    switch (type) {
        case 'rectangle':
            shape = new Rectangle(color, size);
            break;
        case 'circle':
            shape = new Circle(color, size);
            break;
        case 'triangle':
            shape = new Triangle(color, size);
            break;
        default:
            console.error('Ismeretlen alakzat típus!');
            return;
    }
    
    // Rajzoljuk és tároljuk
    shape.draw(container);
    shapes.push(shape);
    
    // Távolítsuk el az instrukciós szöveget, ha van alakzat
    const instructions = container.querySelector('.instructions');
    if (instructions) {
        instructions.style.display = 'none';
    }
}

// Összes alakzat törlése
function clearAllShapes() {
    const container = document.getElementById('drawing-area');
    const shapeElements = container.querySelectorAll('.shape');
    
    shapeElements.forEach(element => {
        container.removeChild(element);
    });
    
    shapes = []; // Tömb ürítése
    updateShapeCounter();
    
    // Instrukciók újra megjelenítése
    const instructions = container.querySelector('.instructions');
    if (instructions) {
        instructions.style.display = 'block';
    }
}

// Eseménykezelők beállítása
document.addEventListener('DOMContentLoaded', function() {
    // Gombok eseménykezelőinek beállítása
    const createButton = document.getElementById('create-shape');
    const clearButton = document.getElementById('clear-all');
    const sizeSlider = document.getElementById('shape-size');
    
    if (createButton) {
        createButton.addEventListener('click', createNewShape);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearAllShapes);
    }
    
    if (sizeSlider) {
        sizeSlider.addEventListener('input', updateSizeLabel);
        // Kezdeti érték megjelenítése
        updateSizeLabel();
    }
});
