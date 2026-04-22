// =========================================================
//  PROGRAMMATORE – LOGICA MENU / SOTTOMENU / PARAMETRI / VALORI
//  Versione FUNZIONANTE – Coerente con formato X.Y.ZZ
// =========================================================


// -----------------------------
// 1) RIFERIMENTI AI CAMPI
// -----------------------------
const menuSelect = document.getElementById("menu_select");
const submenuSelect = document.getElementById("submenu_select");
const parametroSelect = document.getElementById("parametro_select");
const valoreSelect = document.getElementById("valore_select");

const infoCodice = document.getElementById("info_codice");
const infoDescrizione = document.getElementById("info_descrizione");
const infoValore = document.getElementById("info_valore");

const tasti = [
    document.getElementById("file1"),
    document.getElementById("file2"),
    document.getElementById("file3"),
    document.getElementById("file4"),
    document.getElementById("file5"),
    document.getElementById("file6"),
    document.getElementById("file7"),
    document.getElementById("file8")
];


// -----------------------------
// 2) FUNZIONI DI UTILITÀ
// -----------------------------
function svuotaSotto() {
    parametroSelect.innerHTML = "";
    valoreSelect.innerHTML = "";
    infoCodice.textContent = "";
    infoDescrizione.textContent = "";
    infoValore.textContent = "";
    tasti.forEach(t => t.textContent = "–");
}

function creaOption(testo, valore) {
    const opt = document.createElement("option");
    opt.textContent = testo;
    opt.value = valore;
    return opt;
}

function placeholderZZ(codiceXY) {
    return codiceXY + ".ZZ";
}


// -----------------------------
// 3) CAMBIO MENU
// -----------------------------
menuSelect.addEventListener("change", () => {
    const menu = menuSelect.value;
    submenuSelect.innerHTML = "";
    svuotaSotto();

    const sotto = menu_struttura.filter(s => s.startsWith(menu + "."));

    if (sotto.length === 0) {
        const codice = placeholderZZ(menu + ".0");
        submenuSelect.appendChild(creaOption(`Sottomenu ${codice} non previsto`, codice));
    } else {
        sotto.forEach(s => submenuSelect.appendChild(creaOption(s, s)));
    }

    // ⭐ FORZA CAMBIO SOTTOMENU
    submenuSelect.dispatchEvent(new Event("change"));
});


// -----------------------------
// 4) CAMBIO SOTTOMENU
// -----------------------------
submenuSelect.addEventListener("change", () => {
    const sm = submenuSelect.value;
    parametroSelect.innerHTML = "";
    svuotaSotto();

    const param = parametri.filter(p => p.startsWith(sm + "."));

    if (param.length === 0) {
        const codice = placeholderZZ(sm);
        parametroSelect.appendChild(creaOption(`Parametri ${codice} non previsti`, codice));
    } else {
        param.forEach(p => parametroSelect.appendChild(creaOption(p, p)));
    }

    // ⭐ FORZA CAMBIO PARAMETRO
    parametroSelect.dispatchEvent(new Event("change"));
});


// -----------------------------
// 5) CAMBIO PARAMETRO
// -----------------------------
parametroSelect.addEventListener("change", () => {
    const codice = parametroSelect.value;
    valoreSelect.innerHTML = "";
    infoCodice.textContent = codice;
    infoDescrizione.textContent = "";
    infoValore.textContent = "";
    tasti.forEach(t => t.textContent = "–");

    if (codice.endsWith(".ZZ")) {
        valoreSelect.appendChild(creaOption(`Database non previsto per ${codice}`, codice));
        return;
    }

    const jsonFile = `json/${codice}.json`;

    fetch(jsonFile)
        .then(r => r.json())
        .then(data => {
            if (!data.valori || data.valori.length === 0) {
                valoreSelect.appendChild(creaOption(`Database non previsto per ${codice}`, codice));
                return;
            }

            data.valori.forEach(v => valoreSelect.appendChild(creaOption(v.nome, JSON.stringify(v))));
        })
        .catch(() => {
            valoreSelect.appendChild(creaOption(`Database non previsto per ${codice}`, codice));
        })
        .finally(() => {
            // ⭐ FORZA CAMBIO VALORE
            valoreSelect.dispatchEvent(new Event("change"));
        });
});


// -----------------------------
// 6) CAMBIO VALORE
// -----------------------------
valoreSelect.addEventListener("change", () => {
    const raw = valoreSelect.value;

    if (!raw || raw.startsWith("Database")) {
        infoDescrizione.textContent = "";
        infoValore.textContent = "";
        tasti.forEach(t => t.textContent = "–");
        return;
    }

    const v = JSON.parse(raw);

    infoDescrizione.textContent = v.descrizione || "";
    infoValore.textContent = v.valore || "";

    tasti.forEach((t, i) => {
        const file = v.file && v.file[i] ? v.file[i] : "";
        t.textContent = file !== "" ? file : "–";
    });
});


// =========================================================
//  ⭐ STATO INIZIALE – MENU 0
// =========================================================
window.addEventListener("load", () => {
    menuSelect.value = "0";
    menuSelect.dispatchEvent(new Event("change"));
});
