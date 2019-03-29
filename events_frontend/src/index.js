const userEndPoint = 'http://localhost:3000/api/v1/users';
const BASEURL = 'https://app.ticketmaster.com/discovery/v2/events?apikey='
const APIKEY = 'tSqmpxsVdaylI75DcdQTKHYNGTGddSG1'
const endPoint = 'http://localhost:3000/api/v1/events';

document.addEventListener('DOMContentLoaded', () => {
  getLoginInfo()
})


function getLoginInfo() {
  let loginButton = document.getElementById('login')
  loginButton.addEventListener('submit', (ev) => {
    ev.preventDefault()
    let username = document.getElementById('username').value
    let email = document.getElementById('email').value

    let data = {
      'username': username,
      'email': email
    }
    postUser(data)
    getUserId(username)
  })
  let homeButton = document.getElementById('eventMatcher')
  homeButton.addEventListener('click', () => {
    console.log('homeButton')
    toggleAllOffExceptSearch()
  })
}

function getUserId(username) {
  fetch(userEndPoint)
  .then(res => res.json())
  .then(json => {
    json.forEach((person => {
      if (person.username == username){
        localStorage.setItem('userId', person.id)
      }
    }))
  })
}

function postUser(data) {
    fetch(userEndPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    })
    toggleVisibility('search')
    toggleVisibility('login')
    getUserInput()
    let loginDiv = document.getElementById('login')
    let form = document.getElementById('loginForm')
    form.style.display = "none"
  }

function getUserInput() {
  let form = document.getElementById('searchForm')
  form.addEventListener('submit', (ev) => {
    ev.preventDefault()
    let keyword = document.getElementById('keyword').value
    let city = document.getElementById('city').value
    let state = document.getElementById('state').value

    getSearchData(keyword, city, state)
  })
  let viewFavoritesButton = document.getElementById('favoritesButton')
  viewFavoritesButton.addEventListener('click', () => {
    console.log('in favorite')
    getFavorites()
    // showFavorites()
  })
}

function getSearchData(keyword, city, state) {
  // need to update keyword for mulitple words
  let keywordSearch = `&keyword=${keyword}`
  let citySearch = `&city=${city}`
  let stateSearch =`&stateCode=${state}`
  console.log(BASEURL + APIKEY + citySearch + keywordSearch + stateSearch)
  fetch(BASEURL + APIKEY + keywordSearch + citySearch + stateSearch)
  .then(response => response.json())
  .then(json => {
    clearData('ul')
    clearData('showFavoritesUl')
    clearData('showMoreFromFavoritesUl')
    json._embedded.events.forEach((event => {
      createEventCard(event)
    }))
  })
  .catch(function(error) {
    alert("There were no results for your search query. Please try again.")
  })
}

function clearData(id) {
  let ul = document.getElementById(id)
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.firstChild)
  }
}

function createEventCard(event) {
    let div = document.getElementById('searchResults')
    div.style.display = 'block'
    let ul = document.getElementById('ul')
    let li = document.createElement('li')
    li.className = 'eventCard'
    let h2 = document.createElement('h2')
    h2.textContent = event.name
    let moreInfo = document.createElement('button')
    moreInfo.textContent = "Click Here for More Info"
    moreInfo.addEventListener('click', () => {
      showMore(event)
      toggleVisibility("searchResults")
      // clearData('eventCard')
    })
    let likeButton = document.createElement('button')
    likeButton.textContent = 'Add to Favorites ❤️'
    likeButton.addEventListener('click', () => {
      alert("Successfully Added to Favorites")
      saveNewFavorite(event)
    })
    let cityState = document.createElement('p')
    let date = document.createElement('p')
    let venue = document.createElement('p')
    cityState.textContent = `Location: ${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode}`
    venue.textContent = `Venue: ${event._embedded.venues[0].name}`
    date.textContent = `Event Date: ${event.dates.start.localDate}`
    let img = document.createElement('img')
    img.className = 'cardImage'
    img.src = event.images[0].url
    img.style.width = '200px'
    img.style.height = '125px'
    li.appendChild(h2)
    li.appendChild(img)
    li.appendChild(cityState)
    li.appendChild(venue)
    li.appendChild(date)
    li.appendChild(moreInfo)
    li.appendChild(likeButton)
    ul.appendChild(li)
    div.appendChild(ul)
}

