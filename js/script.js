// CALLING ELEMENTS
let movieList = $(".movie-list-js");
let movieRes = $("#template-movies-js").content;

let searchForm = $(".wrapper-form-js");
let searchPlace = $(".search-movie-js", searchForm);

let elModalMovie = $(".js-modal-movie");

const elSpinner = document.querySelector(".loading-spinner");

// TOOLS FOR PAGINATION

const btnBox = $(".js-btn-box");  
const btnNext = $(".next-js-btn");
const btnBack = $(".back-js-btn");

let amount = 0;

// RENDER MOVIES

let renderMovies = data => {
  movieList.innerHTML = '';

  let movieWrapper = document.createDocumentFragment()

  data.forEach(film => {
    let cloneMovie = movieRes.cloneNode(true);

    cloneMovie.querySelector('.movie-img-js').src = film.Poster;
    cloneMovie.querySelector('.movie-img-js').alt = film.Title;
    cloneMovie.querySelector('.js-result-item').dataset.movieId = film.imdbID;
    cloneMovie.querySelector('.movie-title-js').textContent = film.Title;

    movieWrapper.appendChild(cloneMovie);
  })

  movieList.appendChild(movieWrapper);
}

// ERROR CATCHER

let catchErrors = (error) => {
  movieList.innerHTML = '';
  
  let errorItem = document.createElement("li");
  
  errorItem.innerHTML = `
  <h5 class="mt-2 h1 link-danger">${error}</h5>
  `;
  
  movieList.appendChild(errorItem);
}


// FETCH API

const showMovie = async (title, page) => {
  try {
    let response = await fetch (`http://www.omdbapi.com/?apikey=83a076fe&s=${title}&page=${page}`);
    
    let data = await response.json();
    renderMovies(data.Search);
    
    movieList.addEventListener('click', evt => {
      if (evt.target.matches('.js-movie-info-button')) {
        let movieId = evt.target.closest(".js-result-item").dataset.movieId;
        
        let foundMovies = data.Search.find(movie => {
          return movie.imdbID === movieId;
        })
    
        $('.js-modal-movie-title', elModalMovie).textContent = foundMovies.Title;
        $('.js-modal-movie-year', elModalMovie).textContent = `Year: ${foundMovies.Year}`;
        $('.js-modal-movie-imdbID', elModalMovie).textContent = `Id: ${foundMovies.imdbID}`;
        $('.js-modal-movie-type', elModalMovie).textContent = `Type: ${foundMovies.Type}`;
      }
    })
    let max = 0;
    max = Number(data.totalResults);
    amount = max;
  } catch (err) {
    catchErrors('Searched movie was not found!');
  } finally {
    addLoader();
  }
}

showMovie('man', 1);

// FORM LISTENER AND PAGINATION

searchForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  movieList.innerHTML = '';
  removeLoader();
  
  elInputVal = searchPlace.value.trim();
  
  showMovie(elInputVal);
  
  searchPlace.value = '';
  
  btnBox.classList.add('d-block');
  btnBox.classList.remove('d-none');
  let current = 1;

  btnNext.addEventListener('click', () => {
    if (current < Math.ceil(amount/10)) {
      current += 1;
      showMovie(elInputVal, current);
    }
  })
  
  btnBack.addEventListener('click', () => {
    if (current > 1) {
      current -= 1;
      showMovie(elInputVal, current);
    }
  })
})

// SPINNER

function removeLoader() {
  elSpinner.classList.remove("d-none");
}

function addLoader() {
  elSpinner.classList.add("d-none");
}