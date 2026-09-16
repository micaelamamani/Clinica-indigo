function manejarTarjetaMedica() {
    const tarjeta = document.getElementById('tarjetaMedica');
    
    // Si la tarjeta no tiene la clase, la agrega (se abre el menú flotante). Si ya la tiene, la quita (se cierra).
    tarjeta.classList.toggle('expandida');
}
