// --- KONFIGURATION & DATEN ---
const dbData = [
    { first: "Anna", last: "Schmidt", role: "Dev", status: "Active", reason: "Mutterschutz" },
    { first: "Max", last: "Mustermann", role: "Manager", status: "Inactive", reason: "Krankheit" },
    { first: "Julia", last: "Weber", role: "HR", status: "Active", reason: "Urlaub" },
    { first: "Tim", last: "Meyer", role: "Sales", status: "Inactive", reason: "Sabbatical" },
    { first: "Lisa", last: "Wagner", role: "Support", status: "Active", reason: "Kündigung" }
];

// Synonyme für Buttons (Chaos Faktor)
const synonymsDelete = ["Entfernen", "Löschen", "Deaktivieren", "Vernichten", "Austragen", "Eliminieren"];
const synonymsAdd = ["Hinzufügen", "Erstellen", "Anlegen", "Registrieren", "Einfügen", "Aufnehmen"];

// --- DOM ELEMENTE ---
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const formArea = document.getElementById('formArea');
const dynamicFields = document.getElementById('dynamicFields');
const generalStatus = document.getElementById('generalStatus');
const feedbackContainer = document.getElementById('feedback-container');

// --- INIT PHASE 1 (Tabelle) ---
dbData.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${row.first}</td>
        <td>${row.last}</td>
        <td>${row.role}</td>
        <td style="color:${row.status === 'Active' ? 'green' : 'red'}; font-weight:bold;">${row.status}</td>
        <td>${row.reason}</td>
    `;
    tableBody.appendChild(tr);
});

// Navigation Phase 1 -> 2
document.getElementById('btnStartProcess').addEventListener('click', () => {
    document.getElementById('view-dispatcher').classList.add('hidden');
    document.getElementById('view-performer').classList.remove('hidden');
});

// --- PHASE 2 LOGIK ---
document.getElementById('btnSearch').addEventListener('click', () => {
    const query = searchInput.value.toLowerCase().trim();
    const foundUser = dbData.find(p => p.last.toLowerCase() === query);

    // Reset UI
    resetFeedbackUI();
    formArea.classList.add('hidden');
    dynamicFields.innerHTML = '';
    document.getElementById('actionButtons').innerHTML = '';

    // 1. EXISTENZ ANZEIGEN (Zufällige Methode 1-5)
    showExistenceFeedback(!!foundUser);

    if (foundUser) {
        // 2. FORMULAR VORBEREITEN
        formArea.classList.remove('hidden');
        
        // Status für den Bot anzeigen (Entscheidungsgrundlage)
        const statusDisplay = document.getElementById('display-status');
        statusDisplay.innerText = foundUser.status; // "Active" oder "Inactive"
        statusDisplay.style.color = foundUser.status === 'Active' ? 'green' : 'red';

        // Felder generieren
        generateChaosFormFields(foundUser);

        // Buttons generieren (Bot muss entscheiden)
        generateDecisionButtons(foundUser.status);
    }
});

// --- HELPER: 5 WEGE DER EXISTENZ ANZEIGE ---
function showExistenceFeedback(exists) {
    feedbackContainer.classList.remove('hidden');
    
    // Wähle eine Zahl zwischen 1 und 5
    const mode = Math.floor(Math.random() * 5) + 1;
    console.log("Feedback Mode:", mode); // Für Debugging

    // Alle verstecken
    ['fb-text', 'fb-checkbox', 'fb-input', 'fb-icon', 'fb-color'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });

    switch(mode) {
        case 1: // Text Nachricht
            const txt = document.getElementById('fb-text');
            txt.classList.remove('hidden');
            txt.innerText = exists ? "ERGEBNIS: User in Datenbank gefunden." : "ERGEBNIS: User unbekannt.";
            txt.style.color = exists ? "blue" : "grey";
            break;

        case 2: // Checkbox State
            const boxDiv = document.getElementById('fb-checkbox');
            boxDiv.classList.remove('hidden');
            document.getElementById('chk-found').checked = exists;
            break;

        case 3: // Input Value
            const inpDiv = document.getElementById('fb-input');
            inpDiv.classList.remove('hidden');
            document.getElementById('inp-exist-code').value = exists ? "TRUE_FOUND" : "FALSE_404";
            break;

        case 4: // Visuelles Icon (Emoji)
            const icoDiv = document.getElementById('fb-icon');
            icoDiv.classList.remove('hidden');
            document.getElementById('icon-display').innerText = exists ? "✅" : "❌";
            break;

        case 5: // Background Color Class
            const colDiv = document.getElementById('fb-color');
            colDiv.classList.remove('hidden');
            colDiv.className = exists ? "mode-color-found" : "mode-color-missing";
            document.getElementById('color-msg').innerText = exists ? "Grüner Bereich (Gefunden)" : "Roter Bereich (Fehlt)";
            break;
    }
}

function resetFeedbackUI() {
    feedbackContainer.classList.add('hidden');
    const colDiv = document.getElementById('fb-color');
    colDiv.className = ""; // Klassen entfernen
}

// --- HELPER: ENTSCHEIDUNGS BUTTONS ---
function generateDecisionButtons(status) {
    const container = document.getElementById('actionButtons');
    
    // Synonyme holen
    const labelDel = synonymsDelete[Math.floor(Math.random() * synonymsDelete.length)];
    const labelAdd = synonymsAdd[Math.floor(Math.random() * synonymsAdd.length)];

    // Buttons erzeugen
    const btnDel = document.createElement('button');
    btnDel.type = "button"; // Kein Submit standardmäßig
    btnDel.className = "btn btn-danger";
    btnDel.innerText = labelDel;
    
    const btnAdd = document.createElement('button');
    btnAdd.type = "button";
    btnAdd.className = "btn btn-success";
    btnAdd.innerText = labelAdd;

    // Klick Handler mit Logik Prüfung
    btnDel.onclick = () => validateDecision("Active", status);
    btnAdd.onclick = () => validateDecision("Inactive", status);

    // Zufällige Reihenfolge der Buttons (Chaos)
    if (Math.random() > 0.5) {
        container.appendChild(btnDel);
        container.appendChild(btnAdd);
    } else {
        container.appendChild(btnAdd);
        container.appendChild(btnDel);
    }
}

function validateDecision(actionRequiredForStatus, currentStatus) {
    // Logik: 
    // Wenn Status = Active -> Bot muss Button für "Active" Logik drücken (Löschen)
    // Wenn Status = Inactive -> Bot muss Button für "Inactive" Logik drücken (Hinzufügen)
    
    if (currentStatus === actionRequiredForStatus) {
        alert("KORREKT! Der Bot hat die richtige Aktion für den Status '" + currentStatus + "' gewählt.");
        // Reset
        formArea.classList.add('hidden');
        searchInput.value = "";
        resetFeedbackUI();
    } else {
        alert("FEHLER! Falsche Aktion für Status '" + currentStatus + "'.");
    }
}

// --- HELPER: CHAOS FORMULAR FELDER (aus Original) ---
function generateChaosFormFields(dataObj) {
    // Felder Liste
    let fields = [
        { id: "f_first", label: "Vorname", type: "text" },
        { id: "f_last", label: "Nachname", type: "text" },
        { id: "f_role", label: "Rolle", type: "text" },
        { id: "f_email", label: "Email", type: "text" },
        { id: "f_reason", label: "Grund", type: "polymorph" }
    ];

    // Shuffle
    fields = fields.sort(() => Math.random() - 0.5);

    fields.forEach(f => {
        const container = document.createElement('div');
        container.className = "form-group";
        const labelFirst = Math.random() > 0.5;
        
        const label = document.createElement('label');
        label.className = "form-label";
        label.innerText = f.label;
        
        let input;
        if (f.type === "polymorph") {
            input = createPolymorphInput(f.id);
        } else {
            input = document.createElement('input');
            input.type = "text";
            input.className = "input-std";
        }

        if (labelFirst) {
            container.appendChild(label);
            container.appendChild(input);
        } else {
            container.appendChild(input);
            container.appendChild(label);
        }
        dynamicFields.appendChild(container);
    });
}

function createPolymorphInput(id) {
    const mode = Math.floor(Math.random() * 3); 
    const options = ["Urlaub", "Krankheit", "Kündigung", "Mutterschutz", "Sabbatical"];

    if (mode === 0) {
        const sel = document.createElement('select');
        sel.id = id;
        options.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o;
            opt.innerText = o;
            sel.appendChild(opt);
        });
        return sel;
    } else if (mode === 1) {
        const div = document.createElement('div');
        div.id = id;
        options.slice(0, 3).forEach(o => { 
            const lbl = document.createElement('label');
            lbl.style.marginRight = "10px";
            lbl.innerHTML = `<input type="radio" name="${id}_r" value="${o}"> ${o}`;
            div.appendChild(lbl);
        });
        return div;
    } else {
        const inp = document.createElement('input');
        inp.type = "text";
        inp.id = id;
        inp.placeholder = "Grund eingeben...";
        return inp;
    }
}
