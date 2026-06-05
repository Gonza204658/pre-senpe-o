// Mini app de gestión de productos con DOM, Local Storage y Fetch API
// API base: JSON Server corriendo en http://localhost:3000/productos

// Guardo la dirección de mi API en una constante para no repetirla en todo el código
const API_URL = "http://localhost:3000/productos";

// Busco cada elemento del HTML por su id y lo guardo en una variable para usarlo después
const inputNombre      = document.getElementById("inputNombre");       // el campo de texto donde escribo el nombre
const inputPrecio      = document.getElementById("inputPrecio");       // el campo numérico donde escribo el precio
const inputDescripcion = document.getElementById("inputDescripcion");  // el campo de texto donde escribo la descripción
const btnAgregar       = document.getElementById("btnAgregar");        // el botón que agrega un producto
const btnSincronizar   = document.getElementById("btnSincronizar");    // el botón que sincroniza con la API
const listaProductos   = document.querySelector("#listaProductos");    // el <ul> donde voy a mostrar los productos
const mensajeError     = document.getElementById("mensajeError");      // el párrafo rojo donde muestro errores
const mensajeExito     = document.getElementById("mensajeExito");      // el párrafo verde donde muestro éxitos

// Imprimo en consola para verificar que encontré bien todos los elementos del HTML
console.log("=== REFERENCIAS DEL DOM ===");
console.log("Input nombre:", inputNombre);
console.log("Input precio:", inputPrecio);
console.log("Input descripción:", inputDescripcion);
console.log("Lista:", listaProductos);


// Intento recuperar los productos guardados en Local Storage
// Si no hay nada guardado, uso un arreglo vacío para no romper el código
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Aviso en consola cuántos productos recuperé al cargar la página
console.log(`=== CARGA INICIAL: ${productos.length} producto(s) recuperado(s) de Local Storage ===`);

// Por cada producto que había guardado, lo dibujo en la pantalla automáticamente
productos.forEach(producto => crearElementoProducto(producto));


// Esta función revisa que los campos no estén vacíos y que el precio sea válido
function validarCampos(nombre, precio, descripcion) {

    // Si el nombre o la descripción están vacíos, muestro error y detengo todo
    if (!nombre || !descripcion) {
        mostrarMensaje("error", "Todos los campos son obligatorios.");
        return false; // devuelvo false para que quien me llamó sepa que falló
    }

    // Si el precio no es un número o es menor o igual a 0, muestro error y detengo todo
    if (isNaN(precio) || Number(precio) <= 0) {
        mostrarMensaje("error", "El precio debe ser un número mayor a 0.");
        return false; // devuelvo false para que quien me llamó sepa que falló
    }

    return true; // todo está bien, devuelvo true
}


// Esta función muestra un mensaje en pantalla, ya sea de error (rojo) o de éxito (verde)
function mostrarMensaje(tipo, texto) {

    if (tipo === "error") {
        mensajeError.textContent = texto;        // escribo el texto del error
        mensajeError.style.display = "block";    // hago visible el párrafo rojo
        mensajeExito.style.display = "none";     // escondo el párrafo verde por si estaba visible
        console.error(`Error: ${texto}`);        // también lo muestro en consola como error
    } else {
        mensajeExito.textContent = texto;        // escribo el texto de éxito
        mensajeExito.style.display = "block";    // hago visible el párrafo verde
        mensajeError.style.display = "none";     // escondo el párrafo rojo por si estaba visible
        console.log(`HECHO ${texto}`);           // también lo muestro en consola normal
    }

    // Después de 3 segundos (3000 milisegundos) escondo ambos mensajes automáticamente
    setTimeout(() => {
        mensajeError.style.display = "none";
        mensajeExito.style.display = "none";
    }, 3000);
}


// Escucho el clic del botón Agregar — uso async porque voy a hablar con la API
btnAgregar.addEventListener("click", async () => {

    // Leo lo que el usuario escribió en cada campo y le quito espacios al inicio y al final
    const nombre      = inputNombre.value.trim();
    const precio      = inputPrecio.value.trim();
    const descripcion = inputDescripcion.value.trim();

    // Antes de hacer cualquier cosa, valido los campos
    // Si algo está mal, la función valida devuelve false y salgo del evento sin hacer nada
    if (!validarCampos(nombre, precio, descripcion)) return;

    // Armo el objeto del nuevo producto sin id — json-server me va a asignar uno automáticamente
    const nuevoProducto = {
        nombre,                   // nombre que escribió el usuario
        precio: Number(precio),   // convierto el precio a número para que no quede como texto
        descripcion               // descripción que escribió el usuario
    };

    // Primero envío el producto a la API con POST y espero la respuesta
    // La respuesta trae el mismo producto pero ya con el id que le asignó json-server
    const productoGuardado = await crearProductoAPI(nuevoProducto);

    // Si la API falló y no devolvió nada, detengo todo para no guardar datos basura
    if (!productoGuardado) return;

    // Con el producto que devolvió la API (con id real), lo dibujo en la pantalla
    crearElementoProducto(productoGuardado);

    // Lo agrego al arreglo en memoria
    productos.push(productoGuardado);

    // Guardo el arreglo actualizado en Local Storage
    guardarEnLocalStorage();

    // Muestro mensaje de éxito en pantalla
    mostrarMensaje("exito", `Producto "${nombre}" agregado correctamente.`);

    // Limpio los campos para que el usuario pueda agregar otro producto
    inputNombre.value = "";
    inputPrecio.value = "";
    inputDescripcion.value = "";

    // Pongo el cursor de vuelta en el campo nombre para facilitar el uso
    inputNombre.focus();
});


