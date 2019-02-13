const COUNTRIES_URL = 'http://localhost:3000/api/v1/countries'
const ACTIVITIES_URL = 'http://localhost:3000/api/v1/activities'
const countryCard = document.getElementById("country-container")
const activitiesContainer = document.getElementById("activities-container")


let allCountries = []
let allActivities = []
let countryActivities
let foundActivity

document.addEventListener("DOMContentLoaded", function(event) {
  const countryCard = document.getElementById("country-container")
  const activitiesContainer = document.getElementById("activities-container")
  const activityShow = document.getElementById("activity-show")

  getCountries(COUNTRIES_URL)
  getActivities(ACTIVITIES_URL)

  countryCard.addEventListener("click", e => {

    if (e.target.src) {
      countryActivities = filterActivitiesById(e.target.id)
      countryCard.style.display = "none"
      activitiesContainer.innerHTML = `<h1> Activities in ${e.target.dataset.country}: </h1>`
      activitiesContainer.innerHTML += createActivities(countryActivities, e.target.dataset.country)
    }
  })

  activitiesContainer.addEventListener("click", e => {
    foundActivity = findActivity(e.target.dataset.id)
    activitiesContainer.style.display = "none"
    activityShow.innerHTML = createActivity([foundActivity])
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
    return `<div class="activity-card" data-id="${activity.id}">
              <h2>${activity.name}</h2>
              <p>${activity.city}, ${country_name}</p>
              <img src="./assets/images/Activities/activity_${activity.id}.jpg" data-id="${activity.id}">
              <b><p>Price: $${activity.price}</p></b>
            </div>
            <!--end of ${activity.name} activity card -->`
  }).join("")
}

function createActivity(activity) {
  return activity.map( info => {
    return `<div class="activity-card" data-id="${info.id}">
              <img src="./assets/images/Activities/activity_${info.id}.jpg" data-id="${info.id}">
              <h2>${info.name}</h2>
              <h2>${info.city}</h2>
              <p>Price: $${info.price}</p>
              <p>Price: $${info.description}</p>
            </div>
            <!--end of ${info.name} showActivity card -->`
  })
}

//------------------------------ Helpers ---------------------------------------

function filterActivitiesById(id) {
  return allActivities.filter( activity => activity.country_id === parseInt(id))
}

function findActivity(id) {
  return allActivities.find(activity => activity.id === parseInt(id))
}
