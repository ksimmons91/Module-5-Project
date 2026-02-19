// https://api.weatherstack.com/current?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=

async function getCurrentData(event){
    const newPromise = await fetch(`https://api.weatherstack.com/current?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=${event.target.value}`)
    const allDataObject = await newPromise.json()
    console.log(allDataObject)
    document.addEventListener('DOMContentLoaded', () => {
        const weatherDataEl = document.querySelector('.row')
        weatherDataEl.innerHTML =
        `<div class="weather__card">
            <h3>City: ${allDataObject.location.name}</h3>
            <img src="${allDataObject.current.weather_icons[0]}" alt="">
            <p><b>Current Weather Description:</b> ${allDataObject.current.weather_descriptions}</p>
            <p><b>Current Time:</b> ${allDataObject.location.localtime}</p>
            <p><b>Temperature:</b> ${toString(allDataObject.current.temperature*(9/5)+32)}</p>
            <p><b>Wind Speed and Direction:</b> ${toString(allDataObject.current.wind_speed)} ${allDataObject.current.wind_dir}</p>
            <p><b>Sunrise:</b> ${allDataObject.current.astro.sunrise}</p>
            <p><b>Sunset:</b> ${allDataObject.current.astro.sunset}</p>
        </div>`
    }) 
}

// async function getHistoricalData(event){
//     const newPromise = await fetch(`https://api.weatherstack.com/historical?access_key=f9a4dc3dbcd1673b1844d2e8132bc2f9&query=${event.target.value}`)
//     const allData = await newPromise.json()
// }

// function currentWeather(allDataObject){
//     return `<div class="weather__card">
//                 <h3>City:</h3>
//                 <img src="${allDataObject.current.weather_icons[0]}" alt="">
//                 <p><b>Current Weather Description:</b> ${allDataObject.current.weather_descriptions}</p>
//                 <p><b>Current Time:</b> ${allDataObject.location.localtime}</p>
//                 <p><b>Temperature:</b> ${allDataObject.current.temperature*(9/5)+32}</p>
//                 <p><b>Wind Speed and Direction:</b> ${allDataObject.current.wind_speed} ${allDataObject.current.wind_dir}</p>
//                 <p><b>Sunrise:</b> ${allDataObject.current.astro.sunrise}</p>
//                 <p><b>Sunset:</b> ${allDataObject.current.astro.sunset}</p>
//             </div>`
// }
