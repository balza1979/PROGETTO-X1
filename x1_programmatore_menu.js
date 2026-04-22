// ======================================================================
// FILE: x1_programmatore_menu.js
// LOGICA: MENU → SOTTOMENU → PARAMETRI → VALORI (JSON) → FILE (JSON)
// ======================================================================

// ----------------------------------------------------------------------
// UTILITÀ
// ----------------------------------------------------------------------

// Carica un file JSON (es: "1.0.00.json")
async function x1_caricaJSON(nomeFile) {
    const risposta = await fetch(nomeFile);
    if (!risposta.ok) {
        console.error("Errore fetch JSON:", nomeFile, risposta.status);
        throw new Error("Impossibile caricare " + nomeFile);
    }
    return await risposta.json();
}

// Converte il JSON nel formato:
// window.x1_file_parametri[id] = { descrizione:"", files:[...] }
function x1_convertiJSON(nomeFunzione, dati) {
    const blocco = dati[nomeFunzione];
    if (!blocco) {
        console.warn("Blocco JSON mancante per:", nomeFunzione);
        return {};
    }

    const risultato = {};
    Object.keys(blocco).forEach(id => {
        risultato[id] = {
            descrizione: blocco[id].descrizione || "",
            files: blocco[id].param || []
        };
    });
    return risultato;
}

// ----------------------------------------------------------------------
// AVVIO
// ----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    const selMenu      = document.getElementById("menu");
    const selSottomenu = document.getElementById("sottomenu");
    const selParametro = document.getElementById("parametro");
    const selValore    = document.getElementById("tendina_valori");

    x1_popolaMenu();

    selMenu.addEventListener("change", function () {
        x1_popolaSottomenu(this.value);
    });

    selSottomenu.addEventListener("change", function () {
        x1_popolaParametri(this.value);
    });

    selParametro.addEventListener("change", function () {
        const codice = this.value;
        const param = x1_parametri.find(p => p.PARAMETRO === codice);
        if (param) {
            x1_mostraInfoParametro(param);
            x1_popolaValori(param);
        }
    });

    selValore.addEventListener("change", function () {
        const parametro = document.getElementById("parametro").value;
        const idValore  = this.value;
        x1_mostraFilePerValore(parametro, idValore);
    });
});

// ----------------------------------------------------------------------
// MENU
// ----------------------------------------------------------------------
function x1_popolaMenu() {
    const selMenu = document.getElementById("menu");
    selMenu.innerHTML = "";

    const visti = new Set();

    x1_menu_struttura_data.forEach(riga => {
        const cod = String(riga.cod__menu).split(".")[0];
        if (!visti.has(cod)) {
            visti.add(cod);
            const opt = document.createElement("option");
            opt.value = cod;
            opt.textContent = riga.menu;
            selMenu.appendChild(opt);
        }
    });

    if (selMenu.options.length > 0) {
        selMenu.selectedIndex = 0;
        x1_popolaSottomenu(selMenu.value);
    }
}

// ----------------------------------------------------------------------
// SOTTOMENU
// ----------------------------------------------------------------------
function x1_popolaSottomenu(codMenu) {
    const selSottomenu = document.getElementById("sottomenu");
    selSottomenu.innerHTML = "";

    const lista = x1_menu_struttura_data.filter(riga =>
        String(riga.cod__menu).startsWith(codMenu + ".")
    );

    lista.forEach(riga => {
        const opt = document.createElement("option");
        opt.value = riga.cod__menu;
        opt.textContent = riga.sottomenu;
        selSottomenu.appendChild(opt);
    });

    if (selSottomenu.options.length > 0) {
        selSottomenu.selectedIndex = 0;
        x1_popolaParametri(selSottomenu.value);
    } else {
        x1_svuotaParametri();
    }
}

// ----------------------------------------------------------------------
// PARAMETRI
// ----------------------------------------------------------------------
function x1_svuotaParametri() {
    document.getElementById("parametro").innerHTML = "";
    document.getElementById("info_parametro").innerHTML = "";
    document.getElementById("tendina_valori").innerHTML = "";
}

async function x1_popolaParametri(codMenuCompleto) {

    const nomeFunzione = codMenuCompleto;

    try {
        const dati = await x1_caricaJSON(nomeFunzione + ".json");
        window.x1_file_parametri = x1_convertiJSON(nomeFunzione, dati);
    } catch (err) {
        console.error("Errore JSON:", err);
        window.x1_file_parametri = {};
    }

    const selParametro = document.getElementById("parametro");
    selParametro.innerHTML = "";

    // FIX: i tuoi parametri NON hanno suffisso
    let lista = x1_parametri.filter(p =>
        p.PARAMETRO === codMenuCompleto
    );

    if (lista.length === 0) {
        const menu = codMenuCompleto.split(".")[0];
        lista = x1_parametri.filter(p =>
            p.PARAMETRO.startsWith(menu + ".")
        );
    }

    lista.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.PARAMETRO;
        opt.textContent = p.PARAMETRO + " – " + (p.DESCRIZIONE || "");
        selParametro.appendChild(opt);
    });

    if (lista.length > 0) {
        selParametro.selectedIndex = 0;
        const primo = lista[0];
        x1_mostraInfoParametro(primo);
        x1_popolaValori(primo);
    }
}

// ----------------------------------------------------------------------
// INFO PARAMETRO
// ----------------------------------------------------------------------
function x1_mostraInfoParametro(param) {
    const box = document.getElementById("info_parametro");

    box.innerHTML = `
        <b>Codice:</b> ${param.PARAMETRO}<br>
        <b>Descrizione:</b> ${param.DESCRIZIONE || ""}<br>
        <b>Valore attuale (ID):</b> ${param.VALORE || ""}
    `;

    document.getElementById("codice_parametro").value      = param.PARAMETRO || "";
    document.getElementById("descrizione_parametro").value = param.DESCRIZIONE || "";
}

// ----------------------------------------------------------------------
// VALORI (SOLO JSON)
// ----------------------------------------------------------------------
function x1_popolaValori(param) {

    const tendina = document.getElementById("tendina_valori");
    tendina.innerHTML = "";

    const tabella = window.x1_file_parametri || {};
    const ids = Object.keys(tabella);

    if (ids.length === 0) return;

    const defaultID = (param.VALORE || "").trim();

    ids.sort();

    ids.forEach(id => {
        const info = tabella[id];
        const label = id + " " + (info.descrizione || "");

        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = label;
        tendina.appendChild(opt);
    });

    if (defaultID && tendina.querySelector(`option[value="${defaultID}"]`)) {
        tendina.value = defaultID;
    }

    x1_mostraFilePerValore(param.PARAMETRO, tendina.value);
}

// ----------------------------------------------------------------------
// FILE VAL1–VAL8 (SOLO JSON)
// ----------------------------------------------------------------------
function x1_mostraFilePerValore(parametro, idValore) {

    const tabella = window.x1_file_parametri || {};
    const info = tabella[idValore];

    if (!info) return;

    const files = info.files || [];

    for (let i = 0; i < 8; i++) {
        const btn = document.getElementById("val" + (i + 1));
        if (btn) {
            btn.textContent = files[i] || "—";
            btn.dataset.file = files[i] || "";
        }
    }
}

// ----------------------------------------------------------------------
// APRI FILE
// ----------------------------------------------------------------------
function x1_apriFileParametro(numero) {
    const btn = document.getElementById("val" + numero);
    if (!btn) return;

    const file = btn.dataset.file;
    if (!file) return;

    let path = "FILES/" + file;
    window.open(path, "_blank");
}
