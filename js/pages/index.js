//localStorage(clear)
const apiKey = '4622ec444e15b7b102d80062a71b234e';
const apiUrl = 'https://api.themoviedb.org/3';

// Obtén los elementos necesarios
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const secPeliculas = document.getElementById('sec_peliculas');

// Define la cantidad de películas por página y la página actual
const peliculasPorPagina = 4;
let paginaActual = 1;
let peliculas = []; // Variable global para almacenar las películas

// Función para consultar la cartelera de películas
async function consultarCartelera() {
  try {
    // Realizar la consulta a la API
    const response = await fetch(`${apiUrl}/movie/now_playing?api_key=${apiKey}&language=es`);
    const data = await response.json();

    // Almacenar las películas en una variable global
    peliculas = data.results;

    // Mostrar las películas en la página
    mostrarPeliculas();
  } catch (error) {
    console.error('Error al consultar la cartelera:', error);
  }
}

// Función para mostrar las películas en la página
function mostrarPeliculas() {
  // Calcula el índice inicial y final de las películas a mostrar
  const indiceInicial = (paginaActual - 1) * peliculasPorPagina;
  const indiceFinal = indiceInicial + peliculasPorPagina;

  // Obtiene las películas correspondientes a la página actual
  const peliculasPagina = peliculas.slice(indiceInicial, indiceFinal);

  // Limpia el contenedor de películas
  secPeliculas.innerHTML = '';

  peliculasPagina.forEach(pelicula => {
    const peliculaElemento = document.createElement('div');
    peliculaElemento.classList.add('pelicula');
    peliculaElemento.setAttribute('data-codigo', pelicula.id);

    // Agregar el contenido de cada película en el DOM
    const posterUrl = pelicula.poster_path ? `https://image.tmdb.org/t/p/w500/${pelicula.poster_path}` : 'imagen-no-disponible.jpg';
    peliculaElemento.innerHTML = `
      <img class="poster" src="${posterUrl}" alt="${pelicula.title}" />
      <h3 class="titulo">${pelicula.title}</h3>
      <p>
        <b>Código:</b> ${pelicula.id}<br>
        <b>Título original:</b> ${pelicula.original_title}<br>
        <b>Idioma original:</b> ${pelicula.original_language}<br>
        <b>Año:</b> ${pelicula.release_date}<br>
      </p>
      <button class="button radius btnAgregar" data-codigo="${pelicula.id}">Agregar a favoritos</button>
    `;

    secPeliculas.appendChild(peliculaElemento);
  });

  // Asignar el evento de clic al botón "Agregar a favoritos"
  const botonesAgregar = document.querySelectorAll('.btnAgregar');
  botonesAgregar.forEach(btnAgregar => {
    btnAgregar.addEventListener('click', async () => {
      const codigo = btnAgregar.getAttribute('data-codigo');
      agregarPeliculaAFavoritos(codigo);
    });
  });

  // Actualizar la visibilidad de los botones de paginación
  btnAnterior.disabled = paginaActual === 1;
  btnSiguiente.disabled = peliculas.length <= indiceFinal;
}

// Función para ir a la página anterior
function irPaginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarPeliculas();
  }
}

// Función para ir a la página siguiente
function irPaginaSiguiente() {
  const totalPaginas = Math.ceil(peliculas.length / peliculasPorPagina);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    mostrarPeliculas();
  }
}

// Agrega los event listeners a los botones de paginación
btnAnterior.addEventListener('click', irPaginaAnterior);
btnSiguiente.addEventListener('click', irPaginaSiguiente);

function agregarPeliculaAFavoritos(codigo) {
  const peliculaExistente = buscarPeliculaPorCodigo(codigo);
  if (peliculaExistente) {
    const mensajeDuplicado = document.getElementById('mensajeDuplicado');
    mensajeDuplicado.textContent = 'Pelicula ingresada ya se encuentra almacenada.';
    return;
  }

  try {
    // Consultar la información completa de la película desde la API
    fetch(`${apiUrl}/movie/${codigo}?api_key=${apiKey}&language=es`)
      .then(response => response.json())
      .then(data => {
        if (data.status_code && data.status_code === 34) {
          mostrarMensajeError('La película no existe.');
        } else {
          const pelicula = {
            codigo: data.id,
            titulo: data.title,
            tituloOriginal: data.original_title,
            idiomaOriginal: data.original_language,
            anio: data.release_date,
          };

          agregarAFavoritos(pelicula);
          mostrarMensajeExito('Película agregada a favoritos con éxito.');
        }
      })
      .catch(error => {
        console.error('Error al consultar la película:', error);
        mostrarMensajeError('La Película seleccionada no se encuentra en la API o se produjo un error al consultar.');
      });
  } catch (error) {
    console.error('Error al consultar la película:', error);
    mostrarMensajeError('La Película seleccionada no se encuentra en la API o se produjo un error al consultar.');
  }
}

// Función para mostrar un mensaje de error
function mostrarMensajeError(mensaje) {
  const mensajesElemento = document.getElementById('sec-messages');
  mensajesElemento.innerHTML = '';
  const mensajeError = document.createElement('p');
  mensajeError.classList.add('rojo');
  mensajeError.textContent = mensaje;
  mensajesElemento.appendChild(mensajeError);
}

// Función para mostrar un mensaje de éxito
function mostrarMensajeExito(mensaje) {
  const mensajesElemento = document.getElementById('sec-messages');
  mensajesElemento.innerHTML = '';
  const mensajeExito = document.createElement('p');
  mensajeExito.classList.add('verde');
  mensajeExito.textContent = mensaje;
  mensajesElemento.appendChild(mensajeExito);
}



// Función para buscar una película por código
function buscarPeliculaPorCodigo(codigo) {
  const favoritos = obtenerFavoritos();
  return favoritos.find(pelicula => pelicula.codigo === codigo);
}

// Función para obtener la lista de favoritos del Local Storage
function obtenerFavoritos() {
  const favoritosString = localStorage.getItem('favoritos');
  return favoritosString ? JSON.parse(favoritosString) : [];
}

// Función para agregar una película a la lista de favoritos
function agregarAFavoritos(pelicula) {
  // Lógica para agregar la película a la lista de favoritos
  const favoritos = obtenerFavoritos();
  favoritos.push(pelicula);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// Función para mostrar un mensaje de error
function mostrarMensajeError(mensaje) {
  console.error('Error:', mensaje);
}

// Llamar a la función consultarCartelera al cargar la página
window.addEventListener('DOMContentLoaded', consultarCartelera);





