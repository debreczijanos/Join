/**
 * API URLs
 */
const apiURL =
  "https://join-388-default-rtdb.europe-west1.firebasedatabase.app/users.json";
const API_CONTACTS =
  "https://join-388-default-rtdb.europe-west1.firebasedatabase.app/contact.json";

/**
 * List of selected contacts
 */
let selectedContacts = [];

/**
 * Toggles the dropdown menu.
 *
 * @param {string} dropdownId - The ID of the dropdown menu.
 */
function toggleDropdown(dropdownId) {
  const dropdownMenu = document.getElementById(dropdownId);

  if (!dropdownMenu) return;

  const allDropdowns = document.querySelectorAll(".dropdown-menu");
  allDropdowns.forEach((menu) => {
    if (menu !== dropdownMenu) {
      menu.classList.remove("open");
    }
  });

  dropdownMenu.classList.toggle("open");
}

/**
 * Closes a dropdown when clicking outside of it.
 *
 * @param {string} inputId - The ID of the input field.
 * @param {string} menuId - The ID of the dropdown menu.
 */
function closeDropdownOnOutsideClick(inputId, menuId) {
  document.addEventListener("click", (event) => {
    const input = document.getElementById(inputId);
    const dropdownMenu = document.getElementById(menuId);

    if (
      input &&
      dropdownMenu &&
      event.target !== input &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.classList.remove("open");
    }
  });
}

/**
 * Initializes a dropdown menu with event listeners.
 *
 * @param {string} inputId - The ID of the input field.
 * @param {string} menuId - The ID of the dropdown menu.
 */
function initializeDropdown(inputId, menuId) {
  const input = document.getElementById(inputId);
  const menu = document.getElementById(menuId);

  if (!input || !menu) return;

  if (input.dataset.listenerAdded) return;
  input.dataset.listenerAdded = true;

  input.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleDropdown(menuId);
  });

  closeDropdownOnOutsideClick(inputId, menuId);
  setDropdownValueOnClick(menuId, inputId);
}

/**
 * Filters the entries in a dropdown menu based on input.
 *
 * @param {string} inputId - The ID of the input field.
 * @param {string} menuSelector - The CSS selector for the dropdown entries.
 */
function filterDropdown(inputId, menuSelector) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const filter = input.value.toLowerCase();
  const items = document.querySelectorAll(menuSelector);

  items.forEach((item) => {
    const text = item.textContent || item.innerText;
    item.style.display = text.toLowerCase().includes(filter) ? "block" : "none";
  });
}

/**
 * Sets the value of a dropdown when an entry is clicked.
 *
 * @param {string} menuId - The ID of the dropdown menu.
 * @param {string} inputId - The ID of the input field.
 */
function setDropdownValueOnClick(menuId, inputId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;

  menu.addEventListener("click", (event) => {
    if (event.target.classList.contains("custom-dropdown-item")) {
      const input = document.getElementById(inputId);
      if (input) {
        input.value = event.target.textContent.trim();
        menu.classList.remove("open");
      }
    }
  });
}

/**
 * Initialization of dropdowns
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeDropdown("dropdownInput", "dropdownMenu");
  initializeDropdown("customDropdownInput", "customDropdownMenu");

  const assignedInputId = "dropdownInput";
  const assignedMenuId = "dropdownMenu";

  const assignedInput = document.getElementById(assignedInputId);
  if (assignedInput) {
    assignedInput.addEventListener("click", (event) => {
      event.stopPropagation();
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
      event.stopPropagation();
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

/**
 * Prevents text input but allows numbers, for example.
 */
const input = document.getElementById("customDropdownInput");
input.addEventListener("keypress", (event) => {
  event.preventDefault();
});

input.addEventListener("input", (event) => {
  input.value = "";
});

/**
 * Loads contacts from APIs and adds them to the dropdown menu.
 *
 * @param {string} apiURL - The API URL.
 * @param {string} dropdownId - The ID of the dropdown menu.
 */
