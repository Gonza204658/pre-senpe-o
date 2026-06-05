// Se solicita el nombre del usuario mediante prompt()
const nombreUsuario = prompt("¿Cuál es tu nombre?");

// Se solicita la edad del usuario mediante prompt()
// prompt() siempre devuelve un string, por eso se convierte a número con Number()
const edadUsuario = Number(prompt("¿Cuántos años tienes?"));


// isNaN() verifica si el valor NO es un número válido
if (isNaN(edadUsuario)) {
    // Si la edad no es un número, se muestra un mensaje de error en consola
    console.error("Error: Por favor, ingresa una edad válida en números.");

// Condicionales y mensajes dinámicos
} else if (edadUsuario < 18) {
    // Si la edad es menor a 18, se muestra mensaje para menor de edad
    console.log(`Hola ${nombreUsuario}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`);
    alert(`Hola ${nombreUsuario}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`);

} else {
    // Si la edad es mayor o igual a 18, se muestra mensaje para mayor de edad
    console.log(`Hola ${nombreUsuario}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`);
    alert(`Hola ${nombreUsuario}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`);
}