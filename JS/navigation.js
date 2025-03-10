/**
 * Saves the current page in `sessionStorage` before leaving the page.
 */
function saveLastPage() {
  const currentPage = window.location.href;
  const lastPage = sessionStorage.getItem("currentPage");

  if (lastPage && lastPage !== currentPage) {
    sessionStorage.setItem("lastPage", lastPage);
  }

  sessionStorage.setItem("currentPage", currentPage);
}

/**
 * Redirects the user to the last visited page.
 */
function goToLastPage() {
  const lastPage = sessionStorage.getItem("lastPage");
  if (lastPage) {
    window.location.href = lastPage;
  } else {
    window.history.back();
  }
}
/**
 *  Saves the current page when **leaving** the page so that quick switches are recorded
 */
window.addEventListener("beforeunload", saveLastPage);

/**
 * Saves the current page in `sessionStorage` when the page is hidden.
 */
document.addEventListener("DOMContentLoaded", saveLastPage);
