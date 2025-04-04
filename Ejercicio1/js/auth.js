// Función para iniciar sesión
// function login(event) {
//     event.preventDefault();
//
//     let username = document.getElementById("username").value;
//     let password = document.getElementById("password").value;
//
//     // Credenciales de prueba (puedes cambiarlo a un sistema con backend)
//     const validCredentials = [
//         { user: "admin", pass: "1234" },
//         { user: "visor", pass: "5678" }
//     ];
//
//     // Verifica si las credenciales coinciden con alguna de las válidas
//     let isValid = validCredentials.some(cred => cred.user === username && cred.pass === password);
//
//     if (isValid) {
//         localStorage.setItem("auth", "true");
//         window.location.href = "main.html"; // Redirigir a la página principal
//     } else {
//         alert("Usuario o contraseña incorrectos");
//     }
// }
//
//
// // Función para cerrar sesión
// function logout() {
//     localStorage.removeItem("auth");
//     window.location.href = "login.html";
// }
//
// // Función para verificar autenticación
// function verificarAutenticacion() {
//     if (localStorage.getItem("auth") !== "true") {
//         window.location.href = "login.html"; // Redirigir si no está autenticado
//     }
// }
// Definimos los roles y sus permisos
const users = [
    { user: "admin", pass: "1234", role: "administrador" },
    { user: "visor", pass: "5678", role: "visor" },
    { user: "register", pass: "7142", role: "register" }
];

// Función para iniciar sesión
function login(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Buscar usuario en la lista
    let usuario = users.find(u => u.user === username && u.pass === password);

    if (usuario) {
        // Guardamos el rol en localStorage
        localStorage.setItem("auth", "true");
        localStorage.setItem("role", usuario.role);
        window.location.href = "main.html"; // Redirigir a la página principal
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

// Función para verificar autenticación
function verificarAutenticacion() {
    if (localStorage.getItem("auth") !== "true") {
        window.location.href = "login.html"; // Redirigir si no está autenticado
    }
}

// Función para verificar acceso según rol
function verificarAcceso() {
    let role = localStorage.getItem("role");

    if (!role) {
        logout();
        return;
    }

    // Restringimos elementos según el rol
    if (role === "register") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
        document.querySelectorAll(".visor-only").forEach(el => el.style.display = "none");
    } else if (role === "visor") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
        document.querySelectorAll(".register-only").forEach(el => el.style.display = "none");
    }
}

// Llamar `verificarAcceso()` en `main.html` para aplicar restricciones.
