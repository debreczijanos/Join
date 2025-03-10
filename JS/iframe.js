/**
 * Verhindert die Standard-Formularweiterleitung und sendet eine Nachricht an das Hauptdokument,
 * um über die erfolgreiche Erstellung der Aufgabe zu informieren.
 *
 * @param {Event} event - Das übergebene Ereignis-Objekt des Formular-Submits.
 */
function submitTask(event) {
  event.preventDefault();

  console.log("Task erfolgreich erstellt!");
  parent.postMessage("taskSuccess", "*");
}

/**
 * Lauscht auf Nachrichten vom iFrame und zeigt bei Erfolg eine Erfolgsmeldung an,
 * schließt das Overlay und lädt die Seite neu.
 */
window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "taskSuccess") {
    const successOverlay = document.getElementById("overlay");
    successOverlay.style.display = "flex";

    setTimeout(() => {
      successOverlay.style.display = "none";
      closeAddTask();
      location.reload();
    }, 3000);
  }
});

/**
 * Schließt das Overlay-Fenster und setzt das iFrame zurück.
 */
function closeAddTask() {
  const overlay = document.getElementById("iframeOverlay");
  if (overlay) {
    overlay.classList.add("d-none");
  }
  const iframe = document.getElementById("overlayFrame");
  if (iframe) {
    iframe.src = "";
  }
}

/**
 * Empfangt Nachrichten vom iFrame und schließt das Overlay,
 * wenn eine `closeOverlay`-Aktion empfangen wird.
 */
window.addEventListener("message", function (event) {
  if (event.data && event.data.action === "closeOverlay") {
    const overlay = document.getElementById("iframeOverlay");
    if (overlay) {
      overlay.classList.add("d-none");
      document.getElementById("overlayFrame").src = "";
    }
  }
});

/**
 * Schließt das Overlay, wenn außerhalb des iFrames geklickt wird.
 * @param {MouseEvent} event - Das Klick-Ereignis.
 */
function closeOverlayOnClick(event) {
  const overlay = document.getElementById("iframeOverlay");
  const overlayContent = document.querySelector(".iframe-overlay-content");

  // Prüft, ob der Klick außerhalb des Overlay-Inhalts war
  if (event.target === overlay) {
    closeAddTask();
  }
}

/**
 * Fügt den Event-Listener zum Schließen des Overlays hinzu, wenn die Seite geladen wird.
 */
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("iframeOverlay");
  if (overlay) {
    overlay.addEventListener("click", closeOverlayOnClick);
  }
});