function showMore(event) {

  toggleVisibility('search')

  let div = document.getElementById('showResults')
  let ul = document.getElementById('showUl')
  let h2 = document.createElement('h2')
  let li = document.createElement('li')
  // ul.className = 'showMoreCard'
  h2.textContent = event.name
  let cityState = document.createElement('p')
  let date = document.createElement('p')
  let venue = document.createElement('p')
  let url = document.createElement('a')
  // let url = document.getElementById('url')
  let start_date = document.createElement('p')
  let start_time = document.createElement('p')
  let segment = document.createElement('p')
  let genre = document.createElement('p')
  url.setAttribute('target', '_blank')
  url.href = event.url
  url.textContent = `Click Here to Buy Tickets`

  var time = event.dates.start.localTime; // your input

time = time.split(':'); // convert to array

// fetch
var hours = Number(time[0]);
var minutes = Number(time[1]);
var seconds = Number(time[2]);

// calculate
var timeValue;

if (hours > 0 && hours <= 12) {
  timeValue= "" + hours;
} else if (hours > 12) {
  timeValue= "" + (hours - 12);
} else if (hours == 0) {
  timeValue= "12";
}

timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes

timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

  start_date.textContent = `Date of Event: ${event.dates.start.localDate}`
  start_time.textContent = `Time of Event: ${timeValue}`
  segment.textContent = `Type of Event: ${event.classifications[0].segment.name}`
  genre.textContent = `Genre: ${event.classifications[0].genre.name}`,
  cityState.textContent = `Location: ${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode}`
  venue.textContent = `Venue: ${event._embedded.venues[0].name}`
  date.textContent = event.dates.start.localDate
  let img = document.createElement('img')
  img.src = event.images[0].url
  img.style.width = '200px'
  img.style.height = '125px'
  let backButton = document.createElement('button')
  backButton.textContent = "Go Back"
  backButton.addEventListener('click', () => {
    toggleVisibility('search')
    toggleVisibility('searchResults')
    while (ul.hasChildNodes()) {
      ul.removeChild(ul.firstChild)
    }
  })
  let likeButton = document.createElement('button')
  likeButton.textContent = 'Add to Favorites ❤️'
  likeButton.addEventListener('click', () => {
    saveNewFavorite(event)
    alert("Successfully Added to Favorites")
  })
  li.appendChild(h2)
  li.appendChild(url)
  li.appendChild(cityState)
  li.appendChild(venue)
  // li.appendChild(date)
  li.appendChild(img)
  li.appendChild(start_date)
  li.appendChild(start_time)
  li.appendChild(segment)
  li.appendChild(genre)
  li.appendChild(likeButton)
  li.appendChild(backButton)
  ul.appendChild(li)
  div.appendChild(ul)

}

function getFavorites() {
  console.log('in get favorites')
  fetch(endPoint)
  .then(res => res.json())
  .then(json => {
    clearData('showFavoritesUl')
    json.forEach((event => {
      clearData('ul')
      if (localStorage.userId == event.user_id) {
        showFavorites(event)
      }
    }))
  })
}

function showFavorites(event) {
  console.log('in show favorites')

  clearData('showMoreFromFavoritesUl')

  let div = document.getElementById('showFavorites')
  let showFavoritesUl = document.getElementById('showFavoritesUl')
  div.style.display = 'block'
  let li = document.createElement('li')
  li.className = 'favoritesCard'
  let h2 = document.createElement('h2')
  h2.textContent = event.name
  h2.addEventListener('click', () => {
    showMoreFromFavorites(event)
    // toggleVisibility("showFavorites") //is this right?
  })
  let moreInfo = document.createElement('button')
  moreInfo.textContent = "Click Here for More Info"
  moreInfo.addEventListener('click', () => {
    showMoreFromFavorites(event)
    // toggleVisibility("showFavorites") //is this right?
  })

  let removeButton = document.createElement('button')
  removeButton.textContent = 'Remove Event' //remove from favorites
  removeButton.addEventListener('click', () => {
    removeFavorite(event)
    alert("Removed from Favorites")
  })

  let cityState = document.createElement('p')
  let date = document.createElement('p')
  let venue = document.createElement('p')
  cityState.textContent = `Location: ${event.city}, ${event.state}`
  venue.textContent = `Venue: ${event.venue}`
  date.textContent = `Event Date: ${event.start_date}`
  let img = document.createElement('img')
  img.src = event.image1
  img.className = 'cardImage'
  img.style.width = '200px'
  img.style.height = '125px'
  li.appendChild(h2)
  li.appendChild(img)
  li.appendChild(cityState)
  li.appendChild(venue)
  li.appendChild(date)
  li.appendChild(removeButton)
  li.appendChild(moreInfo)
  showFavoritesUl.appendChild(li)
  div.appendChild(showFavoritesUl)
}

