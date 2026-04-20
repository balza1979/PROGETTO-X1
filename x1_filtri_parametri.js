// ======================================================================
// FILE: x1_filtri_parametri.js
// DESCRIZIONE: Funzioni di pulizia e normalizzazione valori parametri
// AUTORE: Luca + Copilot
// DATA: 17/04/2026 – 18:15
// ======================================================================


// ------------------------------------------------------------
// PULIZIA BASE (dal convertitore CSV ? JS)
// ------------------------------------------------------------
function pulisci(str) {
    if (!str) return "";
    str = str.replace(/""/g, '"');        // doppie virgolette ? singola
    str = str.replace(/^"+|"+$/g, "");    // rimuove virgolette ai bordi
	
    return str.trim();


}


// ------------------------------------------------------------
// NORMALIZZAZIONE MORSETTO (ID)
// ------------------------------------------------------------
function normalizzaMorsetto(str) {
    if (!str) return "";
    str = str.replace(/"\s*"/g, '"');     // "   " ? "
    str = str.replace(/"\s*\(/, ' (');    // " ( ?  (
    let match = str.match(/^([A-Za-z0-9]+)\s*(.*)$/);
    if (!match) return str;
    let morsetto = match[1];
    let resto = match[2].trim();
    return `"${morsetto}" ${resto}`;
}


// ------------------------------------------------------------
// ESCAPE PER JS (non usato ora, ma utile per generazione file)
// ------------------------------------------------------------
function escapeJS(str) {
    if (!str) return "";
    return str
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
}


// ------------------------------------------------------------
// MASTER: PULIZIA COMPLETA PER IL PROGRAMMATORE
// ------------------------------------------------------------
function x1_pulisciValore(raw) {

    if (!raw) return "";

    // TAGLIO DI SICUREZZA: se c'è il blocco Edge, tronca prima
    const idx = raw.indexOf("# User's Edge browser tabs metadata");
    if (idx !== -1) {
        raw = raw.substring(0, idx);
    }

    // 1) pulizia base
    let p = pulisci(raw);

    // 2) normalizzazione ID/morsetto
    p = normalizzaMorsetto(p);
	// elimina virgolette isolate tra numero e testo:  "02" " APB ? "02" APB
p = p.replace(/"\s+"/g, '" ');
    return p.trim();
}
