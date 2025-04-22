// Táblázat kezelő JavaScript kód

// DOM elemek lekérése
const hallgatoForm = document.getElementById('hallgato-form');
const hallgatoLista = document.getElementById('hallgato-lista');
const formTitle = document.getElementById('form-title');
const mentesBtn = document.getElementById('mentes-btn');
const megseBtn = document.getElementById('megse-btn');
const szerkesztesId = document.getElementById('szerkesztes-id');
const keresesInput = document.getElementById('kereses');
const tablazatFejlecek = document.querySelectorAll('th[data-sort]');

// Űrlap mezők
const nevInput = document.getElementById('nev');
const neptunInput = document.getElementById('neptun');
const szakInput = document.getElementById('szak');
const szulevInput = document.getElementById('szulev');

// Hiba üzenetek
const nevHiba = document.getElementById('nev-hiba');
const neptunHiba = document.getElementById('neptun-hiba');
const szakHiba = document.getElementById('szak-hiba');
const szulevHiba = document.getElementById('szulev-hiba');

// Globális változók
let hallgatoAdatok = [];
let jelenlegiRendezes = {
    oszlop: 'nev',
    irany: 'novekvo'
};

// Oldal betöltésekor
document.addEventListener('DOMContentLoaded', function() {
    // Adatok betöltése localStorage-ból
    betoltesLocalStorage();
    
    // Hallgatók megjelenítése
    hallgatokMegjelenitese();
    
    // Eseménykezelők beállítása
    esemenyek();
});

// Adatok betöltése localStorage-ból
function betoltesLocalStorage() {
    const taroltAdatok = localStorage.getItem('hallgatoAdatok');
    
    if (taroltAdatok) {
        hallgatoAdatok = JSON.parse(taroltAdatok);
    } else {
        // Ha nincs adat, példa adatok betöltése
        hallgatoAdatok = [
            { id: 1, nev: 'Kovács János', neptun: 'ABC123', szak: 'Mérnök informatikus', szulev: 2000 },
            { id: 2, nev: 'Nagy Emma', neptun: 'DEF456', szak: 'Gazdaságinformatikus', szulev: 2001 },
            { id: 3, nev: 'Szabó Péter', neptun: 'GHI789', szak: 'Mérnök informatikus', szulev: 1998 },
            { id: 4, nev: 'Tóth Réka', neptun: 'JKL012', szak: 'Programtervező informatikus', szulev: 2002 }
        ];
        
        // Mentés localStorage-ba
        mentesLocalStorage();
    }
}

// Adatok mentése localStorage-ba
function mentesLocalStorage() {
    localStorage.setItem('hallgatoAdatok', JSON.stringify(hallgatoAdatok));
}

// Eseménykezelők beállítása
function esemenyek() {
    // Űrlap beküldés
    hallgatoForm.addEventListener('submit', hallgatoMentese);
    
    // Mégse gomb
    megseBtn.addEventListener('click', urlapAlaphelyzetbe);
    
    // Keresés beviteli mező
    keresesInput.addEventListener('input', () => {
        hallgatokMegjelenitese();
    });
    
    // Rendezés a táblázat fejlécére kattintva
    tablazatFejlecek.forEach(fejlec => {
        fejlec.addEventListener('click', () => {
            const oszlop = fejlec.getAttribute('data-sort');
            
            // Rendezési irány váltása, ha ugyanarra az oszlopra kattintottunk
            if (jelenlegiRendezes.oszlop === oszlop) {
                jelenlegiRendezes.irany = (jelenlegiRendezes.irany === 'novekvo') ? 'csokkeno' : 'novekvo';
            } else {
                jelenlegiRendezes.oszlop = oszlop;
                jelenlegiRendezes.irany = 'novekvo';
            }
            
            // Rendezési jelzők frissítése a fejlécekben
            frissitRendezesiJelzoket();
            
            // Táblázat újrarajzolása a rendezés szerint
            hallgatokMegjelenitese();
        });
    });
}

// Rendezési jelzők frissítése a táblázat fejlécekben
function frissitRendezesiJelzoket() {
    tablazatFejlecek.forEach(fejlec => {
        const oszlop = fejlec.getAttribute('data-sort');
        
        // Rendezési ikon beállítása
        if (oszlop === jelenlegiRendezes.oszlop) {
            const ikon = (jelenlegiRendezes.irany === 'novekvo') ? '▲' : '▼';
            fejlec.textContent = fejlec.textContent.replace(/[▲▼]$/, '') + ' ' + ikon;
        } else {
            // Ikon eltávolítása a többi fejlécből
            fejlec.textContent = fejlec.textContent.replace(/[▲▼]$/, '');
        }
    });
}

// Hallgató mentése (új hozzáadása vagy meglévő szerkesztése)
function hallgatoMentese(e) {
    e.preventDefault();
    
    // Validálás
    if (!urlapValidalas()) {
        return;
    }
    
    const hallgatoAdat = {
        nev: nevInput.value,
        neptun: neptunInput.value,
        szak: szakInput.value,
        szulev: parseInt(szulevInput.value)
    };
    
    // Szerkesztés vagy új hozzáadása
    if (szerkesztesId.value) {
        // Meglévő hallgató frissítése
        const id = parseInt(szerkesztesId.value);
        const index = hallgatoAdatok.findIndex(hallgato => hallgato.id === id);
        
        if (index !== -1) {
            hallgatoAdat.id = id;
            hallgatoAdatok[index] = hallgatoAdat;
        }
    } else {
        // Új hallgató hozzáadása
        hallgatoAdat.id = new Date().getTime(); // Egyedi ID generálása
        hallgatoAdatok.push(hallgatoAdat);
    }
    
    // Adatok mentése és űrlap visszaállítása
    mentesLocalStorage();
    urlapAlaphelyzetbe();
    hallgatokMegjelenitese();
}

