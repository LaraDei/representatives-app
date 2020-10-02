'use strict';

// keys and URLs
const apiKeyGoogle = 'AIzaSyAet-71OT4G0Y0ty-p_1lqA7YZ1e45MW1Y'; 
const searchUrlGoogle = 'https://www.googleapis.com/civicinfo/v2/representatives';
const apiKeyVoteSmart = '429c49885c2420058c8c1aa27e4989d9';
const searchUrlVoteSmart = 'https://api.votesmart.org/'
const voteSmartFeFjSj = 'https://api.votesmart.org/Officials.getStatewide?key=429c49885c2420058c8c1aa27e4989d9&o=JSON';
const voteSmartFlSeSl = 'https://api.votesmart.org/Officials.getByZip?key=429c49885c2420058c8c1aa27e4989d9&o=JSON';
const voteSmartLeLl = 'http://api.votesmart.org/Local.getOfficials?key=429c49885c2420058c8c1aa27e4989d9&o=JSON'
const getZip = 'https://us-street.api.smartystreets.com/street-address?key=16560337177517815&match=invalid'



//Params Object
const params = [
    {
        street: '',
        city: '',
        state: '',
        zipcode: '',
    },

    {
        zip5: '',
        zip4: '',
    },

    {
        city: '',
        state: '',
    },

    {
        localId: '',
    },

    {
        stateId: '',
    }


]

//store needed data in params -------------------------------------------------------------

function storeData(searchStreet, searchCity, searchState, searchZip) {
    params[0].street = searchStreet;
    params[0].city = searchCity;
    params[0].state = searchState.toUpperCase();
    params[0].zipcode = searchZip;

    params[1].zip5 = searchZip;

    params[2].city = searchCity;
    params[2].state = searchState.toUpperCase();

    params[4].stateId = searchState.toUpperCase();
    console.log(params)

}






// formating get params

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}







//Get additional data needed zip 4 and local id ----------------------------------------------


function getdigitZip(str){

  //format 9digit zipcode query
  const smartyUrl = getZip +'&' + str;
  console.log(smartyUrl);

  //fetch 9 digit zipcode
  fetch(smartyUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson =>  {
        console.log(responseJson)
        let zipFour = '';
        for( let key in responseJson[0]){
          zipFour = responseJson[0].components.plus4_code;
        }
        params[1].zip4 = zipFour
      })
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        $('#results-list').empty();
      });
      //getLocalId(formatQueryParams(params[4]))
}

function getLocalId(str){
  //format local ID query
  const localIdUrl = searchUrlVoteSmart +'Local.getCities?key=429c49885c2420058c8c1aa27e4989d9&o=JSON&' + str;
  console.log(localIdUrl);

  //fetch local ID zipcode
  fetch(localIdUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson =>  {
        console.log(responseJson)
        let localId = '';
        for(let i = 0; i < responseJson.cities.city.length; i++){
          if(responseJson.cities.city[i].name === params[0].city){
            params[3].localId = responseJson.cities.city[i].localId;
          }
        }
        getReps(params)
      })
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        $('#results-list').empty();
      });
      
      

}




// Get Rep Data --------------------------------------------------------------------------


function getReps(params) {


  // get Fed Executive and Fed Judicial-------

  //format Officials query
  let repsFeFjUrl = voteSmartFeFjSj + '&stateId=NA';
  console.log(repsFeFjUrl);
  //fetch
  fetch(repsFeFjUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
      })
    .then(responseJson =>  {
      console.log(responseJson)
      renderResults1(responseJson);
      })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results-list').empty();
      });

        

    //get State Judicial-------

    //format Officials query
    let repsSjUrl = voteSmartFeFjSj + '&' + formatQueryParams(params[4]);
    console.log(repsSjUrl);
    //fetch
    fetch(repsSjUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
      })
    .then(responseJson =>  {
      console.log(responseJson)
      //renderResults1(responseJson);
      })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results-list').empty();
      });
  


    //get Fed Legislative, State Executive and State Legislative-------

    //format Officials query
    let repsFlSeSlUrl = voteSmartFlSeSl + '&' + formatQueryParams(params[1]);
    console.log(repsFlSeSlUrl);
  
    //fetch
    fetch(repsFlSeSlUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
      })
    .then(responseJson =>  {
      console.log(responseJson)
      //renderResults2(responseJson);
      })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results-list').empty();
      });



    //get Local Executive and Local Legislative-------

    //format Local query
    let repsLeLlUrl = voteSmartLeLl + '&' + formatQueryParams(params[3]);
    console.log(repsLeLlUrl);

    //fetch
    fetch(repsLeLlUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
      })
    .then(responseJson =>  {
      console.log(responseJson)
      //renderResults3(responseJson);
      })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results-list').empty();
      });
  
    // Local Judical -------


};
    
