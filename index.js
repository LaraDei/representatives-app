'use strict';

// put your own value below!
//var geocoder = new google.maps.Geocoder;
const apiKeyGoogle = 'AIzaSyAet-71OT4G0Y0ty-p_1lqA7YZ1e45MW1Y'; 
const searchURL = 'https://www.googleapis.com/civicinfo/v2/representatives';
const VoteUrlJ = 'https://api.votesmart.org/Officials.getByOfficeState?key=429c49885c2420058c8c1aa27e4989d9&stateId=NA&officeId=77&officeTypeId=J&o=JSON'
const VoteUrlLE = 'https://api.votesmart.org/Local.getOfficials?key=429c49885c2420058c8c1aa27e4989d9';

//
function findMe() {

}; 

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}



function displayResultsGoogleAPI(responseJson) {
    let title = '';
    let photo = '';
    let name = '';
    // for each object in the data array, add a item to the results 
    //list with the title, Name, description?, and url
    for( let i = 0; i < responseJson.offices.length; i++){


        //federal executive branch
        if(responseJson.offices[i].divisionId === 'ocd-division/country:us' ){
          title =  responseJson.offices[i].name;
          name = responseJson.officials[responseJson.offices[i].officialIndices].name;

          $('#fed-executive').append(
            `
            <div class="results-row">
              <div class="result-Cell"><p>${title}</p><p>${name}</p></div>
            </div> 
            `
          );
        };


        //federal legislative branch
        if(responseJson.offices[i].divisionId.includes('state:') && responseJson.offices[i].levels[0] === 'country'){
          title =  responseJson.offices[i].name;
          responseJson.offices[i].officialIndices.map( index => { 
              name = responseJson.officials[index].name;
            
          $('#fed-legislative').append(
              `
              <div class="results-row">
                <div class="result-Cell"><p>${title}</p><p>${name}</p></div>
              </div> 
              `
            );
          })
        };

        //state judicial branch
        if(responseJson.offices[i].levels[0] === 'administrativeArea1' && responseJson.offices[i].name.includes('Court')) {
            title =  responseJson.offices[i].name;
            responseJson.offices[i].officialIndices.map( index => { 
              name = responseJson.officials[index].name;
              
      
              $('#state-judicial').append(
                `
                <div class="results-row">
                  <div class="result-Cell"><p>${title}</p><p>${name}</p></div>
                </div> 
                `
              );
            })
          };
        
        //state legislative branch
        if ((responseJson.offices[i].name.includes('Senator') || responseJson.offices[i].name.includes('Assemblymember')) && responseJson.offices[i].levels[0] === 'administrativeArea1' ) {
            title =  responseJson.offices[i].name;
            responseJson.offices[i].officialIndices.map( index => { 
              name = responseJson.officials[index].name;
              
      
              $('#state-legislative').append(
                `
                <div class="results-row">
                  <div class="result-Cell"><p>${title}</p><p>${name}</p></div>
                </div> 
                `
              );
            })
          };

        //state executive branch
        if (responseJson.offices[i].levels[0] === 'administrativeArea1' && !responseJson.offices[i].name.includes('Senator') && !responseJson.offices[i].name.includes('Assemblymember') && !responseJson.offices[i].name.includes('Court')) {
            title =  responseJson.offices[i].name;
            responseJson.offices[i].officialIndices.map( index => { 
              name = responseJson.officials[index].name;
              
      
              $('#state-executive').append(
                `
                <div class="results-row">
                  <div class="result-Cell"><p>${title}</p><p>${name}</p></div>
                </div> 
                `
              );
            })
          };

        //local executive branch
        if (responseJson.offices[i].levels[0] === 'administrativeArea2') {
            title =  responseJson.offices[i].name;
            responseJson.offices[i].officialIndices.map( index => { 
              name = responseJson.officials[index].name;
              
      
              $('#local-executive').append(
                `
                <div class="results-row">
                  <div class="result-Cell"><p>${title}</p><p>${name}</p></div>
                </div> 
                `
              );
            })
          }; 
    };
     //local judicial branch
     $('#local-judicial').append(
        `
        <div class="results-row">
          <div class="result-Cell"><p>Municipal Court</p></div>
        </div> 
        `
      );
    //call other URL for missing data 
    otherAPI(VoteUrlJ)
    
  };
  
 function displayResultsVoteSMartAPI(responseJson){
     console.log(responseJson.candidateList.candidate)
     let title = '';
     let name = '';
     let first = '';
     let last = '';
     for( let i = 0; i < responseJson.candidateList.candidate.length; i++){

        title =  responseJson.candidateList.candidate[i].officeName;
        first = responseJson.candidateList.candidate[i].firstName
        last = responseJson.candidateList.candidate[i].lastName
        name = `${first} ${last}`
        

        $('#fed-judicial').append(
          `
          <div class="results-row">
            <div class="result-Cell"><p>${title}</p><p>${name}</p></div>
          </div> 
          `
        );
      
    }
    $('#results').removeClass('hidden')
  }



function cleanObj(params){
   for(var key in params){
     if(params[key].length === 0){
       delete params[key];
     }
   }
    return params;
}

function getReps(searchAddress, searchLevel) {
  const params = {
    address: searchAddress,
    key: apiKeyGoogle,
    //level: searchLevel
  };

  
  const queryString = formatQueryParams(cleanObj(params))
  const googleUrl = searchURL + '?' + queryString;

  console.log(googleUrl);

  fetch(googleUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson =>  {
      if(responseJson.offices.length === 0) {
        $('#js-error-message').text(`Sorry! Looks like there aren't any results matching ${search-address} in ${search-level}. Please try again.`)
      } 
      $('#results-list').empty();
      console.log(responseJson)
      displayResultsGoogleAPI(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results-list').empty();
    });
}


function otherAPI(url){
fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson =>  {
    console.log(responseJson)
    displayResultsVoteSMartAPI(responseJson);
  })
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
    $('#results-list').empty();
  });
}

//listeners

function watchAddress(){
//watch for address lookup
$('#address-search').click(event => {
    event.preventDefault();
    console.log('address lookup')
    // run google geolocation api in findMe
    findMe(); 
    });    
}


function watchForm() {
//watch for submit 
 $('form').submit(event => {
    event.preventDefault();
    $('#js-error-message').empty();
    $('#results').addClass('hidden');
    //declare submitted values
    const searchAddress = $('#js-search-address').val();
    const searchLevel = $('#js-search-level').val();
    console.log(searchAddress)
    // run api function
    getReps(searchAddress, searchLevel);
  });
}

// function watchRep() {
//     $('#address-search').click(event => {
//         event.preventDefault();
//         console.log('rep lookup')
//         // run google geolocation api in findMe
//         renderRepData(); 
//         });    
// }

//handler

function handleSearchApp() {
    watchAddress()
    watchForm()
}

$(handleSearchApp);



