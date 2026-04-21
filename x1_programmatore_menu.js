// ======================================================================
// FILE: x1_programmatore_menu.js
// DESCRIZIONE: Logica MENU → SOTTOMENU → PARAMETRI → VALORI
// AUTORE: Luca + Copilot
// DATA: 17/04/2026
// ======================================================================

// Richiede che siano già caricati:
// - x1_menu_struttura_data.js
// - x1_parametri_data.js

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
});

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

// ======================================================================
// PARAMETRI → POPOLA
// ======================================================================

function x1_popolaParametri(codMenuCompleto) {
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
	console.log("PARAM:", param.PARAMETRO, "VALORE:", param.VALORE);

    const tendina = document.getElementById("tendina_valori");
    tendina.innerHTML = "";

    // 1) Caso speciale: parametro 1.0.00
    if (param.PARAMETRO === "1.0.00") {

        // Popola tendina
        x1_param_1_0_00.forEach(voce => {
            const opt = document.createElement("option");
            const pulita = x1_pulisciValore(voce);
            opt.value = pulita;
            opt.textContent = pulita;
            tendina.appendChild(opt);
        });

        // Seleziona valore grezzo
        const id = x1_pulisciValore(param.VALORE);
        for (let i = 0; i < tendina.options.length; i++) {
            if (tendina.options[i].textContent.includes(id)) {
                tendina.selectedIndex = i;
                break;
            }
        }

        // 🔥 QUI: azzera unità/min/max
        document.getElementById("unita_misura").value = "/";
        document.getElementById("val_min").value = "/";
        document.getElementById("val_max").value = "/";

        return;
    }
// PARAMETRO 1.0.01
if (param.PARAMETRO === "1.0.01") {

    tendina.innerHTML = "";

    x1_param_1_0_01.forEach(voce => {
        const opt = document.createElement("option");
        const pulita = x1_pulisciValore(voce);
        opt.value = pulita;
        opt.textContent = pulita;
        tendina.appendChild(opt);
    });

    const id = x1_pulisciValore(param.VALORE);
    for (let i = 0; i < tendina.options.length; i++) {
        if (tendina.options[i].textContent.includes(id)) {
            tendina.selectedIndex = i;
            break;
        }
    }

    document.getElementById("unita_misura").value = "/";
    document.getElementById("val_min").value = "/";
    document.getElementById("val_max").value = "/";

    return; // <--- fondamentale
}


// PARAMETRO 1.0.02
if (param.PARAMETRO === "1.0.02") {

    tendina.innerHTML = "";

    x1_param_1_0_02.forEach(voce => {
        const opt = document.createElement("option");
        const pulita = x1_pulisciValore(voce);
        opt.value = pulita;
        opt.textContent = pulita;
        tendina.appendChild(opt);
    });

    const id = x1_pulisciValore(param.VALORE);
    for (let i = 0; i < tendina.options.length; i++) {
        if (tendina.options[i].textContent.includes(id)) {
            tendina.selectedIndex = i;
            break;
        }
    }

    document.getElementById("unita_misura").value = "/";
    document.getElementById("val_min").value = "/";
    document.getElementById("val_max").value = "/";

    return;
}

	


    // 2) Metodo standard per gli altri parametri
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

    document.getElementById("unita_misura").value = "";
    document.getElementById("val_min").value = "";
    document.getElementById("val_max").value = "";
}


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
