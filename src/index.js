const COUNTRIES_URL = 'http://localhost:3000/api/v1/countries'

const countryCard = document.getElementById("country-container")
const travelShow = document.querySelector("travel-show")

const ACTIVITIES_URL = 'http://localhost:3000/api/v1/activities'



let allCountries = []
let allActivities = []
let countryActivities

document.addEventListener("DOMContentLoaded", function(event) {
  const countryCard = document.getElementById("country-container")
  const travelShow = document.querySelector(".travel-show")

  getCountries(COUNTRIES_URL)
  getActivities(ACTIVITIES_URL)

  countryCard.addEventListener("click", e => {

    if (e.target.src) {
      countryActivities = filterActivitiesById(e.target.id)
      // console.log(countryActivities);
      // console.log(e.target.dataset.country);
      travelShow.innerHTML = createActivities(countryActivities, e.target.dataset.country)
    }
  })

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
  fetch(url)
    .then( resp => resp.json())
    .then( activities => allActivities = activities)
}


//------------------------------ Create HTML -----------------------------------

function createCountries(countries) {
  return countries.map( country => {
    return `<div class="country-card" data-id="${country.id}">
              <h1> ${country.name} </h1>
              <img id="${country.id}" class="image-card" src="./assets/images/Destinations/country_${country.id}.jpg" data-country="${country.name}" alt="Picture of ${country.name}">
            </div>
            <!--end of country card -->`
  }).join("")
}

function createActivities(activities, country_name) {
  return activities.map( activity => {
    return `<h1> Activities in ${country_name} </h1>
            <div class="activity-container" data-id="${activity.id}">
             <div class="activity-card">
               <h2>${activity.name}</h2>
               <img src="./assets/images/Activities/activity_${activity.id}.jpg">
               <p>${activity.company}</p>
               <p>Price: $${activity.price}</p>
               <p>Tickets Remaining: ${activity.positions_open}</p>
               <p>${activity.city}</p>
               <p>Rating: ${activity.rating}/5.0</p>
               <p>Description: ${activity.description}</p>
               <p>Category: ${activity.category}</p>
             </div>
            </div>`
  })
}

//------------------------------ Helpers ---------------------------------------

function filterActivitiesById(id) {
  return allActivities.filter( activity => activity.country_id === parseInt(id))
}
