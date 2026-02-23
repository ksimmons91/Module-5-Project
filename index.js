// https://api.weatherstack.com/current?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=

async function getCurrentData(){
    let city = document.querySelector('.city__current').value
    const currentWeatherEl = document.querySelector('.weather__current')
    const newPromise = await fetch(`https://api.weatherstack.com/current?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=${city}`)
    const currentDataObject = await newPromise.json()
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
}



async function getHistoricalData(){
    let city = document.querySelector('.city__past').value
    let pastDate = document.querySelector('.date__past').value
    const newPromise = await fetch(`https://api.weatherstack.com/historical?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=${city}&historical_date=${pastDate}`)
    const pastDataObject = await newPromise.json()
    const pastWeatherEl = document.querySelector('.weather__past')
    pastWeatherEl.innerHTML = `
    <div class="weather__card past__card">
    <h3>Location: ${pastDataObject.location.name}, ${pastDataObject.location.country}</h3>
    <p><b>Date:</b> ${pastDate}<p>
    <p><b>Low temperature:</b> ${(pastDataObject.historical[pastDate].mintemp*(9/5)+32).toFixed(1)}°F, ${(pastDataObject.historical[pastDate].mintemp).toFixed(1)}°C<p>
    <p><b>High temperature:</b> ${(pastDataObject.historical[pastDate].maxtemp*(9/5)+32).toFixed(1)}°F, ${(pastDataObject.historical[pastDate].maxtemp).toFixed(1)}°C<p>
    <p><b>Average Temperature:</b> ${(pastDataObject.historical[pastDate].avgtemp*(9/5)+32).toFixed(1)}°F, ${(pastDataObject.historical[pastDate].avgtemp).toFixed(1)}°C<p>
    <p><b>Sunrise:</b> ${pastDataObject.historical[pastDate].astro.sunrise}</p>
    <p><b>Sunset:</b> ${pastDataObject.historical[pastDate].astro.sunset}</p>
    <p><b>Hours of Sunlight:</b> ${pastDataObject.historical[pastDate].astro.sunhour}</p>
    </div>
    <h3>Search again for historical data on a different date and/or location:</h3>
    <input class="weather__input city__past" type="text" placeholder="Enter city of interest...">
    <input class="weather__input date__past" type="text" placeholder="Enter a date after 2008-07-01 in YYYY-MM-DD format.." onchange="getHistoricalData(event)">
    <button class="weather__button" onsubmit="getHistoricalData()">Search</button>
    
    `
}

async function getHistoricalRangeData(filter){
    let city = document.querySelector('.city__range').value
    let startDate = document.querySelector('.range__start').value
    let endDate = document.querySelector('.range__end').value
    const newPromise = await fetch(`https://api.weatherstack.com/historical?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=${city}&historical_date_start=${startDate}&historical_date_end=${endDate}`)
    const rangeDataObject = await newPromise.json()
    const rangeWeatherEl = document.querySelector('.weather__range')
    const rangeDataArray = Object.values(rangeDataObject)
    console.log(rangeDataArray[3][startDate].sunhour)

    rangeWeatherEl.innerHTML =``

    for (var value in rangeDataObject.historical){
    rangeWeatherEl.innerHTML += `
    <div class="weather__card past__card">
        <h3>Location: ${rangeDataObject.location.name}, ${rangeDataObject.location.country}</h3>
        <p><b>Date:</b> ${rangeDataObject.historical[value].date}<p>
        <p><b>Low temperature:</b> ${(rangeDataObject.historical[value].mintemp*(9/5)+32).toFixed(1)}°F, ${(rangeDataObject.historical[value].mintemp).toFixed(1)}°C<p>
        <p><b>High temperature:</b> ${(rangeDataObject.historical[value].maxtemp*(9/5)+32).toFixed(1)}°F, ${(rangeDataObject.historical[value].maxtemp).toFixed(1)}°C<p>
        <p><b>Average Temperature:</b> ${(rangeDataObject.historical[value].avgtemp*(9/5)+32).toFixed(1)}°F, ${(rangeDataObject.historical[value].avgtemp).toFixed(1)}°C<p>
        <p><b>Sunrise:</b> ${rangeDataObject.historical[value].astro.sunrise}</p>
        <p><b>Sunset:</b> ${rangeDataObject.historical[value].astro.sunset}</p>
        <p><b>Hours of Sunlight:</b> ${rangeDataObject.historical[value].sunhour}</p>
    </div>
    `
    }

    rangeWeatherEl.innerHTML += `
    <div>
        <select id="filter" onchange="filterWeatherCards(event)">
            <option value="" disabled selected>Sort by category:</option>
            <option value="LOW_TEMPERATURE">Low temperature</option>
            <option value="HIGH_TEMPERATURE">High temperature</option>
            <option value="AVERAGE_TEMPERATURE">Average temperature</option>
        </select>
    </div>
    <div>
        <h3>Search again for historical data in a different date range and/or location:</h3>
        <input class="weather__input city__range" type="text" placeholder="Enter city of interest...">
        <input class="weather__input range__start" type="text" placeholder="Enter start date after 2008-07-01 in YYYY-MM-DD format..." onchange="">
        <input class="weather__input range__end" type="text" placeholder="Enter end date after 2008-07-01 in YYYY-MM-DD format..." onchange="getHistoricalRangeData()">
        <button class="weather__button" onsubmit="getHistoricalRangeData()">Search</button>
    </div>
    `

    if (filter === "LOW_TEMPERATURE"){
        rangeDataObject = Object.entries(rangeDataObject)
        console.log(rangeDataObject)
    }
    else if (filter === "HIGH_TEMPERATURE"){
        getHistoricalRangeData(Object.values(rangeDataObject.historical[value]).sort((a,b) => b[4] - a[4]))
    }
    else if (filter === "AVERAGE_TEMPERATURE"){
    }
}

async function filterWeatherCards(event){
    getHistoricalRangeData(event.target.value)
}


