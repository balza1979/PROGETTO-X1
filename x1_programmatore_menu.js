// ======================================================================
// FILE: x1_programmatore_menu.js
// LOGICA: MENU → SOTTOMENU → PARAMETRI → VALORI → FILE (JSON)
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
// window.x1_file_parametri[idValore] = { files:[...], testo:"..." }
function x1_convertiJSON(nomeFunzione, dati) {
    const blocco = dati[nomeFunzione];
    if (!blocco) {
        console.warn("Blocco JSON mancante per:", nomeFunzione);
        return {};
    }

    const risultato = {};
    Object.keys(blocco).forEach(id => {
        const riga = blocco[id] || {};
        risultato[id] = {
            files: riga.param || [],
            testo: riga.testo || riga.label || riga.descrizione || ""
        };
    });
    return risultato;
}

// Non strippiamo l’ID, solo trim
function x1_pulisciValore(v) {
    return (v || "").trim();
}

// Estrae i primi 2 numeri dal valore (es: "03 APB..." → "03")
function x1_estraiID(valore) {
    const match = (valore || "").match(/^(\d{2})/);
    return match ? match[1] : null;
}

// ----------------------------------------------------------------------
// AVVIO
// ----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    const selMenu      = document.getElementById("menu");
    const selSottomenu = document.getElementById("sottomenu");
    const selParametro = document.getElementById("parametro");
    const selValore    = document.getElementById("tendina_valori");

    // Popola subito il MENU
    x1_popolaMenu();

    // Cambio MENU → ricarica SOTTOMENU
    selMenu.addEventListener("change", function () {
        x1_popolaSottomenu(this.value);
    });

    // Cambio SOTTOMENU → ricarica PARAMETRI
    selSottomenu.addEventListener("change", function () {
        x1_popolaParametri(this.value);
    });

    // Cambio PARAMETRO → info + valori
    selParametro.addEventListener("change", function () {
        const codice = this.value;
        const param = x1_parametri.find(p => p.PARAMETRO === codice);
        if (param) {
            x1_mostraInfoParametro(param);
            x1_popolaValori(param);
        }
    });

    // Cambio VALORE → aggiorna bottoni file
    selValore.addEventListener("change", function () {
        const parametro = document.getElementById("parametro").value;
        const idValore  = this.value; // ora è solo ID (es: "03")
        x1_mostraFilePerValore(parametro, idValore);
    });

    // FRECCIA SU
    document.getElementById("parametro_up").addEventListener("click", () => {
        const sel = document.getElementById("parametro");
        if (sel.selectedIndex > 0) {
            sel.selectedIndex--;
            const param = x1_parametri.find(p => p.PARAMETRO === sel.value);
            if (param) {
                x1_mostraInfoParametro(param);
                x1_popolaValori(param);
            }
        }
    });

    // FRECCIA GIÙ
    document.getElementById("parametro_down").addEventListener("click", () => {
        const sel = document.getElementById("parametro");
        if (sel.selectedIndex < sel.options.length - 1) {
            sel.selectedIndex++;
            const param = x1_parametri.find(p => p.PARAMETRO === sel.value);
            if (param) {
                x1_mostraInfoParametro(param);
                x1_popolaValori(param);
            }
        }
    });
});

// ----------------------------------------------------------------------
// MENU
// ----------------------------------------------------------------------
function x1_popolaMenu() {
    const selMenu = document.getElementById("menu");
    selMenu.innerHTML = "";

    const visti = new Set();

    // x1_menu_struttura_data viene da x1_menu_struttura_data.js
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
        opt.value = riga.cod__menu;   // es: "1.0.00"
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

// Carica JSON + popola lista parametri
async function x1_popolaParametri(codMenuCompleto) {
    // codMenuCompleto es: "1.0.00"
    const nomeFunzione = codMenuCompleto;

    try {
        const dati = await x1_caricaJSON(nomeFunzione + ".json");
        // mappa: idValore → { files:[...], testo:"..." }
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

    const prefisso = codMenuCompleto + ".";   // es: "1.0.00."

    // x1_parametri viene da x1_parametri_data.js
    let lista = x1_parametri.filter(p =>
        p.PARAMETRO && p.PARAMETRO.startsWith(prefisso)
    );

    // fallback: se non trova nulla, usa solo il menu principale
    if (lista.length === 0) {
        const menu = codMenuCompleto.split(".")[0];
        lista = x1_parametri.filter(p =>
            p.PARAMETRO && p.PARAMETRO.startsWith(menu + ".")
        );
    }

    lista.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.PARAMETRO; // es: "1.0.00.03"
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
        <b>Valore di default (grezzo CSV):</b> ${x1_pulisciValore(param.VALORE || "")}
    `;

    document.getElementById("codice_parametro").value      = param.PARAMETRO || "";
    document.getElementById("descrizione_parametro").value = param.DESCRIZIONE || "";
}

// ----------------------------------------------------------------------
// VALORI DEL PARAMETRO (da JSON, non più dal CSV)
// ----------------------------------------------------------------------
function x1_popolaValori(param) {
    const tendina = document.getElementById("tendina_valori");
    tendina.innerHTML = "";

    const tabella = window.x1_file_parametri || {};
    const ids = Object.keys(tabella);
    if (ids.length === 0) {
        // niente JSON → nessuna tendina
        return;
    }

    // Valore di default grezzo dal CSV (es: "02")
    const defaultRaw = x1_pulisciValore(param.VALORE || "");
    const defaultID  = x1_estraiID(defaultRaw) || defaultRaw;

    // Ordino gli ID
    ids.sort();

    ids.forEach(id => {
        const info = tabella[id] || {};
        const testo = info.testo || "";
        const label = (testo ? (id + " " + testo) : id);

        const opt = document.createElement("option");
        opt.value = id;        // SOLO ID (es: "03")
        opt.textContent = label;
        tendina.appendChild(opt);
    });

    // Se possibile seleziono il valore di default
    if (defaultID && tendina.options.length > 0) {
        for (let i = 0; i < tendina.options.length; i++) {
            if (tendina.options[i].value === defaultID) {
                tendina.selectedIndex = i;
                break;
            }
        }
    } else if (tendina.options.length > 0) {
        tendina.selectedIndex = 0;
    }

    // Aggiorno i file per il valore selezionato
    if (tendina.options.length > 0) {
        const idSelezionato = tendina.value;
        x1_mostraFilePerValore(param.PARAMETRO, idSelezionato);
    }

    // Campi unità / min / max (per ora vuoti, da CSV o altro in futuro)
    document.getElementById("unita_misura").value = "";
    document.getElementById("val_min").value      = "";
    document.getElementById("val_max").value      = "";
}

// ----------------------------------------------------------------------
// FILE ASSOCIATI → POPOLA BOTTONI VAL1–VAL8
// ----------------------------------------------------------------------
function x1_mostraFilePerValore(parametro, idValore) {
    // parametro es: "1.0.00.03"
    // idValore es: "03"

    if (!window.x1_file_parametri) return;

    const tabella = window.x1_file_parametri;
    const info = tabella[idValore];
    if (!info) return;

    const files = Array.isArray(info.files) ? info.files : info;

    // Popolo i bottoni VAL1–VAL8
    for (let i = 0; i < 8; i++) {
        const btn = document.getElementById("val" + (i + 1));
        if (btn) {
            btn.textContent = files[i] || "—";
            btn.dataset.file = files[i] || "";
        }
    }
}

// ----------------------------------------------------------------------
// APRI FILE (usato da VAL1–VAL8)
// ----------------------------------------------------------------------
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
