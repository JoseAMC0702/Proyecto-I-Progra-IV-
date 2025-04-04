const registrosPorPaginaES = 5;
let paginaActualES = 1;

function cargarES() {
    let registroES = JSON.parse(localStorage.getItem("registroES")) || [];
    let tbody = document.getElementById("registroES-list");

    tbody.innerHTML = "";

    if (registroES.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No hay datos disponibles</td></tr>`;
        return;
    }

    let totalPaginasES = Math.ceil(registroES.length / registrosPorPaginaES);
    let inicioES = (paginaActualES - 1) * registrosPorPaginaES;
    let finES = inicioES + registrosPorPaginaES;
    let ESPaginadas = registroES.slice(inicioES, finES);

    ESPaginadas.forEach((ES, index) => {
        let fila = `<tr>
        <td>${ES.persona}</td>
        <td>${ES.oficina}</td>
        <td>${ES.registro}</td>
        <td>${ES.fecha}</td>
        <td>${ES.hora}</td>
        <td>
            <button onclick="editarES(${inicioES + index})" class="btn btn-warning admin-only, register-only"><i class="bi bi-pencil"></i>Editar</button>
            <button onclick="eliminarES(${inicioES + index})" class="btn btn-danger admin-only, register-only"><i class="bi bi-trash"></i>Eliminar</button>
        </td>
    </tr>`;
        tbody.innerHTML += fila;
    });
    mostrarPaginacionES(totalPaginasES);
    generarGraficosES()
}
function mostrarPaginacionES(totalPaginasES) {
    let paginacionES = document.getElementById("paginacionES");
    paginacionES.innerHTML = "";

    for (let i = 1; i <= totalPaginasES; i++) {
        let boton = document.createElement("button");
        boton.className = "btn " + (i === paginaActualES ? "btn-primary" : "btn-outline-primary");
        boton.innerText = i;
        boton.onclick = function () {
            paginaActualES = i;
            cargarES();
        };
        paginacionES.appendChild(boton);
    }
}


function eliminarES(index) {
    let registroES = JSON.parse(localStorage.getItem("registroES")) || [];

    // Confirmar la eliminación
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
        // Eliminar el registro
        registroES.splice(index, 1);
        // Actualizar el localStorage con los datos modificados
        localStorage.setItem("registroES", JSON.stringify(registroES));
        // Recargar los datos en la tabla
        alert("El registro fue eliminado correctamente.");
        cargarES();

    }
}


function editarES(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formES.html";
}


function guardarES(event) {
    event.preventDefault();
    let form = event.target;

    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
    }

    let persona = document.getElementById("persona").value;
    let oficina = document.getElementById("oficina").value;  // Asegúrate de que este campo está en el formulario
    let registro = document.getElementById("registro").value;
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;

    if (!persona || !oficina || !registro || !fecha || !hora) {
        alert("Todos los campos son obligatorios");
        return;
    }

    let registroES = JSON.parse(localStorage.getItem("registroES")) || [];
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];  // Asegurar que se obtienen las oficinas como array

    // Buscar la oficina en el array
    let oficinaSeleccionada = oficinas.find(of => of.nombre === oficina);

    if (!oficinaSeleccionada) {
        alert("La oficina seleccionada no existe en el sistema.");
        return;
    }

    let capacidadMaxima = oficinaSeleccionada.cantidadOF;  // Capacidad de la oficina
    let cantidadTemp = 0;  // Personas actualmente en la oficina

    console.log(`Oficina: ${oficina}, Capacidad Máxima: ${capacidadMaxima}`);

    // Contar las personas dentro de la oficina
    registroES.forEach(entry => {
        if (entry.oficina === oficina) {
            if (entry.registro === "Ingreso") cantidadTemp++;
            if (entry.registro === "Salida") cantidadTemp--;
        }
    });

    console.log(`Personas dentro de la oficina (${oficina}): ${cantidadTemp}`);

    // Validación de capacidad
    if (registro === "Ingreso" && cantidadTemp >= capacidadMaxima) {
        alert("No se puede registrar más personas. La oficina ha alcanzado su capacidad máxima.");
        return;
    }

    // Validación de salida sin ingreso previo
    let personaEnOficina = registroES.some(entry => entry.persona === persona && entry.oficina === oficina && entry.registro === "Ingreso");
    if (registro === "Salida" && !personaEnOficina) {
        alert("No se puede registrar la salida. La persona no ha ingresado previamente.");
        return;
    }

    // Guardar el nuevo registro
    let ES = { persona, oficina, registro, fecha, hora };
    let index = localStorage.getItem("editIndex");

    if (index !== null) {
        registroES[index] = ES;
        alert("El registro fue editado correctamente.");
    } else {
        registroES.push(ES);
        alert("El registro fue agregado correctamente.");
    }

    localStorage.setItem("registroES", JSON.stringify(registroES));
    console.log("Registro guardado:", ES);
    window.location.href = "indexES.html";
}





// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
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

function exportarPDFES() {
    const { jsPDF } = window.jspdf;

    let doc = new jsPDF({
        orientation: "landscape", // Modo horizontal para más espacio
        unit: "mm",
        format: "a4"
    });

    doc.setFontSize(18);
    doc.text("Lista de Registros", 14, 15);

    // Obtener la tabla y convertirla en un formato compatible con autoTable
    let filas = [];
    let encabezados = [];

    // Obtener todas las filas de la tabla
    document.querySelectorAll("#registroES-list tr").forEach((fila, index) => {
        let celdas = Array.from(fila.querySelectorAll("td")).map(td => td.innerText);
        if (index === 0) { // Primera fila para los encabezados
            encabezados = ["Persona","Oficina", "Tipo de Registro", "Fecha", "Hora"];
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
    doc.save("Lista_de_Registros.pdf");
}

function exportarExcelES() {
    let tabla = document.querySelector("table"); // Seleccionar la tabla completa

    if (!tabla) {
        alert("No hay datos para exportar.");
        return;
    }

    let wb = XLSX.utils.table_to_book(tabla, { sheet: "Registros" });
    XLSX.writeFile(wb, "Lista_de_registros.xlsx");
}

function generarGraficosES() {
    let registros = JSON.parse(localStorage.getItem("registroES")) || [];

    if (registros.length === 0) {
        console.warn("No hay datos para generar los gráficos.");
        return;
    }

    let conteoPersonas = {};
    let ocupacionOficinas = {};
    let personasDentro = {};

    registros.forEach(entry => {
        if (entry.registro === "Ingreso") {
            conteoPersonas[entry.persona] = (conteoPersonas[entry.persona] || 0) + 1;
        }
        ocupacionOficinas[entry.oficina] = (ocupacionOficinas[entry.oficina] || 0) + 1;

        if (entry.registro === "Ingreso") {
            personasDentro[entry.persona] = entry.oficina;
        } else if (entry.registro === "Salida") {
            delete personasDentro[entry.persona];
        }
    });

    let labelsPersonas = Object.keys(conteoPersonas);
    let dataPersonas = Object.values(conteoPersonas);

    let labelsOficinas = Object.keys(ocupacionOficinas);
    let dataOficinas = Object.values(ocupacionOficinas);

    let labelsDentro = Object.keys(personasDentro);
    let dataDentro = labelsDentro.map(p => personasDentro[p]);

    new Chart(document.getElementById("graficoPersonas"), {
        type: "bar",
        data: {
            labels: labelsPersonas,
            datasets: [{
                label: "Ingresos por Persona",
                data: dataPersonas,
                backgroundColor: "rgba(75, 192, 192, 0.5)"
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Personas con más ingresos",
                    color: "white"
                },
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        color: "white"
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "white"
                    }
                },
                y: {
                    ticks: {
                        color: "white"
                    }
                }
            }
        }
    });

    new Chart(document.getElementById("graficoOficinas"), {
        type: "doughnut",
        data: {
            labels: labelsOficinas,
            datasets: [{
                label: "Ocupación por Oficina",
                data: dataOficinas,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Ocupación de oficinas",
                    color: "white"
                },
                legend: {
                    display: true,
                    position: "right",
                    labels: {
                        color: "white"
                    }
                }
            }
        }
    });

    new Chart(document.getElementById("graficoPersonasDentro"), {
        type: "pie",
        data: {
            labels: labelsDentro,
            datasets: [{
                label: "Personas dentro de oficinas",
                data: dataDentro.map(() => 1),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"]
            }]
        },
        options: {
            plugins: {
                title:{
                    display: true,
                    text: "Personas dentro de oficinas",
                    color: "white"
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        color: "white"
                    }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarES();
    generarGraficosES();
});

