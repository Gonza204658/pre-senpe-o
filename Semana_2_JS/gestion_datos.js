// Objeto que contiene múltiples productos, cada uno con id, nombre y precio

const productos = {
    producto1: { id: 1, nombre: "Laptop", precio: 1500000 },
    producto2: { id: 2, nombre: "Mouse", precio: 45000 },
    producto3: { id: 3, nombre: "Teclado", precio: 80000 },
    producto4: { id: 4, nombre: "Monitor", precio: 950000 },
    producto5: { id: 5, nombre: "Audífonos", precio: 120000 },
};

console.log("=== LISTA COMPLETA DE PRODUCTOS (Objeto) ===");
console.log(productos);

// Un Set almacena valores únicos, elimina automáticamente los duplicados

const idsProductos = new Set([1, 2, 3, 2, 4, 1, 5, 3]);

console.log("\n=== SET DE IDs (duplicados eliminados) ===");
console.log(idsProductos);

// Agregar un nuevo número al Set con .add()
idsProductos.add(6);
console.log("\n--- Después de agregar el id 6 ---");
console.log(idsProductos);

// Verificar si un número existe en el Set con .has()
console.log("\n--- ¿Existe el id 3 en el Set? ---");
console.log(idsProductos.has(3)); // true

console.log("--- ¿Existe el id 10 en el Set? ---");
console.log(idsProductos.has(10)); // false

// Eliminar un número del Set con .delete()
idsProductos.delete(6);
console.log("\n--- Después de eliminar el id 6 ---");
console.log(idsProductos);

// Recorrer el Set con for...of
console.log("\n--- Recorriendo el Set con for...of ---");
for (const id of idsProductos) {
    console.log(`ID en el Set: ${id}`);
}

// Un Map relaciona una clave (categoría) con un valor (nombre del producto)

const categoriaProductos = new Map([
    ["Computadores", "Laptop"],
    ["Periféricos", "Mouse"],
    ["Periféricos", "Teclado"],
    ["Pantallas", "Monitor"],
    ["Audio", "Audífonos"],
]);

console.log("\n=== MAP DE CATEGORÍAS Y PRODUCTOS ===");
console.log(categoriaProductos);


// for...in para recorrer propiedades y valores del objeto
console.log("\n=== ITERACIÓN CON for...in (Objeto) ===");
for (const clave in productos) {
    const producto = productos[clave];
    console.log(`${clave} → ID: ${producto.id} | Nombre: ${producto.nombre} | Precio: $${producto.precio}`);
}

// Object.keys() — lista solo las claves del objeto
console.log("\n--- Object.keys() ---");
console.log(Object.keys(productos));

// Object.values() — lista solo los valores del objeto
console.log("\n--- Object.values() ---");
console.log(Object.values(productos));

// Object.entries() — lista pares [clave, valor] del objeto
console.log("\n--- Object.entries() ---");
Object.entries(productos).forEach(([clave, valor]) => {
    console.log(`${clave}:`, valor);
});

// for...of para recorrer el Set
console.log("\n=== ITERACIÓN CON for...of (Set) ===");
for (const id of idsProductos) {
    console.log(`ID único: ${id}`);
}

// forEach() para recorrer el Map
console.log("\n=== ITERACIÓN CON forEach() (Map) ===");
categoriaProductos.forEach((nombreProducto, categoria) => {
    console.log(`Categoría: ${categoria} → Producto: ${nombreProducto}`);
});


// Función que valida que un producto tenga id, nombre y precio válidos

function validarProducto(producto) {
    // Verifica que el id sea un número mayor a 0
    if (typeof producto.id !== "number" || producto.id <= 0) {
        console.error(`Error: El producto "${producto.nombre}" tiene un id inválido.`);
        return false;
    }
    // Verifica que el nombre sea un string no vacío
    if (typeof producto.nombre !== "string" || producto.nombre.trim() === "") {
        console.error("Error: El producto tiene un nombre inválido o vacío.");
        return false;
    }
    // Verifica que el precio sea un número mayor a 0
    if (typeof producto.precio !== "number" || producto.precio <= 0) {
        console.error(`Error: El producto "${producto.nombre}" tiene un precio inválido.`);
        return false;
    }
    return true;
}

// Prueba de validación con todos los productos del objeto
console.log("\n=== VALIDACIÓN DE PRODUCTOS ===");
for (const clave in productos) {
    const producto = productos[clave];
    const esValido = validarProducto(producto);
    console.log(`${producto.nombre}: ${esValido ? " Válido" : " Inválido"}`);
}

// Prueba con un producto inválido para verificar el console.error()
console.log("\n--- Prueba con producto inválido ---");
const productoInvalido = { id: -1, nombre: "", precio: 0 };
validarProducto(productoInvalido);


console.log("\n=== RESUMEN FINAL ===");
console.log(`Total de productos en el objeto: ${Object.keys(productos).length}`);
console.log(`Total de IDs únicos en el Set: ${idsProductos.size}`);
console.log(`Total de categorías en el Map: ${categoriaProductos.size}`);