// Esta función crea un <li> con la info del producto y lo inserta en la lista del DOM
function crearElementoProducto(producto) {

    // Creo un elemento <li> nuevo que todavía no está en la página
    const li = document.createElement("li");

    // Le escribo el contenido con los datos del producto
    li.textContent = `[ID: ${producto.id}] ${producto.nombre} - $${producto.precio} | ${producto.descripcion}`;

    // Le agrego un atributo data-id para identificarlo fácilmente si lo necesito
    li.setAttribute("data-id", producto.id);

    // Creo el botón Eliminar que va a vivir dentro de este <li>
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar"; // le pongo el texto

    // Escucho el clic del botón Eliminar — uso async porque voy a hablar con la API
    btnEliminar.addEventListener("click", async () => {

        // Elimino el <li> del DOM usando removeChild en el padre (la lista)
        listaProductos.removeChild(li);

        // Filtro el arreglo para quedarme con todos los productos EXCEPTO el que eliminé
        productos = productos.filter(p => p.id !== producto.id);

        // Actualizo el Local Storage con el arreglo sin el producto eliminado
        guardarEnLocalStorage();

        // Le digo a la API que elimine ese producto con DELETE
        await eliminarProductoAPI(producto.id);

        // Muestro mensaje de éxito
        mostrarMensaje("exito", `Producto "${producto.nombre}" eliminado.`);
        console.log(`Producto eliminado: "${producto.nombre}"`);
    });

    // Meto el botón Eliminar dentro del <li>
    li.appendChild(btnEliminar);

    // Meto el <li> dentro del <ul> para que aparezca en pantalla
    listaProductos.appendChild(li);
}


// Esta función guarda el arreglo actual de productos en Local Storage
function guardarEnLocalStorage() {
    // JSON.stringify convierte el arreglo a texto porque Local Storage solo guarda texto
    localStorage.setItem("productos", JSON.stringify(productos));
    console.log(`Guardado Local Storage actualizado: ${productos.length} producto(s).`);
}


// GET — Le pido a la API todos los productos que tiene guardados
async function obtenerProductosAPI() {
    try {
        const response = await fetch(API_URL); // hago la petición GET a la URL
        const data = await response.json();    // convierto la respuesta a un arreglo de objetos
        console.log("GET - Productos obtenidos de la API:", data);
        return data; // devuelvo el arreglo para usarlo donde me llamaron
    } catch (error) {
        // Si algo falla (por ejemplo, el servidor está apagado), muestro el error
        console.error("Error en GET:", error);
        mostrarMensaje("error", "No se pudo conectar con la API.");
    }
}


// POST — Envío un producto nuevo a la API para que lo guarde
async function crearProductoAPI(producto) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",                                      // indico que es una petición POST
            headers: { "Content-Type": "application/json" },    // le digo que voy a enviar JSON
            body: JSON.stringify(producto)                       // convierto el objeto a texto JSON para enviarlo
        });
        const data = await response.json(); // convierto la respuesta — trae el producto con su id nuevo
        console.log("POST - Producto enviado a la API:", data);
        return data; // devuelvo el producto con id para usarlo en el DOM y Local Storage
    } catch (error) {
        console.error("Error en POST:", error);
        mostrarMensaje("error", "No se pudo agregar el producto en la API.");
    }
}


// PUT — Actualizo un producto que ya existe en la API
async function actualizarProductoAPI(id, productoActualizado) {
    try {
        // La URL incluye el id del producto que quiero actualizar
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",                                       // indico que es una petición PUT
            headers: { "Content-Type": "application/json" },    // le digo que voy a enviar JSON
            body: JSON.stringify(productoActualizado)            // envío el producto con los datos nuevos
        });
        const data = await response.json(); // convierto la respuesta al objeto actualizado
        console.log("PUT - Producto actualizado en la API:", data);
    } catch (error) {
        console.error("Error en PUT:", error);
    }
}


// DELETE — Le digo a la API que elimine el producto con ese id
async function eliminarProductoAPI(id) {
    try {
        // La URL incluye el id del producto que quiero eliminar
        await fetch(`${API_URL}/${id}`, { method: "DELETE" }); // no necesito leer respuesta
        console.log(`DELETE - Producto con ID ${id} eliminado de la API.`);
    } catch (error) {
        console.error("Error en DELETE:", error);
    }
}


// Escucho el clic del botón Sincronizar — use async porque voy a hablar con la API
btnSincronizar.addEventListener("click", async () => {
    console.log("Sincronizando con la API...");

    // Le pido a la API todos sus productos
    const productosAPI = await obtenerProductosAPI();

    // Si la API falló y no devolvió nada, detengo todo
    if (!productosAPI) return;

    // Limpio completamente la lista del DOM para no tener duplicados
    listaProductos.innerHTML = "";

    // Reemplazo el arreglo en memoria con lo que vino de la API
    productos = productosAPI;

    // Guardo en Local Storage los productos frescos de la API
    guardarEnLocalStorage();

    // Dibujo cada producto en pantalla
    productos.forEach(producto => crearElementoProducto(producto));

    // Muestro cuántos productos cargué
    mostrarMensaje("exito", `Sincronización completa: ${productos.length} producto(s) cargado(s).`);
});