//localStorage.clear()
// Función para consultar la información completa de una película
async function consultarPelicula(codigo) {
  try {
    // Realizar la consulta a la API
    const response = await fetch(`${apiUrl}/movie/${codigo}?api_key=${apiKey}&language=es`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al consultar la película:', error);
    throw error;
  }
}

// Obtener la lista de favoritos del Local Storage
function obtenerFavoritos() {
  const favoritos = localStorage.getItem('favoritos');
  return favoritos ? JSON.parse(favoritos) : [];
}

/// Función para obtener la URL completa del póster
function obtenerPosterUrl(posterPath) {
  if (posterPath) {
    return `https://image.tmdb.org/t/p/w500/${posterPath}`;
  } else {
    return 'imagen-no-disponible.jpg';
  }
}
function mostrarFavoritos() {
  const contenedorFavoritos = document.getElementById('sec_favoritos');
  const contenedorMensajes = document.getElementById('sec-messages');
  const favoritos = obtenerFavoritos();

  // Limpiar el contenedor antes de mostrar los favoritos
  contenedorFavoritos.innerHTML = '';
  contenedorMensajes.innerHTML = ''; // Limpiar también el contenedor de mensajes

  if (favoritos.length === 0) {
    // No hay películas favoritas
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No tiene películas seleccionadas en sus favoritas.';
    contenedorMensajes.appendChild(mensaje);
  } else {
    const codigosAgregados = new Set(); // Conjunto para almacenar los códigos de películas ya agregadas

    favoritos.forEach(pelicula => {
      // Verificar si el código de la película ya ha sido agregado para evitar duplicados
      if (!codigosAgregados.has(pelicula.codigo)) {
        // Agregar el código de la película al conjunto de códigos agregados
        codigosAgregados.add(pelicula.codigo);

        // Crear elementos para mostrar cada película favorita
        const peliculaDiv = document.createElement('div');
        peliculaDiv.classList.add('peliFav');
        peliculaDiv.setAttribute('data-codigo', pelicula.codigo);

        // Crear el contenido de la película favorita (título, resumen, póster, botón de quitar)
        const peliculaContenido = document.createElement('div');
        peliculaContenido.innerHTML = `
          <img class="poster" src="${obtenerPosterUrl(pelicula.poster_path)}" alt="${pelicula.title}" />
          <h3 class="titulo">${pelicula.title}</h3>
          <p>
            <b>Código:</b> ${pelicula.id}<br>
            <b>Título original:</b> ${pelicula.original_title}<br>
            <b>Idioma original:</b> ${pelicula.original_language}<br>
            <b>Año:</b> ${pelicula.release_date}<br>
          </p>
          <button class="button radius btnQuitar" data-codigo="${pelicula.id}">Quitar de Favoritos</button>
        `;

        // Agregar el evento de clic al botón "Quitar de Favoritos"
        const btnQuitar = peliculaContenido.querySelector('.btnQuitar');
        btnQuitar.addEventListener('click', () => {
          quitarDeFavoritos(pelicula.codigo);
          mostrarFavoritos(); // Volver a mostrar los favoritos después de quitar uno
        });

        peliculaDiv.appendChild(peliculaContenido);

        // Agregar el elemento de película favorita al contenedor
        contenedorFavoritos.appendChild(peliculaDiv);
      }
    });
  }
}




// Quitar una película de la lista de favoritos en el Local Storage
function quitarDeFavoritos(codigo) {
  console.log('Quitar de Favoritos:', codigo);
  let favoritos = obtenerFavoritos();
  const index = favoritos.findIndex(pelicula => pelicula.codigo === codigo);
  if (index !== -1) {
    favoritos.splice(index, 1);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }
}

// Función para mostrar un mensaje de éxito
function mostrarMensajeExito(mensaje) {
  console.log('Éxito:', mensaje);
}

// Llamar a la función mostrarFavoritos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  mostrarFavoritos();
});
