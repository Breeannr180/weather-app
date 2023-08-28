var API_KEY = '9ded74694686df4fc6c160d32cf07e57'; // personal API Key

$(document).ready(function() {
  // Display search history on page load
  displaySearchHistory();

  $('#city-search').submit(function(event) {
    event.preventDefault();
    const city = $('#city').val().trim();

    // Make API call to OpenWeatherMap
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`,
      method: 'GET'
    }).then(function(response) {
      // Clear previous search results
      $('#five-day').empty();

      // Display current weather
      const currentWeather = response.list[0];
      const cityName = response.city.name;
      const temp = Math.round(currentWeather.main.temp);
      const humidity = currentWeather.main.humidity;
      const windSpeed = currentWeather.wind.speed;
      const icon = currentWeather.weather[0].icon;
      const currentCard = `
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Current Weather</h5>
            <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
            <p class="card-text">Temperature: ${temp}°F</p>
            <p class="card-text">Humidity: ${humidity}%</p>
            <p class="card-text">Wind Speed: ${windSpeed} MPH</p>
          </div>
        </div>
      `;
      $('#five-day').append(currentCard);

      // Display weather cards for the next 5 days
      for (let i = 0; i < Math.min(response.list.length, 5); i++) {
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
      }

      // Update search history and display it
      updateSearchHistory(cityName);
      displaySearchHistory();
    }).fail(function() {
      // Handle error here if needed
    });
  });

  // Function for search history button click event
  $(document).on('click', '.search-history-btn', function() {
    const city = $(this).text();
    $('#city').val(city);
    $('#city-search').submit();
  });

  function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryBtns = searchHistory.map(city => `
      <button class="search-history-btn btn btn-secondary">${city}</button>
    `).join('');
    $('#past-search-buttons').html(searchHistoryBtns);
  }

  function updateSearchHistory(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(cityName)) {
      searchHistory.unshift(cityName);
      if (searchHistory.length > 5) {
        searchHistory.pop();
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }
});
