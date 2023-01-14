import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();
  //Updates the DOM with the cities
  cities.forEach((key) => {
    addCityToDOM(key.id, key.city, key.description, key.image);
  });
}

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data
  const citiesApi = `${config.backendEndpoint}/cities`;
  const errorResponse = { 'data': null, 'msg': ''};
  
  return fetch(citiesApi)
        .then(citiesList => citiesList.json())
        .then(citiesList => { return citiesList; })
        .catch(err => { 
          console.log(err);
          return errorResponse.data; 
        });
  
}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM
  const cityCard = document.getElementById('data');
  const divElement = document.createElement('div');
  const cityLink = document.createElement('a');
  const cityImage = document.createElement('img');

  divElement.classList.add("col-6", "col-md-6", "col-lg-3","pb-4");

  cityLink.setAttribute('href',`pages/adventures/?city=${id}`);
  cityLink.setAttribute('id',id);

  const divTile = document.createElement('div');
  divTile.classList.add('tile');

  cityImage.setAttribute('src',image);
  cityImage.setAttribute('alt',city);
  cityImage.classList.add('rounded', 'd-block');

  divTile.appendChild(cityImage);

  const divTileText = document.createElement('div');
  divTileText.classList.add("tile-text", "text-center", "mb-3");
  
  
  if(!city || city!==''){
    const cityName = document.createElement('div');
    cityName.textContent = city;
    divTileText.appendChild(cityName);
  }

  if(!description || description!==''){
    const cityDesc = document.createElement('div');
    cityDesc.textContent = description;
    divTileText.appendChild(cityDesc);
  }

  cityLink.appendChild(divTile).appendChild(divTileText);
  divElement.appendChild(cityLink);
  cityCard.appendChild(divElement);
}

export { init, fetchCities, addCityToDOM };
