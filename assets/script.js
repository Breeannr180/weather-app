var  API_KEY = '9ded74694686df4fc6c160d32cf07e57'; // personal API Key

// function to handle form submit event
$('#city-search').submit(function(event) {
  event.preventDefault();
  const city = $('#city').val().trim();

  // make API call to OpenWeatherMap
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`,
    method: 'GET'
  }).then(function(response) {
    // clear previous search results
    $('#five-day').empty();
    $('#search-history').empty();

    // display current weather
    const currentWeather = response.list[0];
    const cityName = response.city.name;
    const temp = Math.round(currentWeather.main.temp);
    const humidity = currentWeather.main.humidity;
    const windSpeed = currentWeather.wind.speed;
    const icon = currentWeather.weather[0].icon;
    $('#five-day').append(`
      <div class="current-weather">
        <h2>${cityName}</h2>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="current weather icon" />
        <p>Temperature: ${temp}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      </div>
    `);

    // display five-day forecast
    for (let i = 1; i < response.list.length; i += 8) {
      const forecast = response.list[i];
      const forecastDate = moment(forecast.dt_txt).format('MMM D');
      const forecastTemp = Math.round(forecast.main.temp);
      const forecastHumidity = forecast.main.humidity;
      const forecastIcon = forecast.weather[0].icon;
      $('#five-day').append(`
        <div class="five-day-forecast">
          <h3>${forecastDate}</h3>
          <img src="http://openweathermap.org/img/w/${forecastIcon}.png" alt="forecast weather icon" />
          <p>Temperature: ${forecastTemp}°F</p>
          <p>Humidity: ${forecastHumidity}%</p>
        </div>
      `);
    }

    // save search history to local storage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(cityName)) {
      searchHistory.unshift(cityName);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    // display search history
    for (let i = 0; i < searchHistory.length && i < 5; i++) {
      const city = searchHistory[i];
      $('#search-history').append(`
        <button class="search-history-btn btn btn-secondary">${city}</button>
      `);
    }
  }).catch(function(error) {
    console.log(error);
    alert('Failed to fetch weather data. Please try again later.');
  });
});

// function to handle search history button click event
$(document).on('click', '.search-history-btn', function() {
  const city = $(this).text();
  $('#city').val(city);
  $('#city-search').submit();
});