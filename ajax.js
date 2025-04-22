// AJAX műveletek

// Konfiguráció
const apiUrl = 'http://gamf.nhely.hu/ajax2/';
const userCode = 'BXSIE5abc123'; // BXSIE5 a Neptun kódom + egyedi azonosító

// DOM elemek - Read
const adatokLekerdezeseBtn = document.getElementById('adatok-lekerdezese');
const adatokContainer = document.getElementById('adatok-container');
const statisztikaContainer = document.getElementById('statisztika-container');
const heightStatisztika = document.getElementById('height-statisztika');

// DOM elemek - Create
const createForm = document.getElementById('create-form');
const createName = document.getElementById('create-name');
const createHeight = document.getElementById('create-height');
const createWeight = document.getElementById('create-weight');
const createNameHiba = document.getElementById('create-name-hiba');
const createHeightHiba = document.getElementById('create-height-hiba');
const createWeightHiba = document.getElementById('create-weight-hiba');
const createEredmeny = document.getElementById('create-eredmeny');

// DOM elemek - Update
const updateForm = document.getElementById('update-form');
const updateId = document.getElementById('update-id');
const getDataForIdBtn = document.getElementById('get-data-for-id');
const updateName = document.getElementById('update-name');
const updateHeight = document.getElementById('update-height');
const updateWeight = document.getElementById('update-weight');
const updateNameHiba = document.getElementById('update-name-hiba');
const updateHeightHiba = document.getElementById('update-height-hiba');
const updateWeightHiba = document.getElementById('update-weight-hiba');
const updateEredmeny = document.getElementById('update-eredmeny');

// DOM elemek - Delete
const deleteId = document.getElementById('delete-id');
const deleteButton = document.getElementById('delete-button');
const deleteEredmeny = document.getElementById('delete-eredmeny');

// Oldal betöltődésekor
document.addEventListener('DOMContentLoaded', function() {
    // 1. Read művelet eseménykezelő
    adatokLekerdezeseBtn.addEventListener('click', adatokLekerdezese);
    
    // 2. Create művelet eseménykezelő
    createForm.addEventListener('submit', function(event) {
        event.preventDefault();
        rekordLetrehozasa();
    });
    
    // 3. Update művelet eseménykezelők
    getDataForIdBtn.addEventListener('click', adatokLekereseId);
    updateForm.addEventListener('submit', function(event) {
        event.preventDefault();
        rekordModositasa();
    });
    
    // 4. Delete művelet eseménykezelő
    deleteButton.addEventListener('click', rekordTorlese);
});

