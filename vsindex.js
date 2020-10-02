'use strict';

// keys and URLs
const apiKeyGoogle = config.REACT_APP_GOOGLE_API_KEY;
const searchUrlGoogle = 'https://www.googleapis.com/civicinfo/v2/representatives';
const apiKeyVoteSmart = config.REACT_APP_VOTESMART_API_KEY;
const searchUrlVoteSmart = 'https://api.votesmart.org/'
const voteSmartFeFjSj = `https://api.votesmart.org/Officials.getStatewide?key=${apiKeyVoteSmart}&o=JSON`;
const voteSmartFlSeSl = `https://api.votesmart.org/Officials.getByZip?key=${apiKeyVoteSmart}&o=JSON`;
const voteSmartLeLl = `http://api.votesmart.org/Local.getOfficials?key=${apiKeyVoteSmart}&o=JSON`
const smartStreetApi = config.REACT_APP_SMARTSTREET_API_KEY
const getZip = `https://us-street.api.smartystreets.com/street-address?key=${smartStreetApi}&match=invalid`



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
        localId: '',
    },

    {
        stateId: '',
    }


]

//store needed data in params -------------------------------------------------------------

function storeData(searchStreet, searchCity, searchState, searchZip) {
    params[0].street = searchStreet.replaceAll('[^a-zA-Z0-9]', '');
    params[0].city = searchCity;
    params[0].state = searchState.toUpperCase();
    params[0].zipcode = searchZip;

    params[1].zip5 = searchZip;

    params[3].stateId = searchState.toUpperCase();

}






// formating get params

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}







//Get additional data needed zip 4 and local id ----------------------------------------------


