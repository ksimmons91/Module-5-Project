// https://api.weatherstack.com/current?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=

let storedRangedData;
let storedRangedLocation;

function openMenu() {
    document.body.classList += " menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}

async function getCurrentData(){
    const city = document.querySelector('.city__current').value
    const currentWeatherEl = document.querySelector('.weather__current')
    const newPromise = await fetch(`https://api.weatherstack.com/current?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=${city}`)
    const currentDataObject = await newPromise.json()
    currentWeatherEl.classList += " weather__loading"
        currentWeatherEl.innerHTML = `
            <div class="weather__card current__card">
                <h3>Location: ${currentDataObject.location.name}, ${currentDataObject.location.country}</h3>
                <img src="${currentDataObject.current.weather_icons[0]}" alt="">
                <p><b>Current Weather Description:</b> ${currentDataObject.current.weather_descriptions}</p>
                <p><b>Current Time:</b> ${currentDataObject.location.localtime}</p>
                <p><b>Temperature:</b> ${(currentDataObject.current.temperature*(9/5)+32).toFixed(1)}°F, ${(currentDataObject.current.temperature)}°C</p>
                <p><b>Feels like:</b> ${(currentDataObject.current.feelslike*(9/5)+32).toFixed(1)}°F, ${(currentDataObject.current.feelslike)}°C</p>
                <p><b>Wind Speed and Direction:</b> ${(currentDataObject.current.wind_speed).toFixed(1)} mph ${currentDataObject.current.wind_dir}</p>
                <p><b>Sunrise:</b> ${currentDataObject.current.astro.sunrise}</p>
                <p><b>Sunset:</b> ${currentDataObject.current.astro.sunset}</p>
            </div>
        <h3>Search again for current data in another location:</h3>
        <input class="weather__input city__current" type="text" placeholder="Enter city of interest..." onchange="getCurrentData()">
        <button class="weather__button" onsubmit="getCurrentData()">Search</a></button>    
        `
    currentWeatherEl.classList.remove('weather__loading')
}

async function getHistoricalData(){
    const city = document.querySelector('.city__past').value
    const pastDate = document.querySelector('.date__past').value
    const newPromise = await fetch(`https://api.weatherstack.com/historical?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=${city}&historical_date=${pastDate}`)
    const pastDataObject = await newPromise.json()
    const pastWeatherEl = document.querySelector('.weather__past')
    pastWeatherEl.classList += " weather__loading"
    pastWeatherEl.innerHTML = `
    <div class="weather__card past__card">
    <h3>Location: ${pastDataObject.location.name}, ${pastDataObject.location.country}</h3>
    <p><b>Date:</b> ${pastDate}<p>
    <p><b>Low temperature:</b> ${(pastDataObject.historical[pastDate].mintemp*(9/5)+32).toFixed(1)}°F, ${(pastDataObject.historical[pastDate].mintemp).toFixed(1)}°C<p>
    <p><b>High temperature:</b> ${(pastDataObject.historical[pastDate].maxtemp*(9/5)+32).toFixed(1)}°F, ${(pastDataObject.historical[pastDate].maxtemp).toFixed(1)}°C<p>
    <p><b>Average Temperature:</b> ${(pastDataObject.historical[pastDate].avgtemp*(9/5)+32).toFixed(1)}°F, ${(pastDataObject.historical[pastDate].avgtemp).toFixed(1)}°C<p>
    <p><b>Sunrise:</b> ${pastDataObject.historical[pastDate].astro.sunrise}</p>
    <p><b>Sunset:</b> ${pastDataObject.historical[pastDate].astro.sunset}</p>
    <p><b>Hours of Sunlight:</b> ${pastDataObject.historical[pastDate].sunhour}</p>
    </div>
    <h3>Search again for historical data on a different date and/or location:</h3>
    <input class="weather__input city__past" type="text" placeholder="Enter city of interest...">
    <input class="weather__input date__past" type="text" placeholder="Enter a date after 2008-07-01 in YYYY-MM-DD format.." onchange="getHistoricalData(event)">
    <button class="weather__button" onsubmit="getHistoricalData()">Search</button>
    
    `
    pastWeatherEl.classList.remove('weather__loading')
}

async function getHistoricalRangeData(){
    const city = document.querySelector('.city__range').value
    const startDate = document.querySelector('.range__start').value
    const endDate = document.querySelector('.range__end').value
    const newPromise = await fetch(`https://api.weatherstack.com/historical?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=${city}&historical_date_start=${startDate}&historical_date_end=${endDate}`)
    const rangeDataObject = await newPromise.json()

    storedRangedData = rangeDataObject.historical
    storedRangedLocation = rangeDataObject.location
    renderRangeCards(Object.values(storedRangedData))
}

function renderRangeCards(dataArray) {
    const rangeWeatherEl = document.querySelector('.weather__range')
    rangeWeatherEl.classList += " weather__loading"
    let cardsHTML = ''
    dataArray.forEach(function(item){
        cardsHTML +=   ` 
    <div class="weather__card past__card">
        <h3>Location: ${storedRangedLocation.name}, ${storedRangedLocation.country}</h3>
        <p><b>Date:</b> ${item.date}<p>
        <p><b>Low temperature:</b> ${(item.mintemp*(9/5)+32).toFixed(1)}°F, ${(item.mintemp).toFixed(1)}°C<p>
        <p><b>High temperature:</b> ${(item.maxtemp*(9/5)+32).toFixed(1)}°F, ${(item.maxtemp).toFixed(1)}°C<p>
        <p><b>Average Temperature:</b> ${(item.avgtemp*(9/5)+32).toFixed(1)}°F, ${(item.avgtemp).toFixed(1)}°C<p>
        <p><b>Sunrise:</b> ${item.astro.sunrise}</p>
        <p><b>Sunset:</b> ${item.astro.sunset}</p>
        <p><b>Hours of Sunlight:</b> ${item.sunhour}</p>
    </div>
    `
    })

    rangeWeatherEl.innerHTML = cardsHTML + `
    <div>
        <select id="filter" onchange="filterWeatherCards(event)">
            <option value="" disabled selected>Sort by category:</option>
            <option value="LOW_TEMPERATURE">Low temperature</option>
            <option value="HIGH_TEMPERATURE">High temperature</option>
            <option value="AVERAGE_TEMPERATURE">Average temperature</option>
            <option value="SUNLIGHT">Hours of Sunlight</option>
        </select>
    </div>
    <div class="weather__query range__query">
        <h3>Search again for historical data in a different date range and/or location:</h3>
        <input class="weather__input city__range" type="text" placeholder="Enter city of interest...">
        <input class="weather__input range__start" type="text" placeholder="Enter start date after 2008-07-01 in YYYY-MM-DD format..." onchange="">
        <input class="weather__input range__end" type="text" placeholder="Enter end date after 2008-07-01 in YYYY-MM-DD format..." onchange="getHistoricalRangeData()">
        <button class="weather__button" onsubmit="getHistoricalRangeData()">Search</button>
    </div>
    `
    rangeWeatherEl.classList.remove('weather__loading')

}

async function filterWeatherCards(event){
    if(!storedRangedData) return;

    const dataArray = Object.values(storedRangedData)

    if(event.target.value === "LOW_TEMPERATURE") {
        dataArray.sort((a, b) => a.mintemp - b.mintemp)
    }

    else if (event.target.value === "HIGH_TEMPERATURE") {
        dataArray.sort((a, b) => b.maxtemp - a.maxtemp)
    }

    else if(event.target.value === "AVERAGE_TEMPERATURE") {
        dataArray.sort((a,b) => a.avgtemp - b.avgtemp)
    }

    else if (event.target.value === "SUNLIGHT"){
        dataArray.sort((a,b) => a.sunhour - b.sunhour)
    }
    renderRangeCards(dataArray);
    document.getElementById('filter').value = event.target.value
}


