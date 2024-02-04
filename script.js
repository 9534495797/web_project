const apiKey = 'a';
const searchInput = document.getElementById('searchInput');
const weatherContainer = document.getElementById('weatherContainer');

function searchWeather() {
    const cityName = searchInput.value.trim();
    
    if (cityName !== '') {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherContainer.innerHTML = 'Error fetching weather data. Please try again.';
            });
    } else {
        weatherContainer.innerHTML = 'Please enter a city name.';
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const temperature = main.temp;
    const description = weather[0].description;

    const weatherHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Description: ${description}</p>
    `;

    weatherContainer.innerHTML = weatherHTML;
}
