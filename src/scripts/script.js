let selectedVertiefung = 'Informatik'; // Default Vertiefung

document.addEventListener('DOMContentLoaded', function() {
    const semesters = [3, 4, 5];
    let totalECTS = 0;

    // Event-Listener für das Dropdown-Menü
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            selectedVertiefung = this.getAttribute('data-vertiefung');
            document.getElementById('dropdownMenuButton').innerText = `Vertiefung: ${selectedVertiefung}`;
            console.log(`Selected Vertiefung: ${selectedVertiefung}`);
            updateProgressBars(); // Update progress bars when Vertiefung changes
        });
    });

    // Restore saved modules from localStorage
    semesters.forEach(semester => {
        const savedModules = JSON.parse(localStorage.getItem(`semester${semester}`)) || [];
        savedModules.forEach(module => {
            addModuleToSemester(semester, module.moduleId, module.moduleName, module.moduleECTS, module.modulePool, false);
        });
    });

    updateProgressBars();

    // Event-Listener für die "Hinzufügen"-Buttons
    semesters.forEach(semester => {
        document.getElementById(`add-module-semester${semester}`).addEventListener('click', function() {
            fetchModules(semester);
        });
    });
});

function fetchModules(semester) {
    console.log(`Fetching modules for semester ${semester}`);
    fetch(`http://152.53.51.64:3000/module`)
        .then(response => response.json())
        .then(modules => {
            console.log('Fetched modules:', modules);
            const pools = {
                Wahlpflicht: [],
                Wahlpflichtmodule: [],
                Ueberfachlich: [],
                ITVertiefung: [],
                BWLVertiefung: [],
                MedienVertiefung: []
            };

            modules.forEach(module => {
                const poolName = module.Pool.trim().replace(/\s+/g, '');
                if (pools[poolName]) {
                    pools[poolName].push(module);
                } else {
                    console.warn(`Unknown pool: ${module.Pool}`);
                }
            });

            console.log('Grouped modules by pool:', pools);

            let moduleList = '';
            for (const [pool, modules] of Object.entries(pools)) {
                if (modules.length > 0) {
                    moduleList += `<h5>${pool}</h5><ul>`;
                    modules.forEach(module => {
                        moduleList += `<li><a href="#" class="module-link" data-id="${module._id}" data-name="${module.ModulName}" data-ects="${module.ECTS}" data-pool="${pool}">${module.ModulName} (${module.ECTS} ECTS)</a></li>`;
                    });
                    moduleList += '</ul>';
                }
            }

            if (moduleList === '') {
                moduleList = '<p>Keine Module gefunden.</p>';
            }

            console.log('Generated module list HTML:', moduleList);

            const modal = document.createElement('div');
            modal.classList.add('modal', 'fade');
            modal.setAttribute('tabindex', '-1');
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Module</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${moduleList}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Schließen</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();

            document.querySelectorAll('.module-link').forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const moduleId = this.getAttribute('data-id');
                    const moduleName = this.getAttribute('data-name');
                    const moduleECTS = this.getAttribute('data-ects');
                    const modulePool = this.getAttribute('data-pool');
                    console.log(`Adding module to semester ${semester}:`, { moduleId, moduleName, moduleECTS, modulePool });
                    addModuleToSemester(semester, moduleId, moduleName, moduleECTS, modulePool, true);
                    bootstrapModal.hide();
                });
            });
        })
        .catch(error => console.error('Error fetching modules:', error));
}

function addModuleToSemester(semester, moduleId, moduleName, moduleECTS, modulePool, save = true) {
    const semesterTable = document.getElementById(`semester${semester}`);
    const newRow = semesterTable.insertRow();
    newRow.innerHTML = `
        <td data-module-id="${moduleId}" data-pool="${modulePool}">${moduleName}</td>
        <td>${moduleECTS}</td>
        <td><button class="btn btn-danger btn-sm remove-module"><i class="bi bi-trash-fill"></i></button></td>
    `;

    console.log(`Modul hinzugefügt zu Semester ${semester}:`, { moduleId, moduleName, moduleECTS, modulePool });

    // Save to localStorage
    if (save) {
        const savedModules = JSON.parse(localStorage.getItem(`semester${semester}`)) || [];
        savedModules.push({ moduleId, moduleName, moduleECTS, modulePool });
        localStorage.setItem(`semester${semester}`, JSON.stringify(savedModules));
    }

    // Update total ECTS and progress bars
    updateProgressBars();
}

