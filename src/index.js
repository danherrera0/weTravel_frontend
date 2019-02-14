const COUNTRIES_URL = "http://localhost:3000/api/v1/countries"                // RESTful url to GET all counrtires
const ACTIVITIES_URL = "http://localhost:3000/api/v1/activities"              // RESTful url to GET all activities
const BOOKINGS_URL = "http://localhost:3000/api/v1/bookings"                  // RESTful url to POST a new booking

let allCountries = []         // local variable to hold all counrtires -- set after GET to api
let allActivities = []        // local variable to hold all activities -- set after GET to api
let countryActivities         // local variable to hold activities filtered after a click on a specific country
let foundActivity             // local variable to hold a specific activity after a click on that activity

// listener that only allows all other listeners to work after all content loaded
document.addEventListener("DOMContentLoaded", function(event) {
  const countryCard = document.getElementById("country-container")              // variable to hold div element for country cards
  const activitiesContainer = document.getElementById("activities-container")   // variable to hold div element for activity cards
  const activityShow = document.getElementById("activity-show")                 // variable to hold div element to show individual activity
  const logo = document.getElementById("logo-image")                            // variable to hold div element for for weTravel logo


  getCountries(COUNTRIES_URL)       // fetch to API to GET all countries
  getActivities(ACTIVITIES_URL)     // fetch to API to GET all activities

  // event listener for clicks on country card images
  countryCard.addEventListener("click", e => {
    // if user clicks on a country image, they will be shown all activities for that country
    if(e.target.src) {
      // filter allActivities based on the slected country
      countryActivities = filterActivitiesById(e.target.id)
      // remove the country-contanier div
      countryCard.style.display = "none"
      // add filtered activities to the activities-container
      activitiesContainer.innerHTML = `<h1> Activities in ${e.target.dataset.country}: </h1>`
      activitiesContainer.innerHTML += createActivities(countryActivities, e.target.dataset.country)
      // display activities-contatiner with filtered activities in it
      activitiesContainer.style.display = "block"
    }
  })

  // event listener that listens for clicks on different activity cards
  activitiesContainer.addEventListener("click", e => {
    // narrows listern to only react to clicks on the buttons on cards
    if(e.target.className === "more-info ui inverted button"){
      // find individual activity based on ID
      foundActivity = findActivity(e.target.dataset.id)
      // remove the activities-contanier div
      activitiesContainer.style.display = "none"
      // set activity-show div innnerHTML based on the user's selected activity
      activityShow.innerHTML = createActivity([foundActivity])
      // display activity-show div with selected activity
      activityShow.style.display = "block"
    }
  })

  // listen for any click on the logo
  logo.addEventListener("click", e => {
    // remove any other containers that may be open from display
    activitiesContainer.innerHTML= "none"
    activityShow.style.display = "none"
    // display countries-container with country cards
    countryCard.innerHTML = createCountries(allCountries)
    countryCard.style.display = "block"
  })

  // listen for clicks in activity-show container
  activityShow.addEventListener("click", e => {

    // if there is not already a form in this container - then display form on user click
    if(!activityShow.innerText.includes("Please fill out")) {
      // if user clicks on 'Make a Reservation' button then display form
      if (e.target.id === "purchase-button"){
          // find activity details
          let myActivity = findActivity(e.target.dataset.id)
          // create form in same container with selected activity details
          activityShow.innerHTML += createForm([myActivity])
      }
    }

    // if a user chooses to submit a reservation form
    if (e.target.type === "submit") {
      // prevent auto submition of form
      e.preventDefault()

      // grab these fields and save them as local variables to use during POST
      let name = e.target.parentElement.name.value
      let email = e.target.parentElement.email.value
      let userId = e.target.dataset.userId
      let activityId = e.target.dataset.activityId
      let quant = e.target.parentElement.quantity.value
      let date = e.target.parentElement.date.value
      let price = parseInt(e.target.dataset.price) * parseInt(quant)
      const form = document.getElementById("form")

      // POST new booking to API
      postToApi(BOOKINGS_URL, userId, activityId, price, quant, date)
      // reset form fields after submition
      form.reset()
    }
  })

}) // end DOMContentLoaded

//------------------------------ Fetch -----------------------------------------

// fetch for GET of all countries -- pessimistically render content
function getCountries(url) {
  const countryCard = document.getElementById("country-container")
  fetch(url)
    .then( resp => resp.json())
    .then( countries => {
      allCountries = countries      // set local variable equal to returned country info from API
      countryCard.innerHTML = createCountries(allCountries)
    })
}

// fetch for GET of activities
function getActivities(url) {
  fetch(url)
    .then( resp => resp.json())
    .then( activities => allActivities = activities)    // set local variable equal to returned activity info from API
}

// fetch to POST new booking to API
function postToApi(url, userId, activityId, price, quantity, date) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      activity_id: activityId,
      price: price,
      tickets_reserved: quantity,
      start_date: date
    })
  })
}


//------------------------------ Create HTML -----------------------------------

// create HTML for country cards
function createCountries(countries) {
  return countries.map( country => {
    return `<div class="country-card" data-id="${country.id}">
              <h1> ${country.name} </h1>
              <img id="${country.id}" class="image-card" src="./assets/images/Destinations/country_${country.id}.jpg" data-country="${country.name}" alt="Picture of ${country.name}">
            </div>
            <!--end of country card -->`
  }).join("")
}

// create HTML for activity cards
function createActivities(activities, country_name) {
  return activities.map( activity => {
    return `<div class="activity-card" data-id="${activity.id}">
              <h2>${activity.name}</h2>
              <p>${activity.city}, ${country_name}</p>
              <img src="./assets/images/Activities/activity_${activity.id}.jpg" data-id="${activity.id}">
              <b><p>Price: $${activity.price}</p></b>
              <button class="more-info ui inverted button" data-id="${activity.id}"> See details </button>
            </div>
            <!--end of ${activity.name} activity card -->`
  }).join("")
}

// create HTML for individual activity
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
         <button class="ui inverted button" data-id="${info.id} "id="purchase-button"> Make a Reservation </button>
      </div>
      <!--end of ${info.name} showActivity card -->`
  })
}

// create HTML for form for reservation of given activity
function createForm(activity) {
  return activity.map( info => {
    return `<div id="form-div">
              <form id="form">
                <h2>${info.name}</h2>
                <h3> Please fill out the form below...</h3>
                <h3>Price: $${info.price}</h3>
                <label class="ui black ribbon label">Name:</label><br>
                <input class="ui fluid icon input" type="text" name="name" placeholder="Enter Name"><br>
                <label class="ui black ribbon label">Email:</label><br>
                <input class="ui fluid icon input" type="text" name="email" placeholder="Enter Email"><br>
                <label class="ui black ribbon label">Quantity:</label><br>
                <input class="ui fluid icon input" type="number" name="quantity" placeholder="Enter quantity"><br>
                <label class="ui black ribbon label">Desired Date:</label><br>
                <input class="ui fluid icon input" type="date" name="date"><br><br>
                <input class="ui green button" type="submit" value="RESERVE" data-price="${info.price}" data-user-id="3" data-activity-id="${info.id}">
              </form>
            </div>
            <!--end of form -->`
  })
}

//------------------------------ Helpers ---------------------------------------

// helper to filter an activity by ID 
function filterActivitiesById(id) {
  return allActivities.filter( activity => activity.country_id === parseInt(id))
}

// helper to find an activity by ID
function findActivity(id) {
  return allActivities.find(activity => activity.id === parseInt(id))
}
