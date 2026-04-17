// ======================================================================
// FILE: x1_programmatore_menu.js
// DESCRIZIONE: Logica MENU → SOTTOMENU → PARAMETRI → VALORI
// AUTORE: Luca + Copilot
// DATA: 17/04/2026
// ======================================================================

// Richiede che siano già caricati:
// - x1_menu_struttura_data.js  → const x1_menu_struttura_data = [...];
// - x1_parametri_data.js       → const x1_parametri = [...];

document.addEventListener("DOMContentLoaded", function () {

    const selMenu       = document.getElementById("menu");
    const selSottomenu  = document.getElementById("sottomenu");
    const selParametro  = document.getElementById("parametro");
    const selValore     = document.getElementById("valore");

    // 1) Popola il MENU
    x1_popolaMenu();

    // 2) Cambio MENU → aggiorna SOTTOMENU
    selMenu.addEventListener("change", function () {
        x1_popolaSottomenu(this.value);
        x1_svuotaParametri();
    });

    // 3) Cambio SOTTOMENU → aggiorna PARAMETRI
    selSottomenu.addEventListener("change", function () {
        x1_popolaParametri(this.value);
    });

    // 4) Cambio PARAMETRO → aggiorna INFO + VALORI
    selParametro.addEventListener("change", function () {
        const codice = this.value;
        const param = x1_parametri.find(p => p.PARAMETRO === codice);
        if (param) {
            x1_mostraInfoParametro(param);
            x1_popolaValori(param);
        }
    });
});

// ======================================================================
// MENU
// ======================================================================

function x1_popolaMenu() {
    const selMenu = document.getElementById("menu");
    selMenu.innerHTML = "";

    const visti = new Set();

    x1_menu_struttura_data.forEach(riga => {
        const cod = String(riga.cod__menu).split(".")[0]; // "1", "2", "3"...
        if (!visti.has(cod)) {
            visti.add(cod);

            const opt = document.createElement("option");
            opt.value = cod;
            opt.textContent = riga.menu; // es: "1 = MANOVRA"
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
        opt.value = riga.cod__menu;     // es: "1.2"
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
    document.getElementById("valore").innerHTML = "";
    document.getElementById("info_parametro").innerHTML = "";
}

function x1_popolaParametri(codMenuCompleto) {
    const selParametro = document.getElementById("parametro");
    const selValore    = document.getElementById("valore");
    const boxInfo      = document.getElementById("info_parametro");

    selParametro.innerHTML = "";
    selValore.innerHTML    = "";
    boxInfo.innerHTML      = "";

    const prefisso = codMenuCompleto + ".";

    const lista = x1_parametri.filter(p => {
        return p.PARAMETRO && p.PARAMETRO.startsWith(prefisso);
    });

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

// ======================================================================
// INFO PARAMETRO + VALORI
// ======================================================================

function x1_mostraInfoParametro(param) {
    const box = document.getElementById("info_parametro");

    box.innerHTML = `
        <b>Codice:</b> ${param.PARAMETRO}<br>
        <b>Descrizione:</b> ${param.DESCRIZIONE}<br>
        <b>Valore grezzo:</b> ${param.VALORE}
    `;
}

function x1_popolaValori(param) {
    const selValore = document.getElementById("valore");
    selValore.innerHTML = "";

    const raw = param.VALORE || "";
    if (!raw) return;

    const parti = raw.split(";").map(v => v.trim()).filter(v => v !== "");

    parti.forEach(voce => {
        let codice = voce;
        let descr  = voce;

        if (voce.includes("=")) {
            const pezzi = voce.split("=");
            codice = pezzi[0].trim();
            descr  = pezzi[1].trim();
        }

        const opt = document.createElement("option");
        opt.value = codice;
        opt.textContent = codice + " – " + descr;
        selValore.appendChild(opt);
    });
}
