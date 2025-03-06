let columnas = []; // Almacena las asignaturas y sus porcentajes
let estudiantes = []; // Almacena los estudiantes y sus notas

// Función para agregar una nueva columna (asignatura)
function agregarColumna() {
    const nombreColumna = document.getElementById("columna").value;
    const porcentajeColumna = parseFloat(document.getElementById("porcentaje").value);

    if (nombreColumna && porcentajeColumna && porcentajeColumna > 0 && porcentajeColumna <= 100) {
        const sumaPorcentajes = columnas.reduce((sum, col) => sum + col.porcentaje, 0);

        if (sumaPorcentajes + porcentajeColumna <= 100) {
            columnas.push({ nombre: nombreColumna, porcentaje: porcentajeColumna });
            actualizarTabla();
        } else {
            alert("La suma de los porcentajes no puede exceder el 100%.");
        }
    } else {
        alert("Por favor, ingrese todos los datos correctamente. El porcentaje debe ser mayor que 0 y menor que 100.");
    }

    document.getElementById("columna").value = '';
    document.getElementById("porcentaje").value = '';
}

// Función para agregar un nuevo estudiante
function agregarEstudiante() {
    const nombreEstudiante = prompt("Ingrese el nombre del estudiante:");

    if (nombreEstudiante) {
        let notas = [];
        let totalPorcentaje = 0;

        columnas.forEach(columna => {
            let nota = prompt(`Ingrese la nota para ${columna.nombre} (Porcentaje: ${columna.porcentaje}%)`);
            notas.push(parseFloat(nota));
            totalPorcentaje += columna.porcentaje;
        });

        if (totalPorcentaje === 100) {
            estudiantes.push({ nombre: nombreEstudiante, notas: notas });
            actualizarTabla();
        } else {
            alert("El total de los porcentajes debe ser 100%. Verifique las asignaturas.");
        }
    }
}

// Función para calcular la nota final de cada estudiante
function calcularNotaFinal(estudiante) {
    let notaFinal = 0;
    estudiante.notas.forEach((nota, index) => {
        notaFinal += (nota * (columnas[index].porcentaje / 100));
    });
    return notaFinal.toFixed(2);
}

// Función para actualizar la tabla cada vez que se agrega un estudiante o columna
function actualizarTabla() {
    const tabla = document.getElementById("tabla").getElementsByTagName('tbody')[0];
    tabla.innerHTML = ''; // Limpiar tabla antes de actualizar

    // Crear encabezados
    const encabezado = document.getElementById("tabla").getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];

    // Limpiar encabezados de asignaturas
    while (encabezado.cells.length > 1) {
        encabezado.deleteCell(1); // Eliminar las celdas extra de las columnas anteriores
    }

    // Añadir nuevas columnas de asignaturas
    columnas.forEach(columna => {
        const th = document.createElement("th");
        th.innerText = columna.nombre;
        encabezado.appendChild(th);
    });

    // Columna de "Nota Final"
    const thFinal = document.createElement("th");
    thFinal.innerText = "Nota Final";
    encabezado.appendChild(thFinal);

    // Añadir las filas de los estudiantes
    estudiantes.forEach(estudiante => {
        const fila = document.createElement("tr");

        // Nombre del estudiante
        const tdNombre = document.createElement("td");
        tdNombre.innerText = estudiante.nombre;
        fila.appendChild(tdNombre);

        // Notas del estudiante en cada asignatura
        estudiante.notas.forEach((nota) => {
            const tdNota = document.createElement("td");
            tdNota.innerText = nota;
            fila.appendChild(tdNota);
        });

        // Nota Final
        const tdNotaFinal = document.createElement("td");
        tdNotaFinal.innerText = calcularNotaFinal(estudiante);
        fila.appendChild(tdNotaFinal);

        // Acción de eliminar estudiante
        const tdAcciones = document.createElement("td");
        const btnEliminar = document.createElement("button");
        btnEliminar.innerText = "Eliminar";
        btnEliminar.onclick = () => eliminarEstudiante(estudiante.nombre);
        tdAcciones.appendChild(btnEliminar);
        fila.appendChild(tdAcciones);

        tabla.appendChild(fila);
    });
}

// Función para eliminar un estudiante
function eliminarEstudiante(nombreEstudiante) {
    estudiantes = estudiantes.filter(est => est.nombre !== nombreEstudiante);
    actualizarTabla();
}

// Función para exportar los datos a un archivo JSON
function exportarDatos() {
    const datos = { columnas, estudiantes };
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notas.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Función para importar los datos desde un archivo JSON
function importarDatos(event) {
    const archivo = event.target.files[0];
    if (archivo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const datos = JSON.parse(e.target.result);
                columnas = datos.columnas;
                estudiantes = datos.estudiantes;
                actualizarTabla();
            } catch (error) {
                alert("Hubo un error al importar el archivo.");
            }
        };
        reader.readAsText(archivo);
    }
}