// 1. Read művelet - Adatok lekérdezése
async function adatokLekerdezese() {
    // Állapot jelzése
    adatokContainer.innerHTML = '<p class="info-uzenet">Adatok lekérdezése folyamatban...</p>';
    statisztikaContainer.style.display = 'none';
    
    try {
        // API hívás
        const formData = new FormData();
        formData.append('op', 'read');
        formData.append('code', userCode);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });
        
        // Válasz feldolgozása
        if (!response.ok) {
            throw new Error(`Hiba történt: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Adatok megjelenítése
        if (data.rowCount === 0) {
            adatokContainer.innerHTML = '<p>Nincs találat az adatbázisban. Hozzon létre néhány rekordot!</p>';
            return;
        }
        
        // Táblázat létrehozása
        let htmlOutput = `
            <h4>Összesen ${data.rowCount} rekord található (max. ${data.maxNum} rekord jeleníthető meg)</h4>
            <table class="adatok-tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Név</th>
                        <th>Magasság</th>
                        <th>Súly</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Height értékek gyűjtése statisztikához
        const heightValues = [];
        
        // Táblázat sorok
        data.list.forEach(item => {
            htmlOutput += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.height}</td>
                    <td>${item.weight}</td>
                </tr>
            `;
            
            // Height értékek gyűjtése a statisztikához
            const heightNum = parseFloat(item.height);
            if (!isNaN(heightNum)) {
                heightValues.push(heightNum);
            }
        });
        
        htmlOutput += '</tbody></table>';
        adatokContainer.innerHTML = htmlOutput;
        
        // Height statisztika számítása és megjelenítése
        if (heightValues.length > 0) {
            const sum = heightValues.reduce((a, b) => a + b, 0);
            const avg = sum / heightValues.length;
            const max = Math.max(...heightValues);
            
            heightStatisztika.innerHTML = `
                <p><strong>Összeg:</strong> ${sum.toFixed(2)}</p>
                <p><strong>Átlag:</strong> ${avg.toFixed(2)}</p>
                <p><strong>Legnagyobb:</strong> ${max.toFixed(2)}</p>
            `;
            statisztikaContainer.style.display = 'block';
        } else {
            statisztikaContainer.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Hiba történt:', error);
        adatokContainer.innerHTML = `
            <p class="hiba-uzenet-container">Hiba történt az adatok lekérdezése közben: ${error.message}</p>
        `;
    }
}

// 2. Create művelet - Rekord létrehozása
async function rekordLetrehozasa() {
    // Beviteli mezők validálása
    if (!validateCreateForm()) {
        return;
    }
    
    // Adatok lekérése a mezőkből
    const name = createName.value;
    const height = createHeight.value;
    const weight = createWeight.value;
    
    try {
        // API hívás
        const formData = new FormData();
        formData.append('op', 'create');
        formData.append('code', userCode);
        formData.append('name', name);
        formData.append('height', height);
        formData.append('weight', weight);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });
        
        // Válasz feldolgozása
        if (!response.ok) {
            throw new Error(`Hiba történt: ${response.status}`);
        }
        
        const result = await response.text();
        
        // Eredmény megjelenítése
        if (result === '1') {
            createEredmeny.innerHTML = `
                <p class="siker-uzenet">Rekord sikeresen létrehozva!</p>
            `;
            
            // Mezők kiürítése
            createForm.reset();
            
            // Adatok frissítése
            adatokLekerdezese();
        } else {
            createEredmeny.innerHTML = `
                <p class="hiba-uzenet-container">A rekord létrehozása nem sikerült. Kérjük, próbálja újra.</p>
            `;
        }
        
    } catch (error) {
        console.error('Hiba történt:', error);
        createEredmeny.innerHTML = `
            <p class="hiba-uzenet-container">Hiba történt a rekord létrehozása közben: ${error.message}</p>
        `;
    }
}

// 3.a Update művelet - Adatok lekérése ID alapján
async function adatokLekereseId() {
    // Ellenőrzés, hogy van-e megadva ID
    const id = updateId.value;
    if (!id) {
        updateEredmeny.innerHTML = `
            <p class="hiba-uzenet-container">Kérjük, adjon meg egy érvényes ID-t!</p>
        `;
        return;
    }
    
    // Állapot jelzése
    updateEredmeny.innerHTML = '<p class="info-uzenet">Adatok lekérdezése folyamatban...</p>';
    
    try {
        // Először lekérjük az összes adatot
        const formData = new FormData();
        formData.append('op', 'read');
        formData.append('code', userCode);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });
        
        // Válasz feldolgozása
        if (!response.ok) {
            throw new Error(`Hiba történt: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Megfelelő rekord keresése
        const record = data.list.find(item => item.id == id);
        
        if (record) {
            // Adatok betöltése a mezőkbe
            updateName.value = record.name;
            updateHeight.value = record.height;
            updateWeight.value = record.weight;
            
            updateEredmeny.innerHTML = `
                <p class="siker-uzenet">Az adatok sikeresen betöltve! Most módosíthatja a mezőket.</p>
            `;
        } else {
            updateEredmeny.innerHTML = `
                <p class="hiba-uzenet-container">Nem található rekord a megadott ID-val: ${id}</p>
            `;
            updateForm.reset();
        }
        
    } catch (error) {
        console.error('Hiba történt:', error);
        updateEredmeny.innerHTML = `
            <p class="hiba-uzenet-container">Hiba történt az adatok lekérdezése közben: ${error.message}</p>
        `;
    }
}

// 3.b Update művelet - Rekord módosítása
async function rekordModositasa() {
    // ID ellenőrzése
    const id = updateId.value;
    if (!id) {
        updateEredmeny.innerHTML = `
            <p class="hiba-uzenet-container">Kérjük, adjon meg egy érvényes ID-t és kérje le az adatokat a módosítás előtt!</p>
        `;
        return;
    }
    
    // Beviteli mezők validálása
    if (!validateUpdateForm()) {
        return;
    }
    
    // Adatok lekérése a mezőkből
    const name = updateName.value;
    const height = updateHeight.value;
    const weight = updateWeight.value;
    
    try {
        // API hívás
        const formData = new FormData();
        formData.append('op', 'update');
        formData.append('code', userCode);
        formData.append('id', id);
        formData.append('name', name);
        formData.append('height', height);
        formData.append('weight', weight);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });
        
        // Válasz feldolgozása
        if (!response.ok) {
            throw new Error(`Hiba történt: ${response.status}`);
        }
        
        const result = await response.text();
        
        // Eredmény megjelenítése
        if (result === '1') {
            updateEredmeny.innerHTML = `
                <p class="siker-uzenet">Rekord sikeresen módosítva!</p>
            `;
            
            // Mezők kiürítése
            updateForm.reset();
            updateId.value = '';
            
            // Adatok frissítése
            adatokLekerdezese();
        } else {
            updateEredmeny.innerHTML = `
                <p class="hiba-uzenet-container">A rekord módosítása nem sikerült. Ellenőrizze, hogy a megadott ID létezik-e és a kód helyes-e.</p>
            `;
        }
        
    } catch (error) {
        console.error('Hiba történt:', error);
        updateEredmeny.innerHTML = `
            <p class="hiba-uzenet-container">Hiba történt a rekord módosítása közben: ${error.message}</p>
        `;
    }
}

