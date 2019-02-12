const COUNTRIES_URL = 'http://localhost:3000/api/v1/countries'
const countryCard = document.getElementById("country-container")
const travelShow = document.querySelector("travel-show")

let allCountries = []

document.addEventListener("DOMContentLoaded", function(event) {


  console.log("Content Loaded");
  getCountries(COUNTRIES_URL)

}) // end DOMContentLoaded



//------------------------------ Fetch -----------------------------------------

function getCountries(url) {
  const countryCard = document.getElementById("country-container")
  fetch(url)
    .then( resp => resp.json())
    .then( countries => {
      allCountries = countries
      countryCard.innerHTML = createCountries(allCountries)
    })
}

function getActivities(url) {

}


//------------------------------ Create HTML -----------------------------------

function createCountries(countries) {
  return countries.map( country => {
    return `<div class="country-card" data-id="${country.id}">
              <h1> ${country.name} </h1>
              <img id="${country.id}" class="image-card" src="./assets/images/Destinations/country_${country.id}.jpg">
            </div>
            <!--end of country card -->`
  }).join("")
}
