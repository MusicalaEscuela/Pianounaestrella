async function cargarCSV() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvl5wFkBtcHRoO6kApvtZV4HLnGxDl2JeU1m1Bu-VddnAveX3FwTGOYnq9lcWnMWW0kP-TiyB7koC0/pub?gid=0&single=true&output=csv";
    const response = await fetch(url);
    const data = await response.text();
    const filas = data.split("\n").map(row => row.split(","));

    const headerRow = document.getElementById("headerRow");
    const tableBody = document.getElementById("tableBody");

    const columnasFijas = 5;
    const columnaInicial = 5;
    const columnaGenero = 2; // Columna C es índice 2

    // Crear encabezados
    for (let i = 0; i < columnasFijas; i++) {
        let th = document.createElement("th");
        th.textContent = filas[0][i];
        headerRow.appendChild(th);
    }
    let thExtra = document.createElement("th");
    thExtra.textContent = filas[0][columnaInicial];
    thExtra.id = "extraHeader";
    headerRow.appendChild(thExtra);

    // Obtener géneros únicos
    const generosSet = new Set();
    for (let i = 1; i < filas.length; i++) {
        const genero = filas[i][columnaGenero]?.trim();
        if (genero) generosSet.add(genero);
    }

    // Llenar el select de géneros
    const genreSelect = document.getElementById("genreSelect");
    generosSet.forEach(genero => {
        const option = document.createElement("option");
        option.value = genero;
        option.textContent = genero;
        genreSelect.appendChild(option);
    });

    // Función para cargar filas con filtros
    function cargarFilas(columnaIndex, filtroGenero = "todos", filtroTexto = "") {
        tableBody.innerHTML = ""; // Limpiar tabla

        for (let i = 1; i < filas.length; i++) {
            const fila = filas[i];
            const genero = fila[columnaGenero]?.toLowerCase() || "";
            const textoFila = fila.join(" ").toLowerCase();

            // Filtrado por género
            const coincideGenero = (filtroGenero === "todos") || (genero === filtroGenero.toLowerCase());

            // Filtrado por búsqueda de texto
            const coincideTexto = textoFila.includes(filtroTexto);

            if (coincideGenero && coincideTexto) {
                let tr = document.createElement("tr");
                for (let j = 0; j < columnasFijas; j++) {
                    let td = document.createElement("td");
                    td.textContent = fila[j];
                    tr.appendChild(td);
                }

                let tdExtra = document.createElement("td");
                let contenidoExtra = fila[columnaIndex];
                if (contenidoExtra && contenidoExtra.startsWith("http")) {
                    let link = document.createElement("a");
                    link.href = contenidoExtra;
                    link.textContent = "Ver";
                    link.target = "_blank";
                    tdExtra.appendChild(link);
                } else {
                    tdExtra.textContent = contenidoExtra || "";
                }
                tr.appendChild(tdExtra);
                tableBody.appendChild(tr);
            }
        }
    }

    // Inicializar tabla con todos los datos
    cargarFilas(columnaInicial);

    // Evento para cambiar columna (Notas, Partitura, etc.)
    const select = document.getElementById("columnSelect");
    select.addEventListener("change", () => {
        const columnaSeleccionada = select.value.charCodeAt(0) - 65;
        thExtra.textContent = filas[0][columnaSeleccionada];

        const filtroGenero = genreSelect.value;
        const filtroTexto = searchInput.value.toLowerCase();
        cargarFilas(columnaSeleccionada, filtroGenero, filtroTexto);
    });

    // Campo de búsqueda
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
        const filtroTexto = searchInput.value.toLowerCase();
        const columnaSeleccionada = select.value.charCodeAt(0) - 65;
        const filtroGenero = genreSelect.value;
        cargarFilas(columnaSeleccionada, filtroGenero, filtroTexto);
    });

    // Filtro por género
    genreSelect.addEventListener("change", () => {
        const filtroGenero = genreSelect.value;
        const filtroTexto = searchInput.value.toLowerCase();
        const columnaSeleccionada = select.value.charCodeAt(0) - 65;
        cargarFilas(columnaSeleccionada, filtroGenero, filtroTexto);
    });
}

// Cargar CSV al iniciar
cargarCSV();
