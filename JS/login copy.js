
async function handleLogin(event) {
    event.preventDefault();

    // Eingabewerte sammeln
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        // Benutzerdaten aus Firebase abrufen
        const response = await fetch('https://join-388-default-rtdb.europe-west1.firebasedatabase.app/users.json');
        const usersData = await response.json();

        // Überprüfen, ob Benutzer mit entsprechender E-Mail und Passwort existiert
        let userFound = false;
        for (const userId in usersData) {
            const user = usersData[userId];
            if (user.email === email && user.password === password) {
                userFound = true;
                break;
            }
        }

        if (userFound) {
            // Weiterleitung zur board.html, wenn Login erfolgreich ist
            window.location.href = "./html/board.html";
        } else {
            // Fehlermeldung anzeigen, wenn Email oder Passwort nicht übereinstimmen
            document.querySelector('.error').style.display = 'block';
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
    }
}

// Event-Listener für Login-Button
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.logInButton').addEventListener('click', handleLogin);
});

function navigateToSignUp() {
    window.location.href = "./signup.html";
}