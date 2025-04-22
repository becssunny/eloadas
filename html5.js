// HTML5 példák működéséhez szükséges JavaScript kód

// Az oldal betöltődésekor
document.addEventListener('DOMContentLoaded', function() {
    // 1. Web Storage funkciók inicializálása
    initWebStorage();
    
    // 2. Web Workers funkciók inicializálása
    initWebWorkers();
    
    // 3. Server-Sent Events funkciók inicializálása
    initServerSentEvents();
    
    // 4. Geolocation API funkciók inicializálása
    initGeolocation();
    
    // 5. Drag and Drop API funkciók inicializálása
    initDragAndDrop();
    
    // 6. Canvas funkciók inicializálása
    initCanvas();
    
    // 7. SVG funkciók inicializálása
    initSVG();
});

// 1. Web Storage
function initWebStorage() {
    // LocalStorage elemek
    const localStorageAdat = document.getElementById('localStorage-adat');
    const mentesLocalStorage = document.getElementById('mentes-localStorage');
    const olvasasLocalStorage = document.getElementById('olvasas-localStorage');
    const torlesLocalStorage = document.getElementById('torles-localStorage');
    const localStorageEredmeny = document.getElementById('localStorage-eredmeny');
    
    // SessionStorage elemek
    const sessionStorageAdat = document.getElementById('sessionStorage-adat');
    const mentesSessionStorage = document.getElementById('mentes-sessionStorage');
    const olvasasSessionStorage = document.getElementById('olvasas-sessionStorage');
    const sessionStorageEredmeny = document.getElementById('sessionStorage-eredmeny');
    
    // LocalStorage események
    mentesLocalStorage.addEventListener('click', function() {
        const adat = localStorageAdat.value;
        localStorage.setItem('webprog1Adat', adat);
        localStorageEredmeny.textContent = `Adat elmentve a LocalStorage-ba: "${adat}"`;
    });
    
    olvasasLocalStorage.addEventListener('click', function() {
        const adat = localStorage.getItem('webprog1Adat');
        if (adat) {
            localStorageEredmeny.textContent = `Adat kiolvasva a LocalStorage-ból: "${adat}"`;
        } else {
            localStorageEredmeny.textContent = 'Nincs mentett adat a LocalStorage-ban.';
        }
    });
    
    torlesLocalStorage.addEventListener('click', function() {
        localStorage.removeItem('webprog1Adat');
        localStorageEredmeny.textContent = 'Adat törölve a LocalStorage-ból.';
    });
    
    // SessionStorage események
    mentesSessionStorage.addEventListener('click', function() {
        const adat = sessionStorageAdat.value;
        sessionStorage.setItem('webprog1Adat', adat);
        sessionStorageEredmeny.textContent = `Adat elmentve a SessionStorage-ba: "${adat}"`;
    });
    
    olvasasSessionStorage.addEventListener('click', function() {
        const adat = sessionStorage.getItem('webprog1Adat');
        if (adat) {
            sessionStorageEredmeny.textContent = `Adat kiolvasva a SessionStorage-ból: "${adat}"`;
        } else {
            sessionStorageEredmeny.textContent = 'Nincs mentett adat a SessionStorage-ban.';
        }
    });
}