// Űrlap validálás
function urlapValidalas() {
    let ervenyes = true;
    
    // Név validálás
    if (!nevInput.value || nevInput.value.length < 3 || nevInput.value.length > 50) {
        nevHiba.textContent = 'A név kötelező, és 3-50 karakter között kell lennie!';
        ervenyes = false;
    } else {
        nevHiba.textContent = '';
    }
    
    // Neptun kód validálás
    if (!neptunInput.value || neptunInput.value.length !== 6) {
        neptunHiba.textContent = 'A Neptun kód kötelező, és pontosan 6 karakter hosszú kell legyen!';
        ervenyes = false;
    } else {
        neptunHiba.textContent = '';
    }
    
    // Szak validálás
    if (!szakInput.value) {
        szakHiba.textContent = 'A szak megadása kötelező!';
        ervenyes = false;
    } else {
        szakHiba.textContent = '';
    }
    
    // Születési év validálás
    const szulev = parseInt(szulevInput.value);
    if (isNaN(szulev) || szulev < 1990 || szulev > 2005) {
        szulevHiba.textContent = 'A születési évnek 1990 és 2005 között kell lennie!';
        ervenyes = false;
    } else {
        szulevHiba.textContent = '';
    }
    
    return ervenyes;
}

// Űrlap visszaállítása alaphelyzetbe
function urlapAlaphelyzetbe() {
    formTitle.textContent = 'Új hallgató hozzáadása';
    mentesBtn.textContent = 'Hozzáadás';
    megseBtn.style.display = 'none';
    szerkesztesId.value = '';
    hallgatoForm.reset();
    
    // Hibák törlése
    nevHiba.textContent = '';
    neptunHiba.textContent = '';
    szakHiba.textContent = '';
    szulevHiba.textContent = '';
}

// Hallgató szerkesztése
function hallgatoSzerkesztese(id) {
    const hallgato = hallgatoAdatok.find(hallgato => hallgato.id === id);
    
    if (hallgato) {
        // Űrlap átállítása szerkesztési módba
        formTitle.textContent = 'Hallgató szerkesztése';
        mentesBtn.textContent = 'Módosítás';
        megseBtn.style.display = 'inline-block';
        
        // Adatok betöltése az űrlapba
        szerkesztesId.value = hallgato.id;
        nevInput.value = hallgato.nev;
        neptunInput.value = hallgato.neptun;
        szakInput.value = hallgato.szak;
        szulevInput.value = hallgato.szulev;
        
        // Görgetés az űrlaphoz
        hallgatoForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hallgató törlése
function hallgatoTorlese(id) {
    if (confirm('Biztosan törölni szeretnéd ezt a hallgatót?')) {
        hallgatoAdatok = hallgatoAdatok.filter(hallgato => hallgato.id !== id);
        mentesLocalStorage();
        hallgatokMegjelenitese();
    }
}

// Hallgatók megjelenítése a táblázatban
function hallgatokMegjelenitese() {
    // Táblázat tartalmának törlése
    hallgatoLista.innerHTML = '';
    
    // Szűrés a keresési kifejezés alapján
    let szurtAdatok = hallgatoAdatok;
    const keresesKifejezes = keresesInput.value.toLowerCase();
    
    if (keresesKifejezes) {
        szurtAdatok = hallgatoAdatok.filter(hallgato => 
            hallgato.nev.toLowerCase().includes(keresesKifejezes) ||
            hallgato.neptun.toLowerCase().includes(keresesKifejezes) ||
            hallgato.szak.toLowerCase().includes(keresesKifejezes) ||
            hallgato.szulev.toString().includes(keresesKifejezes)
        );
    }
    
    // Adatok rendezése
    szurtAdatok.sort((a, b) => {
        let ertek1 = a[jelenlegiRendezes.oszlop];
        let ertek2 = b[jelenlegiRendezes.oszlop];
        
        // String típusú értékek esetén kisbetűsítés
        if (typeof ertek1 === 'string') {
            ertek1 = ertek1.toLowerCase();
            ertek2 = ertek2.toLowerCase();
        }
        
        // Rendezés irányának megfelelő összehasonlítás
        if (jelenlegiRendezes.irany === 'novekvo') {
            return ertek1 > ertek2 ? 1 : -1;
        } else {
            return ertek1 < ertek2 ? 1 : -1;
        }
    });
    
    // Táblázat létrehozása
    if (szurtAdatok.length === 0) {
        const sor = document.createElement('tr');
        sor.innerHTML = '<td colspan="5">Nincs találat</td>';
        hallgatoLista.appendChild(sor);
    } else {
        szurtAdatok.forEach(hallgato => {
            const sor = document.createElement('tr');
            sor.innerHTML = `
                <td>${hallgato.nev}</td>
                <td>${hallgato.neptun}</td>
                <td>${hallgato.szak}</td>
                <td>${hallgato.szulev}</td>
                <td>
                    <button class="szerkesztes-gomb" onclick="hallgatoSzerkesztese(${hallgato.id})">Szerkesztés</button>
                    <button class="torles-gomb" onclick="hallgatoTorlese(${hallgato.id})">Törlés</button>
                </td>
            `;
            hallgatoLista.appendChild(sor);
        });
    }
}

// Globális függvények elérhetővé tétele
window.hallgatoSzerkesztese = hallgatoSzerkesztese;
window.hallgatoTorlese = hallgatoTorlese;
