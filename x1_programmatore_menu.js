// ======================================================================
// FILE: x1_programmatore_menu.js
// DESCRIZIONE: Logica moderna per MENU + SOTTOMENU (OGGETTI)
// AUTORE: Luca + Copilot
// DATA: 2026-04-16 – CEST
// NOTE: Usa i dati contenuti in x1_menu_struttura_data.js
// ======================================================================


// ------------------------------------------------------------
// Popola MENU (codici X.Y → prende solo X)
// ------------------------------------------------------------
function x1_popolaMenu() {

  const menuSelect = document.getElementById("menu_select");
  if (!menuSelect) return;

  menuSelect.innerHTML = "<option value=''>— seleziona MENU —</option>";

  x1_menu_struttura_data.forEach(row => {

    const codice = row.cod__menu;
    const menu   = row.menu;

    if (!codice || !menu) return;

    // Estrae la parte prima del punto → "1" da "1.2"
    const numeroMenu = codice.split(".")[0];

    // Evita duplicati
    if (!menuSelect.querySelector(`option[value="${numeroMenu}"]`)) {
      const opt = document.createElement("option");
      opt.value = numeroMenu;
      opt.textContent = menu;
      menuSelect.appendChild(opt);
    }
  });
}



// ------------------------------------------------------------
// Popola SOTTOMENU (codici X.Y → prende solo quelli che iniziano con X.)
// ------------------------------------------------------------
function x1_popolaSottomenu(menuCode) {

  const subSelect = document.getElementById("submenu_select");
  if (!subSelect) return;

  subSelect.innerHTML = "<option value=''>— seleziona SOTTOMENU —</option>";

  x1_menu_struttura_data.forEach(row => {

    const codice    = row.cod__menu;
    const sottomenu = row.sottomenu;

    if (!codice) return;

    // Se il codice inizia con "X." → appartiene al menu selezionato
    if (codice.startsWith(menuCode + ".") &&
        sottomenu &&
        sottomenu.trim() !== "/") {

      const opt = document.createElement("option");
      opt.value = codice;
      opt.textContent = sottomenu;
      subSelect.appendChild(opt);
    }
  });
}