//render results----------------------------------------------------------------
function renderResults1(obj){
  let candidate = '';
  let title = '';
  let first = '';
  let last = '';
  let name = '';
  //loop through result obj
  for(let i = 0; i < obj.candidateList.candidate.length; i++){
      
    if(obj.candidateList.candidate[i].officeId === '1' || obj.candidateList.candidate[i].officeId === '2'){
        //console.log(candidateList.candidate[i])
        title =  obj.candidateList.candidate[i].title;
        first = obj.candidateList.candidate[i].firstName;
        last =  obj.candidateList.candidate[i].lastName;
        candidate = obj.candidateList.candidate[i].candidateId;
        name = `${first} ${last}`;
        //console.log(name)
        $('#fed-executive').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${title}</p><p><a href="#" id=${candidate}>${name}</a></p></div>
        </div> 
        `
        );
    }
    if(obj.candidateList.candidate[i].officeId === '77' || obj.candidateList.candidate[i].officeId === '76'){
        //console.log(candidateList.candidate[i])
        title =  obj.candidateList.candidate[i].title;
        first = obj.candidateList.candidate[i].firstName;
        last =  obj.candidateList.candidate[i].lastName;
        candidate = obj.candidateList.candidate[i].candidateId;
        name = `${first} ${last}`;
        //console.log(name)
        $('#fed-judicial').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${title}</p><p><a href="#" id=${candidate}>${name}</a></p></div>
        </div> 
        `
        );
    }
    if(obj.candidateList.candidate[i].officeId === '76' || obj.candidateList.candidate[i].officeId === '77'){
        //console.log(candidateList.candidate[i])
        title =  obj.candidateList.candidate[i].title;
        first = obj.candidateList.candidate[i].firstName;
        last =  obj.candidateList.candidate[i].lastName;
        candidate = obj.candidateList.candidate[i].candidateId;
        name = `${first} ${last}`;
        //console.log(name)
        $('#state-judicial').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${title}</p><p><a href="#" id=${candidate}>${name}</a></p></div>
        </div> 
        `
        );
    };
  };
  $('#results').removeClass('hidden');
};

function renderResults2(obj){
  let photo = '';
  let title = '';
  let first = '';
  let last = '';
  let name = `${first} ${last}`;
  //loop through result obj
  for(let i = 0; i < obj.candidateList.candidate.length; i++){
  };
  $('#results').removeClass('hidden');
};

function renderResults3(obj){
  let photo = '';
  let title = '';
  let first = '';
  let last = '';
  let name = `${first} ${last}`;
  //loop through result obj
  for(let i = 0; i < obj.candidateList.candidate.length; i++){
  };
//$('#results').removeClass('hidden');
};

  

  
//listeners-------------------------------------------------------------------

function watchForm() {
//watch for submit 
  $('form').submit(event => {
    event.preventDefault();
    $('#js-error-message').empty();
    $('#results-list').empty();
    $('#results').addClass('hidden');
    //declare submitted values
    const searchStreet = $('#js-search-street').val();
    const searchCity = $('#js-search-city').val();
    const searchState = $('#js-search-state').val();
    const searchZip = $('#js-search-zip').val();
        
    // store data
    storeData(searchStreet, searchCity, searchState, searchZip);
    //Get additional data needed zip 4 and local id
    getdigitZip(formatQueryParams(params[0]))
    getLocalId(formatQueryParams(params[4]))

  
  });
};


//handler

function handleSearchApp() {
    watchForm()
}

$(handleSearchApp);