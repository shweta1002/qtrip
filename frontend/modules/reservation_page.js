import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  // 1. Fetch Reservations by invoking the REST API and return them
  const reservationApi = `${config.backendEndpoint}/reservations/`;
  const apiResponse = { 'data': null, 'msg': ''};
  try {

    const reservationDetails = await fetch(reservationApi);
    if(reservationDetails.ok){

      apiResponse['data'] = await reservationDetails.json();

    }else{

      console.log('Error in Api response');
    }
    
  } catch (error) {

    console.log(error);

  }
  
  // Place holder for functionality to work in the Stubs
  return apiResponse['data'];
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table

  //Conditionally render the no-reservation-banner and reservation-table-parent
  if(reservations.length>0){

    document.getElementById('no-reservation-banner').style.display='none';
    document.getElementById('reservation-table-parent').style.display='block';

    reservations.forEach(item => {
      
      const tableBody = document.getElementById('reservation-table');
      const tableRow = document.createElement('tr');
      const date = new Date(item.date).toLocaleDateString('en-IN',{day:'numeric', month:'numeric', year:'numeric'});

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const bookingDate = new Date(item.time).toLocaleDateString('en-IN',options);
      const bookingTime = new Date(item.time).toLocaleTimeString('en-IN');
      
      tableRow.innerHTML = `<td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.adventureName}</td>
                            <td>${item.person}</td>
                            <td>${date}</td>
                            <td>${item.price}</td>
                            <td>${bookingDate}, ${bookingTime}</td>
                            <td><div class="reservation-visit-button" id="${item.id}"><a href="../detail/?adventure=${item.adventure}">Visit Adventure</a></div></td>
                            `;

      tableBody.appendChild(tableRow);

    });

    
  }else{

    document.getElementById('no-reservation-banner').style.display='block';
    document.getElementById('reservation-table-parent').style.display='none';

  }
  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */

}

export { fetchReservations, addReservationToTable };
