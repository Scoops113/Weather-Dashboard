// Function to fetch weather data from OpenWeatherMap API using city name
function fetchWeather(city) {
    const apiKey = '75ed53f609944711e5938fde6e1cb8c7'; // Replace 'YOUR_API_KEY' with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            // Update current weather display
            updateCurrentWeather(data);

            // Fetch 5-day forecast data
            fetchForecast(city);

            // Update search history
            updateSearchHistory(city);
        })
        .catch(error => {
            console.log('Error fetching weather data:', error);
            alert('City not found. Please enter a valid city name.');
        });
}

// Function to retrieve coordinates from city name using OpenWeatherMap API's "Geocoding API"
function getCoordinates(city) {
    const apiKey = '75ed53f609944711e5938fde6e1cb8c7'; // Replace 'YOUR_API_KEY' with your actual API key
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchWeatherByCoordinates(lat, lon);
            } else {
                throw new Error('City not found');
            }
        })
        .catch(error => {
            console.log('Error fetching coordinates:', error);
            alert('City not found. Please enter a valid city name.');
        });
}

// Function to fetch weather data from OpenWeatherMap API using coordinates
function fetchWeatherByCoordinates(latitude, longitude) {
    const apiKey = '75ed53f609944711e5938fde6e1cb8c7'; // Replace 'YOUR_API_KEY' with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            // Update current weather display
            updateCurrentWeather(data);

            // Fetch 5-day forecast data
            fetchForecastByCoordinates(latitude, longitude);

            // Update search history
            updateSearchHistory(data.name); // Use city name instead of coordinates for search history
        })
        .catch(error => {
            console.log('Error fetching weather data:', error);
            alert('City not found. Please enter a valid city name.');
        });
}

// Function to fetch 5-day forecast data from OpenWeatherMap API using coordinates
function fetchForecastByCoordinates(latitude, longitude) {
    const apiKey = '75ed53f609944711e5938fde6e1cb8c7'; // Replace 'YOUR_API_KEY' with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update forecast display
            updateForecast(data);
        })
        .catch(error => {
            console.log('Error fetching forecast data:', error);
        });
}

// Function to update the current weather display
function updateCurrentWeather(data) {
    const currentWeather = document.getElementById('current-weather');
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    currentWeather.innerHTML = `
        <h2 class="text-black">Current Weather</h2>
        <div class="card bg-primary text-white">
            <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <img src="${iconUrl}" alt="Weather Icon">
                <p class="card-text">Temperature: ${data.main.temp} °C</p>
                <p class="card-text">Humidity: ${data.main.humidity}%</p>
                <p class="card-text">Wind Speed: ${data.wind.speed} m/s</p>
            </div>
        </div>
    `;
}


// Function to update the 5-day forecast display
function updateForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = `
        <h2 class="text-black mt-4">5-Day Forecast</h2>
        <div class="row">
            ${data.list.slice(1).filter((item, index) => index % 8 === 0).slice(0, 5).map(item => {
                const date = new Date(item.dt * 1000);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                const iconCode = item.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
                return `
                    <div class="col-md-2">
                        <div class="card bg-primary text-white">
                            <img src="${iconUrl}" class="card-img-top" alt="Weather Icon">
                            <div class="card-body">
                                <h5 class="card-title">${dayOfWeek}</h5>
                                <p class="card-text">Temperature: ${item.main.temp} °C</p>
                                <p class="card-text">Humidity: ${item.main.humidity}%</p>
                                <p class="card-text">Wind Speed: ${item.wind.speed} m/s</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}


// Function to update the search history
function updateSearchHistory(city) {
    let searchHistory = localStorage.getItem('searchHistory');
    if (!searchHistory) {
        searchHistory = [];
    } else {
        searchHistory = JSON.parse(searchHistory);
    }

    // Add the searched city to the search history
    searchHistory.push(city);
    // Limit search history to 5 entries
    if (searchHistory.length > 5) {
        searchHistory.shift();
    }

    // Save the updated search history to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Display the updated search history
    const searchHistoryElement = document.getElementById('search-history');
    searchHistoryElement.innerHTML = `
        <h2 class="black mt-4">Search History</h2>
        <ul class="list-group">
            ${searchHistory.map(city => `<li class="list-group-item">${city}</li>`).join('')}
        </ul>
    `;
}

// Event listener for form submission
$('#search-form').submit(function (event) {
    event.preventDefault();
    const city = $('#city-input').val().trim();
    if (city !== '') {
        getCoordinates(city);
    }
});





  
  