// 2. Web Workers
function initWebWorkers() {
    const primszamHatar = document.getElementById('primszam-hatar');
    const workerNelkulBtn = document.getElementById('primerek-worker-nelkul');
    const workerrelBtn = document.getElementById('primkerek-workerrel');
    const workerEredmeny = document.getElementById('worker-eredmeny');
    
    // Prímszám kereső függvény
    function primszamKereso(max) {
        const primek = [];
        primkereses:
        for (let i = 2; i <= max; i++) {
            // Ellenőrizzük, hogy i osztható-e bármely, önmagánál kisebb számmal
            for (let j = 2; j < i; j++) {
                if (i % j === 0) continue primkereses; // Ha igen, ugrunk a következő számra
            }
            primek.push(i); // Ha nem, akkor i prímszám
        }
        return primek;
    }
    
    // Worker nélküli számítás
    workerNelkulBtn.addEventListener('click', function() {
        const max = parseInt(primszamHatar.value);
        
        if (isNaN(max) || max < 10 || max > 1000000) {
            workerEredmeny.textContent = 'Érvénytelen határ! Adj meg egy 10 és 1000000 közötti számot.';
            return;
        }
        
        workerEredmeny.textContent = 'Számolás Worker nélkül... (Ez blokkolja a felületet)';
        
        // Késleltetjük a számítást, hogy látható legyen a blokkoló hatás
        setTimeout(function() {
            const startTime = new Date().getTime();
            const primek = primszamKereso(max);
            const endTime = new Date().getTime();
            
            workerEredmeny.textContent = `Worker nélkül: ${primek.length} db prímszámot találtam ${max}-ig, ${endTime - startTime} ms alatt.\nAz első 10 prímszám: ${primek.slice(0, 10).join(', ')}${primek.length > 10 ? '...' : ''}`;
        }, 100);
    });
    
    // Worker-rel történő számítás
    workerrelBtn.addEventListener('click', function() {
        const max = parseInt(primszamHatar.value);
        
        if (isNaN(max) || max < 10 || max > 1000000) {
            workerEredmeny.textContent = 'Érvénytelen határ! Adj meg egy 10 és 1000000 közötti számot.';
            return;
        }
        
        workerEredmeny.textContent = 'Számolás Web Worker-rel... (A felület nem blokkol)';
        
        // Web Worker script létrehozása Blob-ként
        const workerScript = `
            self.onmessage = function(e) {
                const max = e.data;
                const primek = [];
                
                primkereses:
                for (let i = 2; i <= max; i++) {
                    for (let j = 2; j < i; j++) {
                        if (i % j === 0) continue primkereses;
                    }
                    primek.push(i);
                }
                
                self.postMessage(primek);
            };
        `;
        
        const blob = new Blob([workerScript], {type: 'application/javascript'});
        const workerUrl = URL.createObjectURL(blob);
        
        // Worker létrehozása
        const worker = new Worker(workerUrl);
        
        const startTime = new Date().getTime();
        
        // Üzenet küldése a worker-nek
        worker.postMessage(max);
        
        // Worker válaszának fogadása
        worker.onmessage = function(e) {
            const primek = e.data;
            const endTime = new Date().getTime();
            
            workerEredmeny.textContent = `Worker-rel: ${primek.length} db prímszámot találtam ${max}-ig, ${endTime - startTime} ms alatt.\nAz első 10 prímszám: ${primek.slice(0, 10).join(', ')}${primek.length > 10 ? '...' : ''}`;
            
            // Worker felszabadítása
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
        };
    });
}

// 3. Server-Sent Events (szimulált)
function initServerSentEvents() {
    const sseStartBtn = document.getElementById('sse-start');
    const sseStopBtn = document.getElementById('sse-stop');
    const sseEredmeny = document.getElementById('sse-eredmeny');
    
    let eventInterval = null;
    
    sseStartBtn.addEventListener('click', function() {
        // Ellenőrzés, hogy már fut-e az esemény szimuláció
        if (eventInterval) {
            return;
        }
        
        sseEredmeny.innerHTML = '<p>SSE események indítása...</p>';
        
        // Szimulált események küldése 2 másodpercenként
        eventInterval = setInterval(function() {
            const esemeny = {
                id: new Date().getTime(),
                ido: new Date().toLocaleTimeString(),
                ertek: Math.floor(Math.random() * 100)
            };
            
            const esemenyElem = document.createElement('p');
            esemenyElem.textContent = `[${esemeny.ido}] Új esemény érkezett: ID=${esemeny.id}, Érték=${esemeny.ertek}`;
            
            sseEredmeny.appendChild(esemenyElem);
            
            // A konténer görgetése az aljára
            sseEredmeny.scrollTop = sseEredmeny.scrollHeight;
        }, 2000);
    });
    
    sseStopBtn.addEventListener('click', function() {
        if (eventInterval) {
            clearInterval(eventInterval);
            eventInterval = null;
            
            const lezaroElem = document.createElement('p');
            lezaroElem.textContent = '[LEÁLLÍTVA] SSE események leállítva.';
            lezaroElem.style.fontWeight = 'bold';
            lezaroElem.style.color = 'red';
            
            sseEredmeny.appendChild(lezaroElem);
        }
    });
}

