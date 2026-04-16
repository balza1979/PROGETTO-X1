// ============================================================
// X1 – Programmatore
// LOGICA MENU + SOTTOMENU
// Data: 2026-04-16 – CEST
// Autore: Luca + Copilot
// ============================================================

// Usa i dati convertiti in x1_menu_struttura_data.js

// ------------------------------------------------------------
// Popola MENU (codici prima del punto)
// ------------------------------------------------------------
function x1_popolaMenu() {
  const menuSelect = document.getElementById("menu_select");
  if (!menuSelect) return;

  menuSelect.innerHTML = "<option value=''>— seleziona MENU —</option>";

  x1Struttura.forEach(row => {
    const codice = row[0];
    const menu = row[1];

    // MENU = codici X.0, X.1, X.2... ma raggruppati per X
    const numeroMenu = codice.split(".")[0];

    // Evita duplicati
    if (!menuSelect.querySelector(`option[value="${numeroMenu}"]`)) {
      const opt = document.createElement("option");
      opt.value = numeroMenu;
     opt.textContent = menu;   // mostra solo "1 = MANOVRA"
      menuSelect.appendChild(opt);
    }
  });
}

// ------------------------------------------------------------
// Popola SOTTOMENU (codici X.Y)
// ------------------------------------------------------------
function x1_popolaSottomenu(menuCode) {
  const subSelect = document.getElementById("submenu_select");
  if (!subSelect) return;

  subSelect.innerHTML = "<option value=''>— seleziona SOTTOMENU —</option>";

  x1Struttura.forEach(row => {
    const codice = row[0];
    const sottomenu = row[2];

    if (codice.startsWith(menuCode + ".") && sottomenu && sottomenu.trim() !== "") {
    const opt = document.createElement("option");
    opt.value = codice;
    opt.textContent = `${sottomenu}`;
    subSelect.appendChild(opt);
}

  });
}

// ------------------------------------------------------------
// Collegamento eventi
// ------------------------------------------------------------
function x1_collegaEventiMenu() {
  const menuSelect = document.getElementById("menu_select");

  menuSelect.addEventListener("change", () => {
    x1_popolaSottomenu(menuSelect.value);
  });
}

// ------------------------------------------------------------
// Inizializzazione
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  x1_collegaEventiMenu();
  x1_popolaMenu();
});