function showMoreFromFavorites(event) {
  console.log('in show more from favorites')

  toggleVisibility("showFavorites")

  let div = document.getElementById('showMoreFromFavoritesResults')
  let ul = document.getElementById('showMoreFromFavoritesUl')
  // ul.className = "showMoreCard"
  let h2 = document.createElement('h2')
  let li = document.createElement('li')
  h2.textContent = event.name
  let cityState = document.createElement('p')
  let date = document.createElement('p')
  let venue = document.createElement('p')
  let url = document.createElement('a')
  // let url = document.getElementById('url')
  let start_date = document.createElement('p')
  let start_time = document.createElement('p')
  let segment = document.createElement('p')
  let genre = document.createElement('p')
  url.setAttribute('target', '_blank')
  url.href = event.url
  url.textContent = `Click Here to Buy Tickets`

  var time = event.start_time; // your input

time = time.split(':'); // convert to array

// fetch
var hours = Number(time[0]);
var minutes = Number(time[1]);
var seconds = Number(time[2]);

// calculate
var timeValue;

if (hours > 0 && hours <= 12) {
  timeValue= "" + hours;
} else if (hours > 12) {
  timeValue= "" + (hours - 12);
} else if (hours == 0) {
  timeValue= "12";
}

timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes

timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

  start_date.textContent = `Date of Event: ${event.start_date}`
  start_time.textContent = `Time of Event: ${timeValue}`
  segment.textContent = `Type of Event: ${event.segment}`
  genre.textContent = `Genre: ${event.genre}`,
  cityState.textContent = `Location: ${event.city}, ${event.state}`
  venue.textContent = `Venue: ${event.venue}`
  date.textContent = event.start_date
  let img = document.createElement('img')
  img.src = event.image1
  // img.className = 'cardImage'
  img.style.width = '200px'
  img.style.height = '125px'
  let backButton = document.createElement('button')
  backButton.textContent = "Go Back"
  backButton.addEventListener('click', () => {
    // toggleVisibility('search')
    toggleVisibility('showFavorites')
    while (ul.hasChildNodes()) {
      ul.removeChild(ul.firstChild)
    }
  })



  let removeButton = document.createElement('button')
  removeButton.textContent = 'Remove Event' //remove from favorites
  removeButton.addEventListener('click', () => {
    removeFavorite(event)
    alert("Removed from Favorites")
  })
  li.appendChild(h2)
  li.appendChild(url)
  li.appendChild(cityState)
  li.appendChild(venue)
  // li.appendChild(date)
  li.appendChild(img)
  li.appendChild(start_date)
  li.appendChild(start_time)
  li.appendChild(segment)
  li.appendChild(genre)
  li.appendChild(removeButton)
  li.appendChild(backButton)
  ul.appendChild(li)
  div.appendChild(ul)

}

function saveNewFavorite(event) {
  let data = {
    'user_id': localStorage.getItem('userId'),
    'name': event.name,
    'url': event.url,
    'image1': event.images[0].url,
    'image2': event.images[1].url,
    'start_date': event.dates.start.localDate,
    'start_time': event.dates.start.localTime,
    'segment': event.classifications[0].segment.name,
    'genre': event.classifications[0].genre.name,
    'venue': event._embedded.venues[0].name,
    'city': event._embedded.venues[0].city.name,
    'state': event._embedded.venues[0].state.stateCode
  }

  fetch(endPoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify(data)
  })
}

function removeFavorite(event) {
  // console.log('in removeFavorite')
  let data = {
    'user_id': localStorage.getItem('userId'),
    'name': event.name,
    'url': event.url,
    'image1': event.image1,
    'image2': event.image2,
    'start_date': event.start_date,
    'start_time': event.start_time,
    'segment': event.segment,
    'genre': event.genre,
    'venue': event.venue,
    'city': event.city,
    'state': event.state
  }

  fetch(endPoint + `/${event.id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify(data)
  })
}

function toggleVisibility(id) {
  let e = document.getElementById(id)
  if (e.style.display == 'block') {
    e.style.display = 'none'
  } else {
    e.style.display = "block"
  }
}

function toggleAllOffExceptSearch() {
  let div1 = document.getElementById('searchResults')
  let div2 = document.getElementById('showResults')
  let div3 = document.getElementById('showFavorites')
  let div4 = document.getElementById('showMoreFromFavorites')

  if (div1.style.display == 'block') {
    toggleVisibility('searchResults')
  } else if (div2.style.display == 'block') {
    toggleVisibility('showResults')
  } else if (div3.style.display == 'block') {
    toggleVisibility('showFavorites')
  } else if (div4.style.display == 'block') {
    toggleVisibility('showMoreFromFavorites')
  }
}
