//Konstante für die API-URL
const apiURL =
  "https://join-388-default-rtdb.europe-west1.firebasedatabase.app/users.json";

//Dropdown-Management
// Dropdown umschalten
// Dropdown umschalten
// Dropdown umschalten
function toggleDropdown(dropdownId, event) {
  console.log(`toggleDropdown called with id: ${dropdownId}`);
  const dropdownMenu = document.getElementById(dropdownId);

  if (!dropdownMenu) {
    console.error(`Dropdown menu with id "${dropdownId}" not found.`);
    return;
  }

  // Toggle das Dropdown-Menü
  const isCurrentlyVisible = dropdownMenu.style.display === "block";
  dropdownMenu.style.display = isCurrentlyVisible ? "none" : "block";

  console.log(
    `Dropdown menu with id "${dropdownId}" is now ${dropdownMenu.style.display}`
  );

  // Verhindere, dass das Event nach oben propagiert wird
  if (event) {
    event.stopPropagation();
  }
}

// Dropdown schließen bei Klick außerhalb
function closeDropdownOnOutsideClick(inputId, dropdownId) {
  document.addEventListener("click", (event) => {
    const input = document.getElementById(inputId);
    const dropdownMenu = document.getElementById(dropdownId);

    if (!input || !dropdownMenu) {
      console.error("Input or dropdown menu not found");
      return;
    }

    // Schließen nur auslösen, wenn der Klick außerhalb des Dropdowns und Inputs erfolgt
    if (
      event.target !== input && // Nicht das Input-Feld
      !dropdownMenu.contains(event.target) // Nicht innerhalb des Dropdown-Menüs
    ) {
      dropdownMenu.style.display = "none";
      console.log(`Closed dropdown menu with id: ${dropdownId}`);
    }
  });
}

// Dropdown filtern
function filterDropdown(inputId, menuSelector) {
  const input = document.getElementById(inputId);
  if (!input) {
    console.error(`Input with id "${inputId}" not found.`);
    return;
  }

  const filter = input.value.toLowerCase();
  const items = document.querySelectorAll(menuSelector);

  items.forEach((item) => {
    const text = item.textContent || item.innerText;
    item.style.display = text.toLowerCase().includes(filter) ? "block" : "none";
  });
}

// Dropdown-Wert setzen
function setDropdownValueOnClick(menuId, inputId) {
  const menu = document.getElementById(menuId);
  if (!menu) {
    console.error(`Menu with id "${menuId}" not found.`);
    return;
  }

  menu.addEventListener("click", (event) => {
    if (event.target.classList.contains("custom-dropdown-item")) {
      const input = document.getElementById(inputId);
      if (input) {
        input.value = event.target.textContent;
        menu.style.display = "none";
      }
    }
  });
}

// Initialisierung der Dropdowns
document.addEventListener("DOMContentLoaded", () => {
  const assignedInputId = "dropdownInput";
  const assignedMenuId = "dropdownMenu";

  const assignedInput = document.getElementById(assignedInputId);
  if (assignedInput) {
    assignedInput.addEventListener("click", (event) => {
      event.stopPropagation(); // Klick auf das Input-Feld nicht weiterleiten
      toggleDropdown(assignedMenuId, event);
    });
    assignedInput.addEventListener("keyup", () => {
      filterDropdown(assignedInputId, `#${assignedMenuId} label`);
    });
    closeDropdownOnOutsideClick(assignedInputId, assignedMenuId);
  }

  const categoryInputId = "customDropdownInput";
  const categoryMenuId = "customDropdownMenu";

  const categoryInput = document.getElementById(categoryInputId);
  if (categoryInput) {
    categoryInput.addEventListener("click", (event) => {
      event.stopPropagation(); // Klick auf das Input-Feld nicht weiterleiten
      toggleDropdown(categoryMenuId, event);
    });
    categoryInput.addEventListener("input", () => {
      filterDropdown(
        categoryInputId,
        `#${categoryMenuId} .custom-dropdown-item`
      );
    });
    closeDropdownOnOutsideClick(categoryInputId, categoryMenuId);
  }

  setDropdownValueOnClick(categoryMenuId, categoryInputId);
});
//Filter-Management
//Kontakte laden
async function loadContacts(apiURL, dropdownId) {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    const dropdownMenu = document.getElementById(dropdownId);
    if (dropdownMenu) {
      dropdownMenu.innerHTML = "";

      Object.values(data).forEach((contact) => {
        const contactElement = createContactElement(contact);
        dropdownMenu.appendChild(contactElement);
      });
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

//Kontakt-Element erstellen
function createContactElement(contact) {
  const label = document.createElement("label");
  const checkbox = createCheckbox(contact.name);
  const button = createContactButton(contact.name);

  // Event-Listener für Checkbox
  checkbox.onchange = () => {
    updateSelectedContacts(contact.name, button, checkbox.checked);
  };

  // Elemente in das Label einfügen
  label.appendChild(button);
  label.appendChild(document.createTextNode(contact.name));
  label.appendChild(checkbox);

  return label;
}

function createCheckbox(name) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = name;
  return checkbox;
}

function createContactButton(name) {
  const button = document.createElement("button");
  button.textContent = name.charAt(0).toUpperCase();
  button.style.marginRight = "10px";
  button.style.backgroundColor = generateColorFromLetter(name.charAt(0));
  return button;
}

//Auswahl-Management
//Ausgewählte Kontakte aktualisieren
function updateSelectedContacts(contactName, button, isChecked) {
  const selectedContactsContainer = document.getElementById("selectedContacts");

  if (isChecked) {
    addSelectedContact(button, contactName, selectedContactsContainer);
  } else {
    removeSelectedContact(contactName, selectedContactsContainer);
  }
}

// Kontakt hinzufügen
function addSelectedContact(button, contactName, container) {
  const clonedButton = button.cloneNode(true);

  // Event-Listener zum Entfernen
  clonedButton.onclick = () => {
    deselectContact(contactName);
    clonedButton.remove();
  };

  container.appendChild(clonedButton);
}

//Kontakt entfernen
function removeSelectedContact(contactName, container) {
  const buttons = container.querySelectorAll("button");
  buttons.forEach((btn) => {
    if (btn.textContent === contactName.charAt(0).toUpperCase()) {
      btn.remove();
    }
  });
}

function deselectContact(contactName) {
  const checkboxes = document.querySelectorAll(".dropdown-menu input");
  checkboxes.forEach((checkbox) => {
    if (checkbox.value === contactName) {
      checkbox.checked = false;
    }
  });
}

//Farbgenerierung
function generateColorFromLetter(letter) {
  const charCode = letter.toUpperCase().charCodeAt(0);
  const hue = (charCode - 65) * 15;
  return `hsl(${hue}, 70%, 50%)`;
}

//Initialisierung
//Setup beim Laden
window.onload = () => {
  loadContacts(apiURL, "dropdownMenu");
  closeDropdownOnOutsideClick("dropdownInput", "dropdownMenu");
};