// Event-Delegation für das Entfernen von Modulen
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-module') || event.target.closest('.remove-module')) {
        const row = event.target.closest('tr');
        const semester = row.closest('tbody').id.replace('semester', '');
        const moduleCell = row.cells[0];
        const moduleId = moduleCell.dataset.moduleId;
        const moduleName = moduleCell.textContent;
        const moduleECTS = parseInt(row.cells[1].textContent);
        const modulePool = moduleCell.dataset.pool;

        removeModuleFromSemester(moduleId, moduleName, moduleECTS, modulePool, semester);
    }
});

function removeModuleFromSemester(moduleId, moduleName, moduleECTS, modulePool, semester) {
    console.log(`Removing module from semester ${semester}:`, { moduleId, moduleName, moduleECTS, modulePool });
    const semesterTable = document.getElementById(`semester${semester}`);
    const rows = semesterTable.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells[0].textContent === moduleName && parseInt(cells[1].textContent) === moduleECTS) {
            semesterTable.deleteRow(i);
            console.log(`Modul entfernt aus Semester ${semester}:`, { moduleId, moduleName, moduleECTS, modulePool });
            break;
        }
    }

    // Remove from localStorage
    const savedModules = JSON.parse(localStorage.getItem(`semester${semester}`)) || [];
    const updatedModules = savedModules.filter(module => module.moduleId !== moduleId);
    localStorage.setItem(`semester${semester}`, JSON.stringify(updatedModules));

    // Update total ECTS and progress bars
    updateProgressBars();
}

function calculateECTSByPool() {
    const semesters = [3, 4, 5];
    const ectsByPool = {
        Wahlpflicht: 0,
        Wahlpflichtmodule: 0,
        Ueberfachlich: 0,
        ITVertiefung: 0,
        BWLVertiefung: 0,
        MedienVertiefung: 0
    };

    semesters.forEach(semester => {
        const semesterTable = document.getElementById(`semester${semester}`);
        const rows = semesterTable.getElementsByTagName('tr');

        for (let row of rows) {
            const cells = row.getElementsByTagName('td');
            const moduleName = cells[0].innerText;
            const ects = parseInt(cells[1].innerText);
            const modulePool = cells[0].getAttribute('data-pool');

            if (modulePool) {
                ectsByPool[modulePool] += ects;
            }
        }
    });

    return ectsByPool;
}

function updateProgressBars() {
    const ectsByPool = calculateECTSByPool();
    let wahlECTS = ectsByPool.Wahlpflicht + ectsByPool.Wahlpflichtmodule;
    let uebfECTS = ectsByPool.Ueberfachlich;
    let vertiefungECTS = 0;
  
    if (selectedVertiefung === 'Informatik') {
      vertiefungECTS = ectsByPool.ITVertiefung;
      wahlECTS += ectsByPool.BWLVertiefung + ectsByPool.MedienVertiefung;
    } else if (selectedVertiefung === 'BWL') {
      vertiefungECTS = ectsByPool.BWLVertiefung;
      wahlECTS += ectsByPool.ITVertiefung + ectsByPool.MedienVertiefung;
    } else if (selectedVertiefung === 'Medien') {
      vertiefungECTS = ectsByPool.MedienVertiefung;
      wahlECTS += ectsByPool.ITVertiefung + ectsByPool.BWLVertiefung;
    }
  
    // Übertragung überschüssiger ECTS vom Vertiefungspool zum Wahlpflichtpool
    if (vertiefungECTS > 24) {
      wahlECTS += vertiefungECTS - 24;
      vertiefungECTS = 24;
    }
  
    // Übertragung überschüssiger ECTS vom Überfachlichen Pool zum Wahlpflichtpool
    if (uebfECTS > 12) {
      wahlECTS += uebfECTS - 12;
      uebfECTS = 12;
    }
  
    // Aktualisierung der Fortschrittsbalken
    document.getElementById('wahl-ects').style.width = `${(wahlECTS / 39) * 100}%`;
    document.getElementById('wahl-ects').innerText = `${wahlECTS}/39`;
    document.getElementById('wahl-ects').setAttribute('aria-valuenow', wahlECTS);
  
    document.getElementById('uebf').style.width = `${(uebfECTS / 12) * 100}%`;
    document.getElementById('uebf').innerText = `${uebfECTS}/12`;
    document.getElementById('uebf').setAttribute('aria-valuenow', uebfECTS);
  
    document.getElementById('vertiefung-ects').style.width = `${(vertiefungECTS / 24) * 100}%`;
    document.getElementById('vertiefung-ects').innerText = `${vertiefungECTS}/24`;
    document.getElementById('vertiefung-ects').setAttribute('aria-valuenow', vertiefungECTS);
  }