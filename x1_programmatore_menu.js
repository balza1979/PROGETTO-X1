// ======================================================
//  X1 PROGRAMMATORE – POPOLAMENTO MENU E SOTTOMENU
//  Compatibile con struttura a OGGETTI di x1_menu_struttura_data.js
// ======================================================

// ------------------------------
// POPOLA MENU PRINCIPALE
// ------------------------------
function x1_popolaMenu() {
    const selectMenu = document.getElementById("menu");
    selectMenu.innerHTML = ""; // pulizia

    // Estrae tutti i valori "menu" e rimuove duplicati
    const listaMenu = [...new Set(x1_menu_struttura_data.map(r => r.menu))];

    // Ordina alfabeticamente (opzionale)
    listaMenu.sort();

    // Inserisce le opzioni
    listaMenu.forEach(menu => {
        const opt = document.createElement("option");
        opt.value = menu;
        opt.textContent = menu;
        selectMenu.appendChild(opt);
    });

    // Dopo aver popolato il menu, popola il sottomenu del primo elemento
    if (listaMenu.length > 0) {
        x1_popolaSottomenu(listaMenu[0]);
    }
}

// ------------------------------
// POPOLA SOTTOMENU IN BASE AL MENU SELEZIONATO
// ------------------------------
function x1_popolaSottomenu(menuSelezionato) {
    const selectSottomenu = document.getElementById("sottomenu");
    selectSottomenu.innerHTML = ""; // pulizia

    // Filtra le righe che appartengono al menu selezionato
    const listaSottomenu = x1_menu_struttura_data
        .filter(r => r.menu === menuSelezionato)
        .map(r => r.sottomenu);

    // Rimuove duplicati
    const unici = [...new Set(listaSottomenu)];

    // Inserisce le opzioni
    unici.forEach(sotto => {
        const opt = document.createElement("option");
        opt.value = sotto;
        opt.textContent = sotto;
        selectSottomenu.appendChild(opt);
    });
}

// ------------------------------
// EVENTO CAMBIO MENU
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const selectMenu = document.getElementById("menu");

    // Popola menu all'avvio
    x1_popolaMenu();

    // Quando cambia il menu → aggiorna sottomenu
    selectMenu.addEventListener("change", function () {
        x1_popolaSottomenu(this.value);
    });
});
