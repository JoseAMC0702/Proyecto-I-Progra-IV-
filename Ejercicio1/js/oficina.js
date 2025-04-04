function cargarOficinas() {
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || []; // Obtener datos o array vacío
    let tbody = document.getElementById("oficinas-list");

    tbody.innerHTML = ""; // Limpiar tabla antes de llenar

    if (oficinas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay datos disponibles</td></tr>`;
        return;
    }

    oficinas.forEach((oficina, index) => {
        let row = `<tr>
            <td>${oficina.id}</td>
            <td>${oficina.nombre}</td>
            <td>${oficina.ubicacion}</td>
            <td>${oficina.cantidadOF}</td>
            <td>
                <button class="btn btn-warning btn-sm admin-only" onclick="editarOficina(${index})"><i class="bi bi-pencil"></i>Editar</button>
                <button class="btn btn-danger btn-sm admin-only" onclick="eliminarOficina(${index})"><i class="bi bi-trash"></i>Eliminar</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}


function eliminarOficina(index) {
    // Obtener las oficinas del localStorage
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];

    // Confirmar la eliminación
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
        // Eliminar el registro
        oficinas.splice(index, 1);

        // Actualizar el localStorage con los datos modificados
        localStorage.setItem("oficinas", JSON.stringify(oficinas));

        // Recargar los datos en la tabla
        cargarOficinas();
        alert("La oficina fue eliminada correctamente.");
    }
}


function editarOficina(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formOficinas.html";
}

function guardarOficina(event) {

    event.preventDefault();
    let form = event.target;

    if(!form.checkValidity()){
        event.stopPropagation();
        form.classList.add('was-validated')
        return;
    }
    let id = document.getElementById("id").value;
    let nombre = document.getElementById("nombre").value;
    let ubicacion = document.getElementById("ubicacion").value;
    let cantidadOF = Number(document.getElementById("cantidadOF").value);


    if (!id || !nombre || !ubicacion) {
        alert("Todos los campos son obligatorios");
        return;
    }
    else {
        let oficina = { id, nombre, ubicacion, cantidadOF };
        let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];

        let index = localStorage.getItem("editIndex");
        if (index !== null) {
            oficinas[index] = oficina;
            alert("La oficina fue editada correctamente.");
        } else {
            oficinas.push(oficina);
            alert("La oficina fue agregada correctamente.");
        }

        localStorage.setItem("oficinas", JSON.stringify(oficinas));
        window.location.href = "indexOficina.html";
    }


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
let map;
let marker;

function initMap() {
    let defaultLocation = { lat: 9.7489, lng: -83.7534 };

    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 15
    });

    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true
    });

    // Evento para actualizar la ubicación cuando se arrastra el marcador
    google.maps.event.addListener(marker, "dragend", function (event) {
        actualizarUbicacion(event.latLng.lat(), event.latLng.lng());
    });

    // Evento para mover el marcador al hacer clic en el mapa
    google.maps.event.addListener(map, "click", function (event) {
        marker.setPosition(event.latLng);
        actualizarUbicacion(event.latLng.lat(), event.latLng.lng());
    });

    // Cargar datos si es edición
    let index = localStorage.getItem("editIndex");
    if (index !== null) {
        let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
        let oficina = oficinas[index];

        if (oficina.ubicacion) {
            let coordenadas = oficina.ubicacion.split(" "); // Separar lat y lng
            let lat = parseFloat(coordenadas[0]);
            let lng = parseFloat(coordenadas[1]);

            let newPosition = new google.maps.LatLng(lat, lng);
            marker.setPosition(newPosition);
            map.setCenter(newPosition);
            actualizarUbicacion(lat, lng);
        }
    }
}

function actualizarUbicacion(lat, lng) {
    document.getElementById("ubicacion").value = `${lat} ${lng}`;
}