// 4. Geolocation API
function initGeolocation() {
    const pozicioBtn = document.getElementById('pozicio-lekerdezes');
    const geoEredmeny = document.getElementById('geo-eredmeny');
    
    pozicioBtn.addEventListener('click', function() {
        geoEredmeny.textContent = 'Pozíció lekérdezése...';
        
        // Ellenőrizzük, hogy a böngésző támogatja-e a Geolocation API-t
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Sikeres lekérdezés esetén
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const accuracy = position.coords.accuracy;
                    
                    geoEredmeny.innerHTML = `
                        <p>Sikeresen lekérdezve a pozíciód:</p>
                        <p><strong>Szélesség:</strong> ${latitude}</p>
                        <p><strong>Hosszúság:</strong> ${longitude}</p>
                        <p><strong>Pontosság:</strong> ${accuracy} méter</p>
                    `;
                },
                // Hiba esetén
                function(error) {
                    let hibaUzenet = 'Hiba történt a pozíció lekérdezése során: ';
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            hibaUzenet += 'A felhasználó nem engedélyezte a helymeghatározást.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            hibaUzenet += 'A helyadatok nem elérhetők.';
                            break;
                        case error.TIMEOUT:
                            hibaUzenet += 'A lekérdezés időtúllépés miatt megszakadt.';
                            break;
                        case error.UNKNOWN_ERROR:
                            hibaUzenet += 'Ismeretlen hiba történt.';
                            break;
                    }
                    
                    geoEredmeny.textContent = hibaUzenet;
                },
                // Opciók
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            geoEredmeny.textContent = 'A böngésződ nem támogatja a Geolocation API-t.';
        }
    });
}

// 5. Drag and Drop API
function initDragAndDrop() {
    const draggable = document.getElementById('drag1');
    const dropTarget = document.getElementById('drop-target');
    const dragDropEredmeny = document.getElementById('drag-drop-eredmeny');
    
    // Drag elemek eseményei
    draggable.addEventListener('dragstart', function(e) {
        // Az elem átlátszóságának beállítása húzás közben
        this.style.opacity = '0.4';
        
        // Az elem azonosítójának tárolása, hogy tudjuk, mit húzunk
        e.dataTransfer.setData('text/plain', this.id);
        
        dragDropEredmeny.textContent = 'Húzás elkezdve...';
    });
    
    draggable.addEventListener('dragend', function(e) {
        // Az elem átlátszóságának visszaállítása
        this.style.opacity = '1';
        
        if (e.dataTransfer.dropEffect === 'none') {
            dragDropEredmeny.textContent = 'Húzás megszakítva vagy nem érvényes helyre dobva.';
        }
    });
    
    // Drop célterület eseményei
    dropTarget.addEventListener('dragover', function(e) {
        // Alapértelmezett viselkedés megakadályozása, hogy engedélyezzük a drop műveletet
        e.preventDefault();
        
        // Vizuális visszajelzés, hogy a terület aktív
        this.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
        this.style.borderStyle = 'solid';
    });
    
    dropTarget.addEventListener('dragleave', function(e) {
        // Visszaállítjuk az eredeti megjelenést, ha az elem elhagyja a területet
        this.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        this.style.borderStyle = 'dashed';
    });
    
    dropTarget.addEventListener('drop', function(e) {
        // Alapértelmezett viselkedés megakadályozása (pl. fájl megnyitása)
        e.preventDefault();
        
        // Visszaállítjuk az eredeti megjelenést
        this.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        this.style.borderStyle = 'dashed';
        
        // Lekérjük az adatot, amit átadtunk a dragstart eseménynél
        const id = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(id);
        
        // Az elem hozzáadása a célterülethez
        if (draggedElement) {
            this.innerHTML = '';  // Célterület tartalmának törlése
            const clone = draggedElement.cloneNode(true);
            clone.style.opacity = '1';
            clone.textContent = 'Sikeresen dobva!';
            this.appendChild(clone);
            
            dragDropEredmeny.textContent = 'Az elem sikeresen áthúzva a célterületre!';
            
            // Az eredeti elem eltávolítása a forrásból
            draggedElement.parentNode.removeChild(draggedElement);
        }
    });
}

