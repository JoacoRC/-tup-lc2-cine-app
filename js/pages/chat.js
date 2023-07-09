// Variables globales
const URL_BASE = 'https://api.themoviedb.org/3';
const API_KEY ='4622ec444e15b7b102d80062a71b234e'
const CONTENEDOR_PELICULAS = document.querySelector('.contenedorPeliculas');
const PAGINACION = document.querySelector('#paginacion');
const BTN_ANTERIOR = document.querySelector('#btnAnterior');
const BTN_SIGUIENTE = document.querySelector('#btnSiguiente');

// Función para consultar la cartelera
async function consultarCartelera() {
  try {
    const url = `${URL_BASE}/movie/now_playing?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const peliculas = data.results;
    mostrarPeliculas(peliculas);
  } catch (error) {
    console.error('Error al consultar la cartelera:', error);
  }
}

// Función para mostrar las películas en el DOM
function mostrarPeliculas(peliculas) {
  CONTENEDOR_PELICULAS.innerHTML = '';

  peliculas.forEach(pelicula => {
    const peliculaElement = document.createElement('div');
    peliculaElement.classList.add('pelicula');
    peliculaElement.dataset.codigo = pelicula.id;

    peliculaElement.innerHTML = `
      <h3>${pelicula.title}</h3>
      <p>${pelicula.overview}</p>
      <button class="btnFavorito">Agregar a Favoritos</button>
    `;

    CONTENEDOR_PELICULAS.appendChild(peliculaElement);
  });
}

// Función para agregar una película favorita
function agregarPeliculaFavorita(codigo) {
  const pelicula = {
    codigo: codigo,
    titulo: '',
    resumen: ''
  };

  // Realizar la consulta a la API para obtener los detalles de la película
  consultarDetallePelicula(codigo)
    .then(detalle => {
      pelicula.titulo = detalle.title;
      pelicula.resumen = detalle.overview;

      // Agregar la película a la lista de favoritos
      agregarAFavoritos(pelicula);

      // Actualizar el DOM en favorities.html
      mostrarFavoritos(getFavoritos());
    })
    .catch(error => {
      console.error('Error al obtener los detalles de la película:', error);
    });
}

// Función para consultar los detalles de una película
async function consultarDetallePelicula(codigo) {
  try {
    const url = `${URL_BASE}/movie/${codigo}?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error al consultar los detalles de la película');
  }
}

// Evento submit del formulario para agregar películas favoritas
const form = document.querySelector('.form-container');
form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const codigoInput = document.querySelector('input[name="codigo"]');
  const codigo = codigoInput.value;
  agregarPeliculaFavorita(codigo);

  codigoInput.value = '';
});

// Obtener las películas favoritas almacenadas en el Local Storage
function getFavoritos() {
  const favoritos = localStorage.getItem('favoritos');
  return favoritos ? JSON.parse(favoritos) : [];
}

// Agregar una película a la lista de favoritos
function agregarAFavoritos(pelicula) {
  const favoritos = getFavoritos();
  favoritos.push(pelicula);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// Inicializar la aplicación
consultarCartelera();