// 4. Delete művelet - Rekord törlése
async function rekordTorlese() {
    // ID ellenőrzése
    const id = deleteId.value;
    if (!id) {
        deleteEredmeny.innerHTML = `
            <p class="hiba-uzenet-container">Kérjük, adjon meg egy érvényes ID-t!</p>
        `;
        return;
    }
    
    // Megerősítés kérése
    if (!confirm(`Biztosan törölni szeretné a(z) ${id} azonosítójú rekordot?`)) {
        return;
    }
    
    // Állapot jelzése
    deleteEredmeny.innerHTML = '<p class="info-uzenet">Rekord törlése folyamatban...</p>';
    
    try {
        // API hívás
        const formData = new FormData();
        formData.append('op', 'delete');
        formData.append('code', userCode);
        formData.append('id', id);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });
        
        // Válasz feldolgozása
        if (!response.ok) {
            throw new Error(`Hiba történt: ${response.status}`);
        }
        
        const result = await response.text();
        
        // Eredmény megjelenítése
        if (result === '1') {
            deleteEredmeny.innerHTML = `
                <p class="siker-uzenet">Rekord sikeresen törölve!</p>
            `;
            
            // Mező kiürítése
            deleteId.value = '';
            
            // Adatok frissítése
            adatokLekerdezese();
        } else {
            deleteEredmeny.innerHTML = `
                <p class="hiba-uzenet-container">A rekord törlése nem sikerült. Ellenőrizze, hogy a megadott ID létezik-e.</p>
            `;
        }
        
    } catch (error) {
        console.error('Hiba történt:', error);
        deleteEredmeny.innerHTML = `
            <p class="hiba-uzenet-container">Hiba történt a rekord törlése közben: ${error.message}</p>
        `;
    }
}

// Create form validáció
function validateCreateForm() {
    let isValid = true;
    
    // Name validálás
    if (!createName.value || createName.value.length > 30) {
        createNameHiba.textContent = 'A név mező kitöltése kötelező és maximum 30 karakter hosszú lehet!';
        isValid = false;
    } else {
        createNameHiba.textContent = '';
    }
    
    // Height validálás
    if (!createHeight.value || createHeight.value.length > 30) {
        createHeightHiba.textContent = 'A magasság mező kitöltése kötelező és maximum 30 karakter hosszú lehet!';
        isValid = false;
    } else {
        createHeightHiba.textContent = '';
    }
    
    // Weight validálás
    if (!createWeight.value || createWeight.value.length > 30) {
        createWeightHiba.textContent = 'A súly mező kitöltése kötelező és maximum 30 karakter hosszú lehet!';
        isValid = false;
    } else {
        createWeightHiba.textContent = '';
    }
    
    return isValid;
}

// Update form validáció
function validateUpdateForm() {
    let isValid = true;
    
    // Name validálás
    if (!updateName.value || updateName.value.length > 30) {
        updateNameHiba.textContent = 'A név mező kitöltése kötelező és maximum 30 karakter hosszú lehet!';
        isValid = false;
    } else {
        updateNameHiba.textContent = '';
    }
    
    // Height validálás
    if (!updateHeight.value || updateHeight.value.length > 30) {
        updateHeightHiba.textContent = 'A magasság mező kitöltése kötelező és maximum 30 karakter hosszú lehet!';
        isValid = false;
    } else {
        updateHeightHiba.textContent = '';
    }
    
    // Weight validálás
    if (!updateWeight.value || updateWeight.value.length > 30) {
        updateWeightHiba.textContent = 'A súly mező kitöltése kötelező és maximum 30 karakter hosszú lehet!';
        isValid = false;
    } else {
        updateWeightHiba.textContent = '';
    }
    
    return isValid;
}
