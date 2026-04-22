// ======================================================================
// FILE: x1_programmatore_menu.js
// LOGICA: MENU → SOTTOMENU → PARAMETRI → VALORI (JSON) → FILE (JSON)
// ======================================================================

// ---------------------- UTILITÀ  ----------------------
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

  document.getElementById("menu").addEventListener("change", async e => {
    await x1_popolaSottomenu(e.target.value);
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
function x1_cambiaParametro(direzione) {
    const sel = document.getElementById("parametro");
    let idx = sel.selectedIndex;

    if (idx < 0) return;

    if (direzione === "su") {
        if (idx > 0) idx--;
    } else if (direzione === "giu") {
        if (idx < sel.options.length - 1) idx++;
    }

    sel.selectedIndex = idx;

    // Simula il cambio parametro → richiama l’evento change
    const evento = new Event("change");
    sel.dispatchEvent(evento);
}
document.getElementById("parametro_up").addEventListener("click", () => {
    x1_cambiaParametro("su");
});

document.getElementById("parametro_down").addEventListener("click", () => {
    x1_cambiaParametro("giu");
});

// ---------------------- MENU  ----------------------
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

// ---------------------- SOTTOMENU  ----------------------
async function x1_popolaSottomenu(codMenu) {
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

        // Popola i parametri del nuovo sottomenu
        await x1_popolaParametri(sel.value);

        // FORZA il cambio parametro → reset corretto
        const parametro = document.getElementById("parametro");
        if (parametro.options.length > 0) {
            parametro.selectedIndex = 0;
            parametro.dispatchEvent(new Event("change"));
        }

    } else {
        x1_svuotaParametri();
    }
}

// ---------------------- PARAMETRI ----------------------
// [22/04/2026 - 18:20] FIX completo funzione x1_popolaParametri
// Motivo: doppia dichiarazione "const sel" rompeva la select PARAMETRO → rimaneva vuota → tasti sempre “—”

async function x1_popolaParametri(codMenuCompleto) {

    const sel = document.getElementById("parametro");
    sel.innerHTML = "";

    const nomeFunzione = codMenuCompleto + ".00";
    const dati = await x1_caricaJSON(nomeFunzione + ".json");

    // JSON NON ESISTE
    if (!dati || Object.keys(dati).length === 0) {

        // PARAMETRO
        sel.innerHTML = "";
        const optPar = document.createElement("option");
        optPar.value = "";
        optPar.textContent = `Menu ${codMenuCompleto} non ha parametri`;
        sel.appendChild(optPar);

        // VALORI
        const tendina = document.getElementById("tendina_valori");
        tendina.innerHTML = "";
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = `Database "${nomeFunzione}" non previsto`;
        tendina.appendChild(opt);

        // FILE
        for (let i = 1; i <= 8; i++) {
            const btn = document.getElementById("val" + i);
            btn.textContent = "—";
            btn.dataset.file = "";
        }

        return;
    }

    // JSON ESISTE
    window.x1_file_parametri = x1_convertiJSON(nomeFunzione, dati);

    const lista = x1_parametri.filter(p => p.PARAMETRO.startsWith(codMenuCompleto + "."));

    lista.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.PARAMETRO;
        opt.textContent = p.PARAMETRO + " – " + (p.DESCRIZIONE || "");
        sel.appendChild(opt);
    });

    // SE CI SONO PARAMETRI
    if (lista.length > 0) {

        sel.selectedIndex = 0;

        const paramObj = {
            PARAMETRO: lista[0].PARAMETRO,
            DESCRIZIONE: lista[0].DESCRIZIONE,
            VALORE: lista[0].VALORE
        };

        // Imposta il parametro nella select
        sel.value = paramObj.PARAMETRO;

        // Aggiorna UI
        x1_mostraInfoParametro(paramObj);
        x1_popolaValori(paramObj);
    }
}

//// ---------------------- VALORI  ----------------------
function x1_mostraInfoParametro(param) {
    document.getElementById("info_parametro").innerHTML = `
        <b>Codice:</b> ${param.PARAMETRO}<br>
        <b>Descrizione:</b> ${param.DESCRIZIONE}<br>
        <b>Valore attuale:</b> ${param.VALORE}
    `;
}

// ---------------------- VALORI ----------------------
// [22/04/2026 - 17:50] Inserita funzione x1_popolaValori
// Motivo: popola la tendina dei valori e richiama l'aggiornamento dei pulsanti

function x1_popolaValori(param) {

    const tendina = document.getElementById("tendina_valori");
    tendina.innerHTML = "";

    // Se non esiste il JSON convertito → svuota tutto
    if (!window.x1_file_parametri || !window.x1_file_parametri[param.PARAMETRO]) {

        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = `Nessun valore disponibile`;
        tendina.appendChild(opt);

        x1_pulisciPulsantiValori();
        return;
    }

    const valori = window.x1_file_parametri[param.PARAMETRO];

    // Popola la tendina valori
    Object.keys(valori).forEach(id => {
        const opt = document.createElement("option");
        opt.value = id;   // <-- VALORE CORRETTO (solo "00", "01", ecc.)
        opt.textContent = id + " – " + valori[id].descrizione;
        tendina.appendChild(opt);
    });

    // Seleziona il primo valore
    tendina.selectedIndex = 0;

    // Aggiorna i pulsanti
    x1_mostraFilePerValore(tendina.value);
}

// [22/04/2026 - 17:50] Evento cambio tendina valori
document.getElementById("tendina_valori").addEventListener("change", function () {
    x1_mostraFilePerValore(this.value);
});

// ---------------------- FILE ----------------------
function x1_mostraFilePerValore(valore) {

    const parametroSel = document.getElementById("parametro").value;

    // Se manca tutto → pulizia
    if (!window.x1_file_parametri ||
        !window.x1_file_parametri[parametroSel] ||
        !window.x1_file_parametri[parametroSel][valore]) {

        x1_pulisciPulsantiValori();
        return;
    }

    const files = window.x1_file_parametri[parametroSel][valore].param;

    // Aggiorna i pulsanti
    for (let i = 1; i <= 8; i++) {
        const btn = document.getElementById("val" + i);

        if (files[i - 1]) {
            btn.textContent = files[i - 1];
            btn.dataset.file = files[i - 1];
            btn.disabled = false;
        } else {
            btn.textContent = "—";
            btn.dataset.file = "";
            btn.disabled = true;
        }
    }
}

