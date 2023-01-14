import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const adventureParams = new URLSearchParams(search);
  
  if(adventureParams.has('adventure') && adventureParams.get('adventure')!==''){
    return adventureParams.get('adventure');
  }

  // Place holder for functionality to work in the Stubs
  return null;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  
  const apiResponse = { 'data': null, 'msg': ''};
  if(adventureId!==null){
    
    const adventureDetailApi = `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`;
      try {
        const adventureDetails = await fetch(adventureDetailApi);
        if(adventureDetails.ok){
          apiResponse['data'] = await adventureDetails.json();
        }else{
          console.log('Error in fetching adventure details');
        }
        
      } catch (error) {
        console.log(error);
      }

      return apiResponse['data'];
  }

  // Place holder for functionality to work in the Stubs
  return null;
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  if(adventure!==null){
    const adventureName = document.getElementById('adventure-name');
    const subTitle = document.getElementById('adventure-subtitle');
    const imageGallery = document.getElementById('photo-gallery');
    const adventureContent = document.getElementById('adventure-content');

    adventureName.append(adventure.name);
    subTitle.append(adventure.subtitle);
    
    if(adventure.content !== ''){
      adventureContent.append(adventure.content);
    }

    if(adventure.images.length > 0){
      const adventureImages = adventure.images;
      
      adventureImages.forEach(image => {

        const imgElem = document.createElement('img');
        imgElem.className = "activity-card-image";
        imgElem.setAttribute('src',image);
        imgElem.setAttribute('alt',adventure.name);

        imageGallery.append(imgElem);
        
      })
    }

  }
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images
  if(images.length>0){
    const imageCarousel = document.getElementById('photo-gallery');
    const carouselElement = `<div id="adventureCarousel" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-indicators"></div>
                                <div class="carousel-inner"></div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#adventureCarousel" data-bs-slide="prev">
                                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                  <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#adventureCarousel" data-bs-slide="next">
                                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                  <span class="visually-hidden">Next</span>
                                </button>
                              </div>`;
    
    imageCarousel.innerHTML = carouselElement;
    images.forEach((value, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.className = `carousel-item${index===0 ? ` active` : ''}`;

      const carouselImg = document.createElement('img');
      carouselImg.className = "d-block w-100 activity-card-image";
      carouselImg.setAttribute('src',value);
      carouselImg.setAttribute('alt', `Slide ${index+1}`);

      carouselItem.appendChild(carouselImg);
      document.querySelector('.carousel-inner').append(carouselItem);

      const indicatorBtn = `<button type="button" data-bs-target="#adventureCarousel" data-bs-slide-to="${index}" ${index===0 ? `class="active" aria-current="true"` : '' } aria-label="Slide ${index+1}"></button>`;
      document.querySelector('.carousel-indicators').innerHTML += indicatorBtn;
    });

    

    

  }
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  const soldOutPanel = document.getElementById('reservation-panel-sold-out');
  const reservationPanel = document.getElementById('reservation-panel-available');
  const costPerHead = document.getElementById('reservation-person-cost');

  if(adventure!==null){
    
    if(!adventure.available){
      reservationPanel.style.display='none';
      soldOutPanel.style.display='block';
    }else{
      soldOutPanel.style.display='none';
      reservationPanel.style.display='block';
      costPerHead.innerHTML = adventure.costPerHead;
    }

  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  const reservationCost = document.getElementById('reservation-cost');
  const totalCost = (adventure.costPerHead*persons );
  reservationCost.innerHTML = totalCost;

}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  const reservationApi = `${config.backendEndpoint}/reservations/new`;
  const reservationForm = document.getElementById('myForm');
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const resevationDate = new Date(reservationForm.elements['date'].value);
    const reservationData = {
      name : reservationForm.elements['name'].value,
      date : resevationDate,
      person : reservationForm.elements['person'].value,
      adventure : adventure.id
    };

    const options = {
      method : 'POST',
      headers : { 'Content-Type': 'application/json; charset=UTF-8' },
      body : JSON.stringify(reservationData),
    };

    fetch(reservationApi, options).then(response => {
      if(!response.ok){
        alert('Failed!');
        throw Error(response.status);
      }
      return response.json();
    }).then(data => {

      console.log(data);
      alert('Success!');
      location.reload();

    }).catch(e => {

      console.log(e);
      alert('Failed!');

    });
    
  })
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  const reservedBanner = document.getElementById('reserved-banner');
  (!adventure.reserved) ? reservedBanner.style.display='none' : reservedBanner.style.display='block';
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