async function loadContacts(apiURL, dropdownId) {
  try {
    const dropdownMenu = getDropdownMenu(dropdownId);
    const uniqueContacts = new Set();

    const allContacts = await fetchAllContacts(apiURL);
    addContactsToDropdown(allContacts, uniqueContacts, dropdownMenu);
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

/**
 * Retrieves a dropdown menu element.
 *
 * @param {string} dropdownId - The ID of the dropdown menu.
 * @returns {HTMLElement} The dropdown menu element.
 */
function getDropdownMenu(dropdownId) {
  const dropdownMenu = document.getElementById(dropdownId);
  if (!dropdownMenu) {
    throw new Error("Dropdown menu not found!");
  }
  dropdownMenu.innerHTML = ""; // Clear previous content
  return dropdownMenu;
}

/**
 * Fetches contacts from two APIs and combines them.
 *
 * @param {string} apiURL - The URL of the first API.
 * @returns {Array} A list of all contacts.
 */
async function fetchAllContacts(apiURL) {
  const contactsFromMainAPI = await fetchContactsFromAPI(apiURL);
  const contactsFromSecondaryAPI = await fetchContactsFromAPI(API_CONTACTS);
  return [...contactsFromMainAPI, ...contactsFromSecondaryAPI];
}

/**
 * Fetches contacts from an API.
 *
 * @param {string} url - The API URL.
 * @returns {Array} A list of contacts.
 */
async function fetchContactsFromAPI(url) {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Error fetching data from ${url}`);
    return [];
  }
  const data = await response.json();
  return Object.values(data);
}

/**
 * Adds contacts to the dropdown and sorts them alphabetically.
 *
 * @param {Array} contacts - The list of contacts.
 * @param {Set} uniqueContacts - A set to avoid duplicates.
 * @param {HTMLElement} dropdownMenu - The dropdown menu element.
 */
function addContactsToDropdown(contacts, uniqueContacts, dropdownMenu) {
  const sortedContacts = contacts.sort((a, b) =>
    a.name.localeCompare(b.name, "de", { sensitivity: "base" })
  );

  sortedContacts.forEach((contact) => {
    if (!uniqueContacts.has(contact.name)) {
      uniqueContacts.add(contact.name);
      const contactElement = createContactElement(contact);
      dropdownMenu.appendChild(contactElement);
    }
  });
}

/**
 * Creates an element for a contact.
 *
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} The created contact element.
 */
function createContactElement(contact) {
  const label = document.createElement("label");
  const checkbox = createCheckbox(contact.name);
  const button = createContactButton(contact.name);

  const checkboxId = `checkbox-${contact.name}`;
  checkbox.id = checkboxId;
  label.htmlFor = checkboxId;

  // Set default styling for the label
  label.style.backgroundColor = "#f9f9f9"; // Default background
  label.style.padding = "10px"; // Optional, for better visibility
  label.style.display = "flex"; // Optional, if using a flex layout
  label.style.alignItems = "center";

  // Change background color when checkbox state changes
  checkbox.onchange = () => {
    if (checkbox.checked) {
      label.style.backgroundColor = "#2A3647"; // Dark blue background
      label.style.color = "#ffffff"; // White text
    } else {
      label.style.backgroundColor = "#f9f9f9"; // Default background
      label.style.color = "#000000"; // Black text
    }

    updateSelectedContacts(contact.name, button, checkbox.checked);
  };

  // Append the checkbox, button, and name to the label
  label.appendChild(checkbox);
  label.appendChild(button);
  label.appendChild(document.createTextNode(contact.name));

  return label;
}

/**
 * Creates a checkbox element.
 *
 * @param {string} name - The name of the contact.
 * @returns {HTMLElement} The checkbox element.
 */
function createCheckbox(name) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = name;
  return checkbox;
}

/**
 * Creates a button for a contact.
 *
 * @param {string} name - The name of the contact.
 * @returns {HTMLElement} The created button.
 */
function createContactButton(name) {
  const button = document.createElement("button");
  button.textContent = name.charAt(0).toUpperCase();
  button.style.marginRight = "10px";
  button.style.backgroundColor = generateColorFromLetter(name.charAt(0));
  return button;
}

/**
 * Updates the selected contacts.
 *
 * @param {string} contactName - The name of the contact.
 * @param {HTMLElement} button - The button element representing the contact.
 * @param {boolean} isChecked - Whether the contact is selected or not.
 */
function updateSelectedContacts(contactName, button, isChecked) {
  const selectedContactsContainer = document.getElementById("selectedContacts");

  if (isChecked) {
    addSelectedContact(button, contactName, selectedContactsContainer);
  } else {
    removeSelectedContact(contactName, selectedContactsContainer);
  }

  renderSelectedContacts(selectedContactsContainer);
}

/**
 * Adds a contact to the selected list.
 *
 * @param {HTMLElement} button - The button element representing the contact.
 * @param {string} contactName - The name of the contact.
 * @param {HTMLElement} container - The container where the contact buttons are displayed.
 */
function addSelectedContact(button, contactName, container) {
  if (selectedContacts.includes(contactName)) return;
  selectedContacts.push(contactName);
  const clonedButton = button.cloneNode(true);
  clonedButton.dataset.contactName = contactName;
  clonedButton.onclick = () => {
    deselectContact(contactName);
    renderSelectedContacts(container);
  };

  container.appendChild(clonedButton);
  renderSelectedContacts(container);
}

/**
 * Removes a selected contact.
 *
 * @param {string} contactName - The name of the contact to remove.
 * @param {HTMLElement} container - The container displaying the selected contacts.
 */
function removeSelectedContact(contactName, container) {
  selectedContacts = selectedContacts.filter((name) => name !== contactName);

  const buttons = container.querySelectorAll("button");
  buttons.forEach((btn) => {
    if (btn.dataset.contactName === contactName) {
      btn.remove();
    }
  });
  renderSelectedContacts(container);
}

/**
 * Renders the selected contacts in the container.
 *
 * @param {HTMLElement} container - The container where the selected contacts are displayed.
 */
function renderSelectedContacts(container) {
  const maxVisible = 3;
  container.innerHTML = "";
  selectedContacts.slice(0, maxVisible).forEach((contactName) => {
    const button = document.createElement("button");
    button.textContent = contactName.charAt(0).toUpperCase();
    button.dataset.contactName = contactName;
    button.style.marginRight = "10px";
    button.style.backgroundColor = generateColorFromLetter(
      contactName.charAt(0)
    );

    button.onclick = () => {
      deselectContact(contactName);
      renderSelectedContacts(container);
    };

    container.appendChild(button);
  });

  const extraCount = selectedContacts.length - maxVisible;
  if (extraCount > 0) {
    const extraButton = document.createElement("div");
    extraButton.textContent = `+${extraCount}`;
    extraButton.classList.add("extra-count-button");
    container.appendChild(extraButton);
  }
}

/**
 * Deselects a contact and updates the selected list.
 *
 * @param {string} contactName - The name of the contact to deselect.
 */
function deselectContact(contactName) {
  const checkboxes = document.querySelectorAll(".dropdown-menu input");
  checkboxes.forEach((checkbox) => {
    if (checkbox.value === contactName) {
      checkbox.checked = false;
    }
  });

  const selectedContactsContainer = document.getElementById("selectedContacts");
  renderSelectedContacts(selectedContactsContainer);
}

/**
 * Retrieves the list of selected contacts.
 *
 * @returns {Array} The array of selected contact names.
 */
function getSelectedContacts() {
  return selectedContacts;
}

/**
 * Builds a task object with form data.
 *
 * @returns {Object} The task object.
 */
function buildTaskObject() {
  return {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    assignedTo: getSelectedContacts(),
    dueDate: document.querySelector("input[type='date']").value,
    prio: getActivePrio(),
    status: "To Do",
    category: document.getElementById("customDropdownInput").value.trim(),
    subtasks: getSubtasks(),
  };
}

/**
 * Generates a color based on the first letter of a name.
 *
 * @param {string} letter - The first letter of the name.
 * @returns {string} The generated color in HSL format.
 */
function generateColorFromLetter(letter) {
  const charCode = letter.toUpperCase().charCodeAt(0);
  const hue = (charCode - 65) * 15;
  return `hsl(${hue}, 70%, 50%)`;
}
