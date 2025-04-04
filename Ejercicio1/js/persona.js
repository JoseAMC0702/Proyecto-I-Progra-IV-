const registrosPorPagina = 5;
let paginaActual = 1;

function cargarPersonas() {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    let tbody = document.getElementById("personas-list");

    tbody.innerHTML = "";

    if (personas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No hay datos disponibles</td></tr>`;
        return;
    }

    let totalPaginas = Math.ceil(personas.length / registrosPorPagina);
    let inicio = (paginaActual - 1) * registrosPorPagina;
    let fin = inicio + registrosPorPagina;
    let personasPaginadas = personas.slice(inicio, fin);

    personasPaginadas.forEach((persona, index) => {
        let fila = `<tr>
        <td>${persona.id}</td>
        <td>${persona.nombre}</td>
        <td>${persona.email}</td>
        <td>${persona.direccion}</td>
        <td>${persona.fechaNacimiento}</td>
        <td>${persona.telefono}</td>
        <td>${persona.cargo}</td>
        <td>${persona.estado}</td>
        <td>${persona.oficina}</td>
        <td>
            <button onclick="editarPersona(${inicio + index})" class="btn btn-warning admin-only"><i class="bi bi-pencil"></i>Editar</button>
            <button onclick="eliminarPersona(${inicio + index})" class="btn btn-danger admin-only"><i class="bi bi-trash"></i>Eliminar</button>
        </td>
    </tr>`;
        tbody.innerHTML += fila;
    });
    mostrarPaginacion(totalPaginas);
}
function mostrarPaginacion(totalPaginas) {
    let paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
        let boton = document.createElement("button");
        boton.className = "btn " + (i === paginaActual ? "btn-primary" : "btn-outline-primary");
        boton.innerText = i;
        boton.onclick = function () {
            paginaActual = i;
            cargarPersonas();
        };
        paginacion.appendChild(boton);
    }
    verificarAcceso();
}


function eliminarPersona(index) {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];

    // Confirmar la eliminación
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
        // Eliminar el registro
        personas.splice(index, 1);
        // Actualizar el localStorage con los datos modificados
        localStorage.setItem("personas", JSON.stringify(personas));
        // Recargar los datos en la tabla
        cargarPersonas();

        alert("La persona fue eliminada correctamente.");
    }
}


function editarPersona(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "form.html";
}

function guardarPersona(event) {
    event.preventDefault();
    let form = event.target;

    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
    }

    let id = document.getElementById("id").value;
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let direccion = document.getElementById("direccion").value;
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let telefono = document.getElementById("telefono").value;
    let cargo = document.getElementById("cargo").value;
    let estado = document.getElementById("estado").value;
    let oficina = document.getElementById("oficina").value;

    if (!id || !nombre || !email || !direccion || !fechaNacimiento || !oficina) {
        alert("Todos los campos son obligatorios");
        return;
    }

    let persona = { id, nombre, email, direccion, fechaNacimiento, telefono, cargo, estado, oficina };
    let personas = JSON.parse(localStorage.getItem("personas")) || [];

    let index = localStorage.getItem("editIndex");
    if (index !== null) {
        personas[index] = persona;
        alert("Los datos fueron editados correctamente.");
    } else {
        personas.push(persona);
        alert("La persona fue agregada correctamente.");
    }

    localStorage.setItem("personas", JSON.stringify(personas));
    window.location.href = "index.html";
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'


    var forms = document.querySelectorAll('.needs-validation')


    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()
function filtrarPersonas() {
    let filtro = document.getElementById("busqueda").value.toLowerCase();
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    let tbody = document.getElementById("personas-list");

    tbody.innerHTML = "";

    let personasFiltradas = personas.filter(persona => {
        return Object.values(persona).some(valor =>
            valor.toString().toLowerCase().includes(filtro)
        );
    });

    if (personasFiltradas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No se encontraron resultados</td></tr>`;
        return;
    }

    personasFiltradas.forEach((persona, index) => {
        let fila = `<tr>
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.email}</td>
            <td>${persona.direccion}</td>
            <td>${persona.fechaNacimiento}</td>
            <td>${persona.telefono}</td>
            <td>${persona.cargo}</td>
            <td>${persona.estado}</td>
            <td>${persona.oficina}</td>
            <td>
                <button onclick="editarPersona(${index})" class="btn btn-warning admin-only"><i class="bi bi-pencil"></i>Editar</button>
                <button onclick="eliminarPersona(${index})" class="btn btn-danger admin-only"><i class="bi bi-trash"></i>Eliminar</button>
            </td>
        </tr>`;
        tbody.innerHTML += fila;
    });
    verificarAcceso();
}
function exportarPDF() {
    const { jsPDF } = window.jspdf;

    let doc = new jsPDF({
        orientation: "landscape", // Modo horizontal para más espacio
        unit: "mm",
        format: "a4"
    });

    doc.setFontSize(18);
    doc.text("Lista de Personas", 14, 15);

    // Obtener la tabla y convertirla en un formato compatible con autoTable
    let filas = [];
    let encabezados = [];

    // Obtener todas las filas de la tabla
    document.querySelectorAll("#personas-list tr").forEach((fila, index) => {
        let celdas = Array.from(fila.querySelectorAll("td")).map(td => td.innerText);
        if (index === 0) { // Primera fila para los encabezados
            encabezados = ["Id", "Nombre", "Correo", "Dirección", "Fecha de Nacimiento", "Teléfono", "Cargo", "Estado", "Oficina"];
        }
        filas.push(celdas);
    });

    // Agregar la tabla con autoTable
    doc.autoTable({
        head: [encabezados],
        body: filas,
        startY: 25, // Posición debajo del título
        styles: { fontSize: 10, cellWidth: 'wrap' }, // Ajuste de fuente y ancho de celda
        theme: "striped",
        headStyles: { fillColor: [40, 40, 40], textColor: 255 },
        columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 35 }, 2: { cellWidth: 45 } } // Ajustar columnas importantes
    });

    // Descargar el archivo PDF
    doc.save("Lista_de_Personas.pdf");
}

function exportarExcel() {
    let tabla = document.querySelector("table"); // Seleccionar la tabla completa

    if (!tabla) {
        alert("No hay datos para exportar.");
        return;
    }

    let wb = XLSX.utils.table_to_book(tabla, { sheet: "Personas" });
    XLSX.writeFile(wb, "Lista_de_Personas.xlsx");
}
