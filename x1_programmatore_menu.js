//// ==== INIZIO BLOCCO 1 ====

// ======================================================================
// FILE: x1_programmatore_menu.js
// DESCRIZIONE: Logica MENU → SOTTOMENU → PARAMETRI → VALORI + FILE (JSON VERSION)
// AUTORE: Luca + Copilot
// DATA: 22/04/2026
// ======================================================================


// ======================================================================
// FUNZIONI JSON
// ======================================================================

// Carica un file JSON (es: "1.0.00.json")
async function x1_caricaJSON(nomeFile) {
    const risposta = await fetch(nomeFile);
    const dati = await risposta.json();
    return dati;
}

// Converte il JSON nel formato richiesto da x1_file_parametri
function x1_convertiJSON(nomeFunzione, dati) {
    const blocco = dati[nomeFunzione];
    if (!blocco) return {};

    const risultato = {};

    Object.keys(blocco).forEach(id => {
        risultato[id] = blocco[id].param;
    });

    return risultato;
}


// ======================================================================
// AVVIO
// ======================================================================
document.addEventListener("DOMContentLoaded", function () {

    const selMenu       = document.getElementById("menu");
    const selSottomenu  = document.getElementById("sottomenu");
    const selParametro  = document.getElementById("parametro");
    const selValore     = document.getElementById("tendina_valori");

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
        const valore = this.value;
        x1_mostraFilePerValore(parametro, valore);
    });
});

//// ==== FINE BLOCCO 1 ====
//// ==== INIZIO BLOCCO 2 ====

// ======================================================================
// MENU
// ======================================================================
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


// ======================================================================
// SOTTOMENU
// ======================================================================
function x1_popolaSottomenu(codMenu) {
    const selSottomenu = document.getElementById("sottomenu");
    selSottomenu.innerHTML = "";

    const lista = x1_menu_struttura_data.filter(riga => {
        return String(riga.cod__menu).startsWith(codMenu + ".");
    });

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


// ======================================================================
// PARAMETRI
// ======================================================================
function x1_svuotaParametri() {
    document.getElementById("parametro").innerHTML = "";
    document.getElementById("info_parametro").innerHTML = "";
}

//// ==== FINE BLOCCO 2 ====
//// ==== INIZIO BLOCCO 3 ====

// ======================================================================
// PARAMETRI → POPOLA
// ======================================================================
async function x1_popolaParametri(codMenuCompleto) {

    // CARICA JSON
    const nomeFunzione = codMenuCompleto;

    try {
        const dati = await x1_caricaJSON(nomeFunzione + ".json");
        window.x1_file_parametri = x1_convertiJSON(nomeFunzione, dati);
    } catch (err) {
        console.error("Errore nel caricamento JSON:", err);
        window.x1_file_parametri = {};
    }

    const selParametro = document.getElementById("parametro");
    const selValore    = document.getElementById("tendina_valori");
    const boxInfo      = document.getElementById("info_parametro");

    selParametro.innerHTML = "";
    selValore.innerHTML    = "";
    boxInfo.innerHTML      = "";

    const prefisso = codMenuCompleto + ".";

    let lista = x1_parametri.filter(p => {
        return p.PARAMETRO && p.PARAMETRO.startsWith(prefisso);
    });

    if (lista.length === 0) {
        const menu = codMenuCompleto.split(".")[0];
        lista = x1_parametri.filter(p => p.PARAMETRO.startsWith(menu + "."));
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

        document.getElementById("codice_parametro").value = primo.PARAMETRO || "";
        document.getElementById("descrizione_parametro").value = primo.DESCRIZIONE || "";
    }
}


// ======================================================================
// INFO PARAMETRO
// ======================================================================
function x1_mostraInfoParametro(param) {
    const box = document.getElementById("info_parametro");

    box.innerHTML = `
        <b>Codice:</b> ${param.PARAMETRO}<br>
        <b>Descrizione:</b> ${param.DESCRIZIONE}<br>
        <b>Valore grezzo:</b> ${x1_pulisciValore(param.VALORE)}
    `;

    document.getElementById("codice_parametro").value = param.PARAMETRO || "";
    document.getElementById("descrizione_parametro").value = param.DESCRIZIONE || "";
}


// ======================================================================
// VALORI
// ======================================================================
function x1_popolaValori(param) {

    const tendina = document.getElementById("tendina_valori");
    tendina.innerHTML = "";

    const raw = param.VALORE || "";
    if (!raw) return;

    const parti = raw.split(";").map(v => v.trim()).filter(v => v !== "");

    parti.forEach(voce => {
        const opt = document.createElement("option");
        const pulita = x1_pulisciValore(voce);
        opt.value = pulita;
        opt.textContent = pulita;
        tendina.appendChild(opt);
    });

    const valoreSelezionato = tendina.value;
    x1_mostraFilePerValore(param.PARAMETRO, valoreSelezionato);

    document.getElementById("unita_misura").value = "";
    document.getElementById("val_min").value = "";
    document.getElementById("val_max").value = "";
}

//// ==== FINE BLOCCO 3 ====
//// ==== INIZIO BLOCCO 4 ====

// ======================================================================
// ESTRATTORE ID (primi due numeri)
// ======================================================================
function x1_estraiID(valore) {
    const match = valore.match(/^(\d{2})/);
    return match ? match[1] : null;
}


// ======================================================================
// FILE ASSOCIATI → POPOLA BOTTONI
// ======================================================================
function x1_mostraFilePerValore(parametro, valorePulito) {
console.log("PARAMETRO:", parametro);
console.log("VALORE:", valorePulito);

    if (!window.x1_file_parametri) return;

  const idFunzione = parametro.split(".")[0] + "." + parametro.split(".")[1];
const tabella = x1_file_parametri[idFunzione];

    if (!tabella) return;

    const id = x1_estraiID(valorePulito);
    if (!id) return;

    const files = tabella[id];
    if (!files) return;

    for (let i = 0; i < 8; i++) {
        const btn = document.getElementById("val" + (i + 1));
        if (btn) {
            btn.textContent = files[i] || "—";
            btn.dataset.file = files[i] || "";
        }
    }
}


// ======================================================================
// APRI FILE
// ======================================================================
function x1_apriFileParametro(numero) {

    const btn = document.getElementById("val" + numero);
    if (!btn) return;

    const file = btn.dataset.file;
    if (!file) return;

    let path = "FILES/" + file;

    if (!file.includes(".")) {
        path = "FILES/" + file + ".JPG";
    }

    window.open(path, "_blank");
}


// ======================================================================
// FRECCE SU/GIÙ
// ======================================================================
document.getElementById("parametro_up").addEventListener("click", () => {
    const sel = document.getElementById("parametro");
    if (sel.selectedIndex > 0) {
        sel.selectedIndex--;
        const param = x1_parametri.find(p => p.PARAMETRO === sel.value);
        x1_mostraInfoParametro(param);
        x1_popolaValori(param);
    }
});

document.getElementById("parametro_down").addEventListener("click", () => {
    const sel = document.getElementById("parametro");
    if (sel.selectedIndex < sel.options.length - 1) {
        sel.selectedIndex++;
        const param = x1_parametri.find(p => p.PARAMETRO === sel.value);
        x1_mostraInfoParametro(param);
        x1_popolaValori(param);
    }
});

//// ==== FINE BLOCCO 4 ====

