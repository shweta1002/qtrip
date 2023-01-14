
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  const cityParams = new URLSearchParams(search);
  return cityParams.get('city');

}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  const cityAdventureApi = `${config.backendEndpoint}/adventures?city=${city}`;
  const apiResponse = { 'data': null, 'msg': ''};
  try {

    const adventuresData = await fetch(cityAdventureApi);
    if(adventuresData.ok){

      apiResponse['data'] = await adventuresData.json();

    }else{

      console.log('Error in Api response');
      
    }
    
  } catch (error) {

    console.log(error);
  }

  return apiResponse['data'];
  
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  const row = document.getElementById('data');
  adventures.forEach(adventure => {
    const outerDivElem = document.createElement('div');
    const adventureLink = document.createElement('a');
    const card = outerDivElem.cloneNode(false);
    const categoryDiv = outerDivElem.cloneNode(false);
    const adventureImage = document.createElement('img');
    const cardBody = outerDivElem.cloneNode(false);
    const parentDiv = outerDivElem.cloneNode(false);
    const adventureTime = (adventure.duration > 1) ? `${adventure.duration} hours` : `${adventure.duration} hour`;

    outerDivElem.classList.add("col-6","col-lg-3","mb-3");

    adventureLink.setAttribute('href', `detail/?adventure=${adventure.id}`);
    adventureLink.setAttribute('id',`${adventure.id}`);

    card.classList.add("activity-card","card");
    
    adventureImage.classList.add('card-img-top');
    adventureImage.setAttribute('src', `${adventure.image}`);
    adventureImage.setAttribute('alt',`${adventure.name}`);

    categoryDiv.classList.add('category-banner');
    categoryDiv.innerText = adventure.category;

    cardBody.classList.add("card-body","p-0");
    parentDiv.classList.add("w-100","d-lg-inline-flex","justify-content-lg-between","p-2","fw-bold", "text-capitalize");

    const durationDiv = parentDiv.cloneNode(true);
    parentDiv.appendChild(document.createElement('div').appendChild(document.createTextNode(adventure.name)).parentNode);
    parentDiv.appendChild(document.createElement('div').appendChild(document.createTextNode('₹'+adventure.costPerHead)).parentNode);
    
    durationDiv.appendChild(document.createElement('div').appendChild(document.createTextNode('Duration')).parentNode);
    durationDiv.appendChild(document.createElement('div').appendChild(document.createTextNode(adventureTime)).parentNode);

    card.append(adventureImage,categoryDiv);
    card.appendChild(cardBody).append(parentDiv,durationDiv);
    outerDivElem.appendChild(adventureLink).appendChild(card);
    row.append(outerDivElem);
  })
  
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  const filteredDuration = list.filter(function(duration){
    return (duration.duration>=low && duration.duration<=high);
  });
  
  return filteredDuration;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  const filteredCategory = list.filter(function(category) {
    return categoryList.includes(category.category);
  });
  
  return filteredCategory;

}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  const {duration, category} = filters;

  if(category.length>0){
    list = filterByCategory(list,category);
  }


  if(duration!==''){
    let adventureDuration = duration.split('-');
    list = filterByDuration(list,adventureDuration[0],adventureDuration[1]);
  }

  // Place holder for functionality to work in the Stubs
  return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  window.localStorage.setItem('filters', JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  let localStorageFilters = JSON.parse(window.localStorage.getItem('filters'));
  
  // Place holder for functionality to work in the Stubs
  return localStorageFilters;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  const categoryListElem = document.getElementById('category-list');
  
  const {duration, category} = filters;

  if(duration!==''){
    document.getElementById("duration-select").value = duration;
  }
  
  if(category.length>0){

    category.forEach(categoryName => {
      const categoryDiv = document.createElement('div');
      const filterPillDiv = document.createElement('div');
      filterPillDiv.classList.add('filter-pill');

      const filterClose = document.createElement('button');
      filterClose.classList.add("btn-close","btn-sm","filter-pill-close");
      filterClose.setAttribute('aria-label','Close');
      filterClose.setAttribute('name', categoryName);

      filterPillDiv.appendChild(filterClose);
      
      categoryDiv.classList.add("category-filter");
      categoryDiv.setAttribute('id', categoryName);

      categoryDiv.appendChild(filterPillDiv);
      categoryDiv.appendChild(document.createElement('div').appendChild(document.createTextNode(categoryName)).parentNode);
      
      categoryListElem.appendChild(categoryDiv);
    });

  }
  
}

async function addNewAdventure(){
  const addAdentureApi= `${config.backendEndpoint}/adventures/new`;
  const city = new URLSearchParams(window.location.search).get('city');
  const response = await fetch(addAdentureApi, {
                                      method: 'POST',
                                      cache: 'no-cache',
                                      headers: {'Content-Type': 'application/json'},body: JSON.stringify({"city":city}) // body data type must match "Content-Type" header
                                  });
  return response.json();
}

function removeSelectedCategory(event,filters){
  document.getElementById('data').innerHTML='';
  const filterName = event.target.name;
  
  filters['category'] = filters['category'].filter(item => {
      return item !== filterName;
  });

  
  const removeSelCategory = document.getElementById(filterName);
  
  removeSelCategory.remove();
  
  return filters;
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
  addNewAdventure,
  removeSelectedCategory
};
