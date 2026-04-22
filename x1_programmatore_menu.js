// ======================================================================
// FILE: x1_programmatore_menu.js
// VERSIONE: 22/04/2026 – 22:39
// ======================================================================


// ---------------------- UTILITÀ ----------------------
async function x1_caricaJSON(nomeFile) {
    const risposta = await fetch(nomeFile);
    if (!risposta.ok) return {};
    return await risposta.json();
}

function x1_convertiJSON(nomeFunzione, dati) {
    const blocco = dati[nomeFunzione];
    if (!blocco) return {};

    const out = {};
    Object.keys(blocco).forEach(id => {
        out[id] = {
            descrizione: blocco[id].descrizione || "",
            param: blocco[id].param || []
        };
    });
    return out;
}


// ---------------------- AVVIO ----------------------
document.addEventListener("DOMContentLoaded", () => {

    x1_popolaMenu();

    document.getElementById("menu").addEventListener("change", async e => {

        await x1_popolaSottomenu(e.target.value);

        const primoSottomenu = document.getElementById("sottomenu").value;

        const listaParam = x1_parametri.filter(p =>
            p.PARAMETRO.startsWith(primoSottomenu + ".")
        );

        if (listaParam.length === 0) {

            document.getElementById("info_parametro").innerHTML = "Parametro non previsto";

            const tendina = document.getElementById("tendina_valori");
            tendina.innerHTML = "";
            const opt = document.createElement("option");
            opt.textContent = "Database non previsto";
            tendina.appendChild(opt);

            x1_pulisciPulsantiValori();
            x1_svuotaParametri();

            return;
        }
    });

    document.getElementById("sottomenu").addEventListener("change", async e => {
        await x1_popolaParametri(e.target.value);
    });

    document.getElementById("parametro").addEventListener("change", async e => {

        const codice = e.target.value;
        const nomeFile = codice + ".json";

        const dati = await x1_caricaJSON(nomeFile);

        if (!dati || Object.keys(dati).length === 0) {

            const tendina = document.getElementById("tendina_valori");
            tendina.innerHTML = "";
            const opt = document.createElement("option");
            opt.textContent = "Database non previsto";
            tendina.appendChild(opt);

            x1_pulisciPulsantiValori();
            document.getElementById("info_parametro").innerHTML = "";
            return;
        }

        window.x1_file_parametri = x1_convertiJSON(codice, dati);

        const param = x1_parametri.find(p => p.PARAMETRO === codice);

        if (!param) {
            document.getElementById("info_parametro").innerHTML = "Parametro non previsto";
            x1_svuotaValori();
            x1_pulisciPulsantiValori();
            return;
        }

        x1_mostraInfoParametro(param);
        x1_popolaValori(param);
    });

    document.getElementById("tendina_valori").addEventListener("change", e => {
        x1_mostraFilePerValore(e.target.value);
    });

    for (let i = 1; i <= 8; i++) {
        document.getElementById("val" + i).addEventListener("click", function () {
            const file = this.dataset.file;
            if (file) x1_apriFile(file);
        });
    }

});


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

    if (sel.options.length === 0) {
        x1_svuotaParametri();
        x1_svuotaValori();
        x1_pulisciPulsantiValori();
    }
}


// ---------------------- PARAMETRI ----------------------
async function x1_popolaParametri(codMenuCompleto) {

    const sel = document.getElementById("parametro");
    sel.innerHTML = "";

    const lista = x1_parametri.filter(p =>
        p.PARAMETRO.startsWith(codMenuCompleto + ".")
    );

    if (lista.length === 0) {
        x1_svuotaParametri();
        return;
    }

    lista.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.PARAMETRO;
        opt.textContent = p.PARAMETRO + " – " + (p.DESCRIZIONE || "");
        sel.appendChild(opt);
    });

    sel.selectedIndex = 0;
    sel.dispatchEvent(new Event("change"));
}


// ---------------------- VALORI ----------------------
function x1_mostraInfoParametro(param) {
    document.getElementById("info_parametro").innerHTML = `
        <b>Codice:</b> ${param.PARAMETRO}<br>
        <b>Descrizione:</b> ${param.DESCRIZIONE}<br>
        <b>Valore attuale:</b> ${param.VALORE}
    `;
}

function x1_popolaValori(param) {

    const tendina = document.getElementById("tendina_valori");
    tendina.innerHTML = "";

    if (!window.x1_file_parametri) {
        x1_svuotaValori();
        return;
    }

    Object.keys(window.x1_file_parametri).forEach(id => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = id + " – " + window.x1_file_parametri[id].descrizione;
        tendina.appendChild(opt);
    });

    let defaultIndex = 0;
    let valoreDefault = String(param.VALORE || "").trim();
    valoreDefault = valoreDefault.replace(/"/g, "").trim();

    if (valoreDefault.length > 2) {
        valoreDefault = valoreDefault.slice(-2);
    }

    for (let i = 0; i < tendina.options.length; i++) {
        if (tendina.options[i].value === valoreDefault) {
            defaultIndex = i;
            break;
        }
    }

    tendina.selectedIndex = defaultIndex;

    x1_mostraFilePerValore(tendina.value);
}


// ---------------------- FILE ----------------------
function x1_mostraFilePerValore(valore) {

    if (!window.x1_file_parametri ||
        !window.x1_file_parametri[valore]) {

        const tendina = document.getElementById("tendina_valori");
        tendina.innerHTML = "";
        const opt = document.createElement("option");
        opt.textContent = "Valore non previsto";
        tendina.appendChild(opt);

        x1_pulisciPulsantiValori();
        return;
    }

    const files = window.x1_file_parametri[valore].param;

    for (let i = 1; i <= 8; i++) {
        const btn = document.getElementById("val" + i);

        if (!files[i - 1] || files[i - 1].trim() === "") {
            btn.textContent = "–";
            btn.dataset.file = "";
            btn.disabled = true;
            continue;
        }

        btn.textContent = files[i - 1];
        btn.dataset.file = files[i - 1];
        btn.disabled = false;
    }
}

function x1_apriFile(nomeFile) {
    if (!nomeFile) return;
    window.open(nomeFile, "_blank");
}


// ---------------------- PULIZIE ----------------------
function x1_svuotaValori() {
    document.getElementById("tendina_valori").innerHTML = "";
}

function x1_svuotaParametri() {
    document.getElementById("parametro").innerHTML = "";
}

function x1_pulisciPulsantiValori() {
    for (let i = 1; i <= 8; i++) {
        const btn = document.getElementById("val" + i);
        btn.textContent = "–";
        btn.dataset.file = "";
        btn.disabled = true;
    }
}

