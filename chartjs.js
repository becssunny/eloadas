// ChartJS funkcionalitás

// Dokumentum betöltődése után
document.addEventListener('DOMContentLoaded', function() {
    // DOM elemek lekérése
    const tablaSorok = document.querySelectorAll('#jegyek-tabla tbody tr');
    const diagramVaszon = document.getElementById('jegyek-diagram');
    const diagramCim = document.getElementById('diagram-cim');
    
    // Diagram objektum
    let jegyekDiagram = null;
    
    // Tantárgyak listája
    const tantargyak = ['Matematika', 'Informatika', 'Fizika', 'Angol', 'Történelem'];
    
    // Diagram színek
    const diagramSzinek = {
        hatter: 'rgba(76, 175, 80, 0.2)',
        keret: 'rgba(76, 175, 80, 1)',
        pont: 'rgba(76, 175, 80, 1)'
    };
    
    // Inicializáljuk a diagramot
    initDiagram();
    
    // Táblázat soraira kattintás eseménykezelője
    tablaSorok.forEach(sor => {
        sor.addEventListener('click', function() {
            // Kiválasztás jelzése
            tablaSorok.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            
            // Diák nevének lekérése
            const diakNev = this.getAttribute('data-nev');
            
            // Jegyek lekérése a sorból
            const jegyek = [];
            for (let i = 1; i < this.cells.length; i++) {
                jegyek.push(parseInt(this.cells[i].textContent));
            }
            
            // Diagram frissítése
            frissitDiagram(diakNev, jegyek);
        });
    });
    
    // Diagram inicializálása
    function initDiagram() {
        // Diagram konfiguráció
        const config = {
            type: 'line',
            data: {
                labels: tantargyak,
                datasets: [{
                    label: 'Jegyek',
                    data: [],
                    backgroundColor: diagramSzinek.hatter,
                    borderColor: diagramSzinek.keret,
                    pointBackgroundColor: diagramSzinek.pont,
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        stepSize: 1,
                        title: {
                            display: true,
                            text: 'Jegy (1-5)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tantárgy',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                return tantargyak[tooltipItems[0].dataIndex];
                            },
                            label: function(context) {
                                return 'Jegy: ' + context.raw;
                            }
                        }
                    }
                }
            }
        };
        
        // Diagram létrehozása
        jegyekDiagram = new Chart(diagramVaszon, config);
    }
    
    // Diagram frissítése a kiválasztott diák adataival
    function frissitDiagram(diakNev, jegyek) {
        // Diagram címének frissítése
        diagramCim.textContent = diakNev + ' jegyei';
        
        // Diagram adatainak frissítése
        jegyekDiagram.data.datasets[0].label = diakNev + ' jegyei';
        jegyekDiagram.data.datasets[0].data = jegyek;
        
        // Diagram újrarajzolása
        jegyekDiagram.update();
    }
    
    // Első sor kiválasztása alapértelmezettként
    if (tablaSorok.length > 0) {
        tablaSorok[0].click();
    }
});
