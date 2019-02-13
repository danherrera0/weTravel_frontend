const COUNTRIES_URL = "http://localhost:3000/api/v1/countries"
const ACTIVITIES_URL = "http://localhost:3000/api/v1/activities"
const BOOKINGS_URL = "http://localhost:3000/api/v1/bookings"
const countryCard = document.getElementById("country-container")
const activitiesContainer = document.getElementById("activities-container")


let allCountries = []
let allActivities = []
let countryActivities
let foundActivity
let form

document.addEventListener("DOMContentLoaded", function(event) {
  const countryCard = document.getElementById("country-container")
  const activitiesContainer = document.getElementById("activities-container")
  const activityShow = document.getElementById("activity-show")
  const logo = document.getElementById("logo-image")


  getCountries(COUNTRIES_URL)
  getActivities(ACTIVITIES_URL)

  countryCard.addEventListener("click", e => {
    if(e.target.src) {
      countryActivities = filterActivitiesById(e.target.id)
      countryCard.style.display = "none"
      activitiesContainer.innerHTML = `<h1> Activities in ${e.target.dataset.country}: </h1>`
      activitiesContainer.innerHTML += createActivities(countryActivities, e.target.dataset.country)
      activitiesContainer.style.display = "block"
    }
  })

  activitiesContainer.addEventListener("click", e => {
    if(e.target.className === "more-info ui inverted button"){
      foundActivity = findActivity(e.target.dataset.id)
      activitiesContainer.style.display = "none"
      activityShow.innerHTML = createActivity([foundActivity])
      activityShow.style.display = "block"
    }
  })

  logo.addEventListener("click", e => {
    activitiesContainer.innerHTML= "none"
    activityShow.style.display = "none"
    countryCard.innerHTML = createCountries(allCountries)
    countryCard.style.display = "block"
  })

  activityShow.addEventListener("click", e => {

    if(!activityShow.innerText.includes("Please fill out")) {
      if (e.target.id === "purchase-button"){
          let myActivity = findActivity(e.target.dataset.id)
          let travelShow = document.querySelector(".travel-show")
          activityShow.innerHTML += createForm([myActivity])
          form = document.getElementById("form-div")
      }
    }

    if (e.target.type === "submit") {
      e.preventDefault()

      let name = e.target.parentElement.name.value
      let email = e.target.parentElement.email.value
      let userId = e.target.dataset.userId
      let activityId = e.target.dataset.activityId
      let quant = e.target.parentElement.quantity.value
      let date = e.target.parentElement.date.value
      let price = parseInt(e.target.dataset.price) * parseInt(quant)

      postToApi(BOOKINGS_URL, userId, activityId, price, quant, date)
    }
  })

  // // if (form !== "undefined") {
  //   form.addEventListener("submit", e => {
  //     e.preventDefault()
  //     console.log('submitting');
  //   })


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
              <button class="more-info ui inverted button" data-id="${activity.id}"> See details </button>
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
         <button class="ui inverted button" data-id="${info.id} "id="purchase-button"> Purchase </button>
      </div>
      <!--end of ${info.name} showActivity card -->`
  })
}

function createForm(activity) {
  return activity.map( info => {
    return `<div id="form-div">
              <form id="reservation" >
                <h2>Purchase Form</h2>
                <h3>Chosen Activity: ${info.name}</h3>
                <h4>Price: $${info.price}</h4>
                <label class="ui black ribbon label">Name:</label><br>
                <input class="ui fluid icon input" type="text" name="name" placeholder="Enter Name"><br>
                <label class="ui black ribbon label">Email:</label><br>
                <input class="ui fluid icon input" type="text" name="email" placeholder="Enter Email"><br>
                <label class="ui black ribbon label">Quantity:</label><br>
                <input class="ui fluid icon input" type="number" name="quantity" placeholder="Enter quantity"><br>
                <label class="ui black ribbon label">Desired Date:</label><br>
                <input class="ui fluid icon input" type="date" name="date"><br><br>
                <input class="ui green button" type="submit" value="Submit" data-price="${info.price}" data-user-id="3" data-activity-id="${info.id}">
              </form>
            </div>
            <!--end of form -->`
  })
}

//------------------------------ Helpers ---------------------------------------

function filterActivitiesById(id) {
  return allActivities.filter( activity => activity.country_id === parseInt(id))
}

function findActivity(id) {
  return allActivities.find(activity => activity.id === parseInt(id))
}
