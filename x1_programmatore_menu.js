// ======================================================================
// FILE: x1_programmatore_menu.js
// LOGICA: MENU → SOTTOMENU → PARAMETRI → VALORI (JSON) → FILE (JSON)
// ======================================================================

// ---------------------- UTILITÀ ----------------------
async function x1_caricaJSON(nomeFile) {
    const risposta = await fetch(nomeFile);
    if (!risposta.ok) {
        console.error("Errore fetch JSON:", nomeFile, risposta.status);
        return {};
    }
    return await risposta.json();
}

function x1_convertiJSON(nomeFunzione, dati) {
    const blocco = dati[nomeFunzione];
    if (!blocco) return {};

    const out = {};
    Object.keys(blocco).forEach(id => {
        out[id] = {
            descrizione: blocco[id].descrizione || "",
            files: blocco[id].param || []
        };
    });
    return out;
}

// ---------------------- AVVIO ----------------------
document.addEventListener("DOMContentLoaded", () => {
    x1_popolaMenu();

    document.getElementById("menu").addEventListener("change", e => {
        x1_popolaSottomenu(e.target.value);
    });

    document.getElementById("sottomenu").addEventListener("change", e => {
        x1_popolaParametri(e.target.value);
    });

    document.getElementById("parametro").addEventListener("change", async e => {

        const codice = e.target.value;   // esempio: "1.0.01"
        const nomeFile = codice + ".json";

        // Carica il JSON del parametro selezionato
        const dati = await x1_caricaJSON(nomeFile);

        if (!dati || Object.keys(dati).length === 0) {

            const tendina = document.getElementById("tendina_valori");
            tendina.innerHTML = "";

            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = `Database "${codice}" non previsto`;
            tendina.appendChild(opt);

            // Pulisce i pulsanti FILE
            for (let i = 1; i <= 8; i++) {
                const btn = document.getElementById("val" + i);
                btn.textContent = "—";
                btn.dataset.file = "";
            }

            return;
        }

        // Converte il JSON corretto
        window.x1_file_parametri = x1_convertiJSON(codice, dati);

        // Trova il parametro nella lista
        const param = x1_parametri.find(p => p.PARAMETRO === codice);

        if (param) {
            x1_mostraInfoParametro(param);
            x1_popolaValori(param);
        }
    });

    document.getElementById("tendina_valori").addEventListener("change", e => {
        const parametro = document.getElementById("parametro").value;
        x1_mostraFilePerValore(parametro, e.target.value);
    });

}); //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
     //  CHIUSURA CORRETTA DI DOMContentLoaded

// ---------------------- MENU ----------------------
function x1_popolaMenu() {
    const sel = document.getElementById("menu");
    sel.innerHTML = "";

    const visti = new Set();

    x1_menu_struttura_data.forEach(r => {
        const cod = String(r.cod__menu).split(".")[0];
        if (!visti.has(cod)) {
            visti.add(cod);
            const opt = document.createElement("option");
            opt.value = cod;
            opt.textContent = r.menu;
            sel.appendChild(opt);
        }
    });

    if (sel.options.length > 0) {
        sel.selectedIndex = 0;
        x1_popolaSottomenu(sel.value);
    }
}

// ---------------------- SOTTOMENU ----------------------
function x1_popolaSottomenu(codMenu) {
    const sel = document.getElementById("sottomenu");
    sel.innerHTML = "";

    const lista = x1_menu_struttura_data.filter(r =>
        String(r.cod__menu).startsWith(codMenu + ".")
    );

    lista.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.cod__menu;
        opt.textContent = r.sottomenu;
        sel.appendChild(opt);
    });

    if (sel.options.length > 0) {
        sel.selectedIndex = 0;
        x1_popolaParametri(sel.value);
    } else {
        x1_svuotaParametri();
    }
}

// ---------------------- PARAMETRI ----------------------
async function x1_popolaParametri(codMenuCompleto) {

    const nomeFunzione = codMenuCompleto + ".00";
    const dati = await x1_caricaJSON(nomeFunzione + ".json");

    // SE IL JSON NON ESISTE → PULIZIA + MESSAGGIO
   if (!dati || Object.keys(dati).length === 0) {

    const tendina = document.getElementById("tendina_valori");
    tendina.innerHTML = "";

    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = `Database "${codice}" non previsto`;
    tendina.appendChild(opt);

    // Pulisce i pulsanti FILE
    for (let i = 1; i <= 8; i++) {
        const btn = document.getElementById("val" + i);
        btn.textContent = "—";
        btn.dataset.file = "";
    }

    return;
}


    // SE IL JSON ESISTE → PROCEDO
    window.x1_file_parametri = x1_convertiJSON(nomeFunzione, dati);

    const sel = document.getElementById("parametro");
    sel.innerHTML = "";

    const lista = x1_parametri.filter(p => p.PARAMETRO.startsWith(codMenuCompleto + "."));

    lista.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.PARAMETRO;
        opt.textContent = p.PARAMETRO + " – " + (p.DESCRIZIONE || "");
        sel.appendChild(opt);
    });

    if (lista.length > 0) {
        sel.selectedIndex = 0;
        x1_mostraInfoParametro(lista[0]);
        x1_popolaValori(lista[0]);
    }
}


// ---------------------- INFO PARAMETRO ----------------------
function x1_mostraInfoParametro(param) {
    document.getElementById("info_parametro").innerHTML = `
        <b>Codice:</b> ${param.PARAMETRO}<br>
        <b>Descrizione:</b> ${param.DESCRIZIONE}<br>
        <b>Valore attuale:</b> ${param.VALORE}
    `;
}

// ---------------------- VALORI ----------------------
function x1_popolaValori(param) {
    const tendina = document.getElementById("tendina_valori");
    tendina.innerHTML = "";

    const tab = window.x1_file_parametri;
    const ids = Object.keys(tab);

    ids.sort().forEach(id => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = id + " " + tab[id].descrizione;
        tendina.appendChild(opt);
    });

    if (param.VALORE && tendina.querySelector(`option[value="${param.VALORE}"]`)) {
        tendina.value = param.VALORE;
    }

    x1_mostraFilePerValore(param.PARAMETRO, tendina.value);
}

// ---------------------- FILE ----------------------
function x1_mostraFilePerValore(parametro, idValore) {
    const info = window.x1_file_parametri[idValore];
    if (!info) return;

    const files = info.files;

    for (let i = 0; i < 8; i++) {
        const btn = document.getElementById("val" + (i + 1));
        btn.textContent = files[i] || "—";
        btn.dataset.file = files[i] || "";
    }
}

function x1_apriFileParametro(n) {
    const file = document.getElementById("val" + n).dataset.file;
    if (file) window.open("FILES/" + file, "_blank");
}