function getdigitZip(str){
    // $('#local-executive').empty();
    // $('#local-legislative').empty();
    // $('#local-judicial').empty();
    // $('#state-executive').empty();
    // $('#state-legislative').empty();
    // $('#state-judicial').empty();
    // $('#fed-executive').empty();
    // $('#fed-legislative').empty();
    // $('#fed-judicial').empty();
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
        $('#results').addClass('hidden');
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
        for(let i = 0; i < responseJson.cities.city.length; i++){
          if(responseJson.cities.city[i].name === params[0].city){
            params[2].localId = responseJson.cities.city[i].localId;    
          }
        }

        getReps(params)
      })
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        $('#results').addClass('hidden');
      });
      console.log(params)
      

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
      renderResults(responseJson);
      })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results').addClass('hidden');
      });

        

    //get State Judicial-------

    //format Officials query
    let repsSjUrl = voteSmartFeFjSj + '&' + formatQueryParams(params[3]);
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
      renderResults(responseJson);
      })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results').addClass('hidden');
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
      renderResults2(responseJson);
      })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results').addClass('hidden');
      });



    //get Local Executive and Local Legislative-------

    //format Local query
    let repsLeLlUrl = voteSmartLeLl + '&' + formatQueryParams(params[2]);
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
      renderResults2(responseJson);
    //local court placeholder
    $('#local-judicial').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${params[0].city} City Municipal Court</p></p></div>
        </div> 
        `
        );
      })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results').addClass('hidden');
      });
  
    // Local Judical -------


};
    
//render results----------------------------------------------------------------
function renderResults(obj){
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
    if(obj.candidateList.candidate[i].officeName.includes('Supreme Court') && obj.candidateList.candidate[i].officeStateId === params[3].stateId){
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
  let candidate = '';
  let photo = '';
  let title = '';
  let first = '';
  let last = '';
  let name = `${first} ${last}`;
  //loop through result obj
  for(let i = 0; i < obj.candidateList.candidate.length; i++){
    if(obj.candidateList.candidate[i].officeId === '359'){
        //console.log(candidateList.candidate[i])
        title =  obj.candidateList.candidate[i].title;
        first = obj.candidateList.candidate[i].firstName;
        last =  obj.candidateList.candidate[i].lastName;
        candidate = obj.candidateList.candidate[i].candidateId;
        name = `${first} ${last}`;
        //console.log(name)
        $('#local-legislative').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${title}</p><p><a href="#" id=${candidate}>${name}</a></p></div>
        </div> 
        `
        );
    };
    if(obj.candidateList.candidate[i].officeId === '430' || obj.candidateList.candidate[i].officeId === '73'){
        //console.log(candidateList.candidate[i])
        title =  obj.candidateList.candidate[i].title;
        first = obj.candidateList.candidate[i].firstName;
        last =  obj.candidateList.candidate[i].lastName;
        candidate = obj.candidateList.candidate[i].candidateId;
        name = `${first} ${last}`;
        //console.log(name)
        $('#local-executive').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${title}</p><p><a href="#" id=${candidate}>${name}</a></p></div>
        </div> 
        `
        );
    };
    if(obj.candidateList.candidate[i].officeId === '7' || obj.candidateList.candidate[i].officeId === '9' || obj.candidateList.candidate[i].officeId === '8'){
        //console.log(candidateList.candidate[i])
        title =  obj.candidateList.candidate[i].title;
        first = obj.candidateList.candidate[i].firstName;
        last =  obj.candidateList.candidate[i].lastName;
        candidate = obj.candidateList.candidate[i].candidateId;
        name = `${first} ${last}`;
        //console.log(name)
        $('#state-legislative').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${title}</p><p><a href="#" id=${candidate}>${name}</a></p></div>
        </div> 
        `
        );
    };
    if(obj.candidateList.candidate[i].officeId === '3' || obj.candidateList.candidate[i].officeId === '4' || 
    obj.candidateList.candidate[i].officeId === '12' || obj.candidateList.candidate[i].officeId === '44'){
        //console.log(candidateList.candidate[i])
        title =  obj.candidateList.candidate[i].title;
        first = obj.candidateList.candidate[i].firstName;
        last =  obj.candidateList.candidate[i].lastName;
        candidate = obj.candidateList.candidate[i].candidateId;
        name = `${first} ${last}`;
        //console.log(name)
        $('#state-executive').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${title}</p><p><a href="#" id=${candidate}>${name}</a></p></div>
        </div> 
        `
        );
    };
    if(obj.candidateList.candidate[i].officeId === '6' || obj.candidateList.candidate[i].officeId === '5'){
        //console.log(candidateList.candidate[i])
        title =  obj.candidateList.candidate[i].title;
        first = obj.candidateList.candidate[i].firstName;
        last =  obj.candidateList.candidate[i].lastName;
        candidate = obj.candidateList.candidate[i].candidateId;
        name = `${first} ${last}`;
        //console.log(name)
        $('#fed-legislative').append(
        `
        <div class="results-row">
        <div class="result-Cell"><p>${title}</p><p><a href="#" id=${candidate}>${name}</a></p></div>
        </div> 
        `
        );
    };
  };
};


  

  
//listeners-------------------------------------------------------------------

function watchForm() {
//watch for submit 
  $('form').submit(event => {
    event.preventDefault();
    $('#js-error-message').empty();
    $('#results').addClass('hidden');
    $('#local-executive').empty();
    $('#local-legislative').empty();
    $('#local-judicial').empty();
    $('#state-executive').empty();
    $('#state-legislative').empty();
    $('#state-judicial').empty();
    $('#fed-executive').empty();
    $('#fed-legislative').empty();
    $('#fed-judicial').empty();
    //declare submitted values
    const searchStreet = $('#js-search-street').val();
    const searchCity = $('#js-search-city').val();
    const searchState = $('#js-search-state').val();
    const searchZip = $('#js-search-zip').val();
        
    // store data
    storeData(searchStreet, searchCity, searchState, searchZip);
    //Get additional data needed zip 4 and local id
    getdigitZip(formatQueryParams(params[0]))
    getLocalId(formatQueryParams(params[3]))

  
  });
};


//handler

function handleSearchApp() {
    watchForm()
}

$(handleSearchApp);