// 6. Canvas
function initCanvas() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    const rajzolTeglalapBtn = document.getElementById('rajzol-teglalap');
    const rajzolKorBtn = document.getElementById('rajzol-kor');
    const rajzolVonalBtn = document.getElementById('rajzol-vonal');
    const canvasTorlesBtn = document.getElementById('canvas-torles');
    
    // Canvas törlése
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Kezdeti canvas törlése
    clearCanvas();
    
    // Téglalap rajzolása
    rajzolTeglalapBtn.addEventListener('click', function() {
        clearCanvas();
        
        // Kitöltött téglalap
        ctx.fillStyle = 'rgba(52, 152, 219, 0.7)';
        ctx.fillRect(50, 50, 150, 100);
        
        // Téglalap körvonala
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, 150, 100);
    });
    
    // Kör rajzolása
    rajzolKorBtn.addEventListener('click', function() {
        clearCanvas();
        
        // Kör rajzolása
        ctx.beginPath();
        ctx.arc(200, 100, 70, 0, 2 * Math.PI);
        
        // Kör kitöltése
        ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
        ctx.fill();
        
        // Kör körvonala
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Vonal rajzolása
    rajzolVonalBtn.addEventListener('click', function() {
        clearCanvas();
        
        // Vonal rajzolása
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(350, 150);
        
        // Vonal stílusa
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 5;
        ctx.stroke();
    });
    
    // Canvas törlése
    canvasTorlesBtn.addEventListener('click', function() {
        clearCanvas();
    });
}

// 7. SVG
function initSVG() {
    const svgTeglalapElem = document.getElementById('svg-teglalap');
    const svgKorElem = document.getElementById('svg-kor');
    const svgVonalElem = document.getElementById('svg-vonal');
    
    const svgAnimacioBtn = document.getElementById('svg-animacio');
    const svgAlaphelyzetBtn = document.getElementById('svg-alaphelyzet');
    
    // Eredeti attribútumok tárolása
    const eredetiAttributumok = {
        teglalap: {
            x: svgTeglalapElem.getAttribute('x'),
            y: svgTeglalapElem.getAttribute('y'),
            width: svgTeglalapElem.getAttribute('width'),
            height: svgTeglalapElem.getAttribute('height'),
            fill: svgTeglalapElem.getAttribute('fill')
        },
        kor: {
            cx: svgKorElem.getAttribute('cx'),
            cy: svgKorElem.getAttribute('cy'),
            r: svgKorElem.getAttribute('r'),
            fill: svgKorElem.getAttribute('fill')
        },
        vonal: {
            x1: svgVonalElem.getAttribute('x1'),
            y1: svgVonalElem.getAttribute('y1'),
            x2: svgVonalElem.getAttribute('x2'),
            y2: svgVonalElem.getAttribute('y2'),
            stroke: svgVonalElem.getAttribute('stroke')
        }
    };
    
    // SVG animáció
    svgAnimacioBtn.addEventListener('click', function() {
        // Téglalap animálása
        svgTeglalapElem.setAttribute('fill', 'purple');
        animateAttribute(svgTeglalapElem, 'x', parseInt(eredetiAttributumok.teglalap.x), parseInt(eredetiAttributumok.teglalap.x) + 100, 1000);
        animateAttribute(svgTeglalapElem, 'width', parseInt(eredetiAttributumok.teglalap.width), parseInt(eredetiAttributumok.teglalap.width) - 50, 1000);
        
        // Kör animálása
        svgKorElem.setAttribute('fill', 'orange');
        animateAttribute(svgKorElem, 'cy', parseInt(eredetiAttributumok.kor.cy), parseInt(eredetiAttributumok.kor.cy) - 30, 1000);
        animateAttribute(svgKorElem, 'r', parseInt(eredetiAttributumok.kor.r), parseInt(eredetiAttributumok.kor.r) + 20, 1000);
        
        // Vonal animálása
        svgVonalElem.setAttribute('stroke', 'red');
        animateAttribute(svgVonalElem, 'x1', parseInt(eredetiAttributumok.vonal.x1), parseInt(eredetiAttributumok.vonal.x1) + 50, 1000);
        animateAttribute(svgVonalElem, 'y2', parseInt(eredetiAttributumok.vonal.y2), parseInt(eredetiAttributumok.vonal.y2) - 50, 1000);
    });
    
    // SVG alaphelyzetbe állítása
    svgAlaphelyzetBtn.addEventListener('click', function() {
        // Téglalap visszaállítása
        Object.keys(eredetiAttributumok.teglalap).forEach(attr => {
            svgTeglalapElem.setAttribute(attr, eredetiAttributumok.teglalap[attr]);
        });
        
        // Kör visszaállítása
        Object.keys(eredetiAttributumok.kor).forEach(attr => {
            svgKorElem.setAttribute(attr, eredetiAttributumok.kor[attr]);
        });
        
        // Vonal visszaállítása
        Object.keys(eredetiAttributumok.vonal).forEach(attr => {
            svgVonalElem.setAttribute(attr, eredetiAttributumok.vonal[attr]);
        });
    });
    
    // Segédfüggvény egy attribútum animálásához
    function animateAttribute(element, attribute, start, end, duration) {
        const startTime = new Date().getTime();
        
        function animate() {
            const currentTime = new Date().getTime();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = start + (end - start) * progress;
            element.setAttribute(attribute, currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }
}
