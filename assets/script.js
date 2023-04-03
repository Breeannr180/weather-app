var  API_KEY = '9ded74694686df4fc6c160d32cf07e57'; // personal API Key

// function for form submit event
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

// display weather cards for the next 5 days
for (let i = 0; i < response.list.length && i < 5; i++) {
    const weather = response.list[i];
    const date = moment(weather.dt_txt).format('MMMM Do YYYY');
    const temp = Math.round(weather.main.temp);
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;
    const icon = weather.weather[0].icon;
    const card = `
      <div class="card text-center">
        <div class="card-body">
          <h5 class="card-title">${date}</h5>
          <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
          <p class="card-text">Temperature: ${temp}°F</p>
          <p class="card-text">Humidity: ${humidity}%</p>
          <p class="card-text">Wind Speed: ${windSpeed} MPH</p>
        </div>
      </div>
    `;
    $('#five-day').append(card);
   

        // Get search history from local storage or initialize it as an empty array
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Add current city to search history if it's not already in there
        if (!searchHistory.includes(cityName)) {
        searchHistory.unshift(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      

      // Display up to 5 most recent searches in search history section
        const searchHistoryBtns = searchHistory.slice(0, 5).map(city => `
        <button class="search-history-btn btn btn-secondary">${city}</button>
        `).join('');
       $('#search-history').html(searchHistoryBtns);
      }
      // Function for search history button click event
        $(document).on('click', '.search-history-btn', function() {
        const city = $(this).text();
        $('#city').val(city);
        $('#city-search').submit();
      })
    }
  })
})

