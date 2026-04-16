// ======================================================================
// FILE: x1_programmatore_menu.js
// DESCRIZIONE: Logica di popolamento MENU + SOTTOMENU
// AUTORE: Luca + Copilot
// DATA: 16/04/2026 – 16:42:00 CEST
// NOTE: Usa i dati contenuti in x1_menu_struttura_data.js
// ======================================================================


// ------------------------------------------------------------
// Popola MENU (codici prima del punto)
// ------------------------------------------------------------
function x1_popolaMenu() {

  // Recupera select MENU
  const menuSelect = document.getElementById("menu_select");
  if (!menuSelect) return;

  // Reset iniziale
  menuSelect.innerHTML = "<option value=''>— seleziona MENU —</option>";

  // Scorre tutti i record del file dati
  x1_menu_struttura_data.forEach(row => {

    // Lettura campi dal file dati (OGGETTI, non array)
    const codice = row.cod__menu;   // es: "1.0"
    const menu   = row.menu;        // es: "1 = MANOVRA"

    if (!codice || !menu) return;

    // Estrae solo la parte prima del punto → "1"
    const numeroMenu = codice.split(".")[0];

    // Evita duplicati nel menu principale
    if (!menuSelect.querySelector(`option[value="${numeroMenu}"]`)) {
      const opt = document.createElement("option");
      opt.value = numeroMenu;
      opt.textContent = menu;
      menuSelect.appendChild(opt);
    }
  });
}



// ------------------------------------------------------------
// Popola SOTTOMENU (codici X.Y)
// ------------------------------------------------------------
function x1_popolaSottomenu(menuCode) {

  // Recupera select SOTTOMENU
  const subSelect = document.getElementById("submenu_select");
  if (!subSelect) return;

  // Reset iniziale
  subSelect.innerHTML = "<option value=''>— seleziona SOTTOMENU —</option>";

  // Scorre tutti i record del file dati
  x1_menu_struttura_data.forEach(row => {

    const codice    = row.cod__menu;    // es: "1.2"
    const sottomenu = row.sottomenu;    // es: "PARAMETRI"

    if (!codice) return;

    // Se il codice inizia con "X." → appartiene al menu selezionato
    if (codice.startsWith(menuCode + ".") && sottomenu && sottomenu.trim() !== "/") {

      const opt = document.createElement("option");
      opt.value = codice;
      opt.textContent = sottomenu;
      subSelect.appendChild(opt);
    }
  });
}
