const COUNTRIES_URL = 'http://localhost:3000/api/v1/countries'
const ACTIVITIES_URL = 'http://localhost:3000/api/v1/activities'
const countryCard = document.getElementById("country-container")
  let activitiesContainer = document.getElementById("activities-container")
let allCountries = []
let allActivities = []
let countryActivities
let foundActivity

document.addEventListener("DOMContentLoaded", function(event) {
  let countryCard = document.getElementById("country-container")
  let activitiesContainer = document.getElementById("activities-container")
  let activityShow = document.getElementById("activity-show")

  getCountries(COUNTRIES_URL)
  getActivities(ACTIVITIES_URL)

  countryCard.addEventListener("click", e => {
    if(e.target.src) {
      countryActivities = filterActivitiesById(e.target.id)
      countryCard.style.display = "none"
      activitiesContainer.innerHTML = `<h1> Activities in ${e.target.dataset.country}: </h1>`
      activitiesContainer.innerHTML += createActivities(countryActivities, e.target.dataset.country)
    }
  })
    activitiesContainer.addEventListener("click", e => {
      if(e.target.className === "more-info"){
        foundActivity = findActivity(e.target.dataset.id)
        activitiesContainer.style.display = "none"
        activityShow.innerHTML = createActivity([foundActivity])
      }
    })

  document.addEventListener("click", e=>{
    if(e.target.id === "logo-image"){
      console.log("you clicked the logo")
      // write code to redirect to countries view
    }
    if(e.target.id === "purchase-button"){
        let myActivity = findActivity(e.target.dataset.id)
        let travelShow = document.querySelector(".travel-show")
        travelShow.innerHTML = `
        <div id="form-div">
        <form>
        <h2>Purchase Form</h2>
        <h3>Chosen Activity:${myActivity.name}</h3>
        <h4>Price: $${myActivity.price}</h4>
        <label class="ui black ribbon label">Name:</label><br>
        <input class="ui fluid icon input" type="text" name="name" placeholder="Enter Name"><br>
        <label class="ui black ribbon label">Email:</label><br>
        <input class="ui fluid icon input" type="text" name="Email" placeholder="Enter Email"><br>
        <label class="ui black ribbon label">Quantity:</label><br>
        <input class="ui fluid icon input" type="text" name="quantity" placeholder="Enter quantity"><br>
        <label class="ui black ribbon label">Desired Date:</label><br>
        <input class="ui fluid icon input" type="date" name="Activity-Date"><br><br>
        <input class="ui green button" type="submit" value="Submit">
        </form>
        </div>`
    }
  })// TO DO: WRITE CODE TO COLLECT FORM INFO

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
              <button class="more-info" data-id="${activity.id}"> See details </button>
            </div>
            <!--end of ${activity.name} activity card -->`
  }).join("")
}

function createActivity(activity) {
  return activity.map( info => {
    return `
      <div class="detail-card" data-id="${info.id}">
         <h1>${info.name}</h1>
         <img src="./assets/images/Activities/activity_${info.id}.jpg"><hr>
         <h3>${info.description}</h3>
         <h4> Run by: ${info.company}</h4>
         <h4> Price: $ ${info.price}</h4>
         <h4>Tickets available: ${info.positions_open}</h4>
         <button data-id="${info.id} "id="purchase-button"> Purchase </button>
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
