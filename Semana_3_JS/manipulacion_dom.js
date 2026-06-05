
// getElementById para seleccionar el input y la lista
const inputNota      = document.getElementById("inputNota");
const listaNotas     = document.getElementById("listaNotas");
const mensajeError   = document.getElementById("mensajeError");

// querySelector para seleccionar el botón
const btnAgregar     = document.querySelector("#btnAgregar");

// Log de referencias para confirmar que existen
console.log("=== REFERENCIAS DEL DOM ===");
console.log("Input:", inputNota);
console.log("Botón Agregar:", btnAgregar);
console.log("Lista de notas:", listaNotas);



// Recupera las notas guardadas en Local Storage o inicia con arreglo vacío
let notas = JSON.parse(localStorage.getItem("notas")) || [];

// Al cargar la página, renderiza todas las notas guardadas
console.log(`=== CARGA INICIAL: ${notas.length} nota(s) recuperada(s) de Local Storage ===`);
notas.forEach(texto => crearElementoNota(texto));



btnAgregar.addEventListener("click", () => {
    // Obtiene el valor del input y elimina espacios extra
    const texto = inputNota.value.trim();

    // Validación: el input no puede estar vacío
    if (texto === "") {
        mensajeError.style.display = "block";
        console.warn("Advertencia: Se intentó agregar una nota vacía.");
        return;
    }

    // Oculta el mensaje de error si había uno
    mensajeError.style.display = "none";

    // Crea el elemento en el DOM
    crearElementoNota(texto);

    // Agrega la nota al arreglo en memoria y guarda en Local Storage
    notas.push(texto);
    guardarEnLocalStorage();

    // Log de confirmación
    console.log(` Nota agregada: "${texto}"`);

    // Limpia el input y vuelve a enfocarlo
    inputNota.value = "";
    inputNota.focus();
});

// Permite agregar notas también presionando Enter
inputNota.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnAgregar.click();
});

// Función reutilizable para crear un <li> con su botón Eliminar
function crearElementoNota(texto) {
    // Crea el elemento <li>
    const li = document.createElement("li");

    // Asigna el texto de la nota con textContent
    li.textContent = texto;

    // Crea el botón Eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");

    // Evento click del botón Eliminar
    btnEliminar.addEventListener("click", () => {
        // Remueve el <li> de la <ul> con removeChild()
        listaNotas.removeChild(li);

        // Elimina la nota del arreglo en memoria
        notas = notas.filter(n => n !== texto);

        // Actualiza Local Storage
        guardarEnLocalStorage();

        // Log de confirmación
        console.log(` Nota eliminada: "${texto}"`);
    });

    // Inserta el botón dentro del <li>
    li.appendChild(btnEliminar);

    // Inserta el <li> dentro de la <ul> con appendChild()
    listaNotas.appendChild(li);
}

// Función reutilizable para guardar el arreglo en Local Storage
function guardarEnLocalStorage() {
    localStorage.setItem("notas", JSON.stringify(notas));
    console.log(` Local Storage actualizado: ${notas.length} nota(s) guardada(s).`);
    console.log("Estado actual:", notas);
}
