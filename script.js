const APIkey = "ec4309bb6b4d4c40b85172526233009";
let days = "3";
let city = "Larisa";
let url;

async function getWeather(city) {
  try {
    console.time("API call");
    url = `https://api.weatherapi.com/v1/forecast.json?key=${APIkey}&q=${city}&days=${days}`;
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) {
      const weatherData = await response.json();
      console.timeEnd("API call");

      return weatherData;
    } else {
      return false;
    }
  } catch (error) {
    console.log("There was an error", error);
  }
}

const form = document.getElementById("cityForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  city = Object.fromEntries(new FormData(e.target).entries());
  render(city.cityName, "metrics");
  form.reset();
});

async function mainInfo(weatherData, measurementSystem) {
  if (weatherData != false) {
    const right_content = document.querySelector(".right-content");
    right_content.querySelectorAll("*").forEach((n) => n.remove());
    const description = document.createElement("div");
    description.textContent = weatherData.current.condition.text;
    description.classList.add("description");

    const name = document.createElement("div");
    name.textContent = weatherData.location.name;
    name.classList.add("name");
    const localTime = document.createElement("div");
    const localDate = new Date(weatherData.location.localtime);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    localTime.textContent =
      localDate.toLocaleDateString(undefined, options) +
      "\n" +
      localDate.toLocaleTimeString("en-US");
    localTime.classList.add("localTime");
    const temperature = document.createElement("div");
    const metrics = document.createElement("div");
    if (measurementSystem == "metrics") {
      temperature.textContent = weatherData.current.temp_c + "°C";
      metrics.textContent = "Display °F";
    } else {
      temperature.textContent = weatherData.current.temp_f + "°F";
      metrics.textContent = "Display °C";
    }
    metrics.addEventListener("click", () => {
      if (measurementSystem == "metrics") {
        render(weatherData.location.name, "ImperialSystem");
      } else {
        render(weatherData.location.name, "metrics");
      }
    });
    temperature.classList.add("temperature");

    metrics.classList.add("metrics");
    const img = document.createElement("img");
    img.classList.add("square");

    img.src = "https:" + weatherData.current.condition.icon;
    right_content.appendChild(description);
    right_content.appendChild(name);
    right_content.appendChild(localTime);
    right_content.appendChild(temperature);
    right_content.appendChild(metrics);
    right_content.appendChild(img);
  }
}

async function leftInfo(weatherData, measurementSystem) {
  if (weatherData != false) {
    const left = document.querySelector(".left");
    //left.querySelectorAll("*").forEach((n) => n.remove());

    const feel = document.querySelector(".feel");
    const windSpeed = document.querySelector(".windSpeed");
    if (measurementSystem == "metrics") {
      feel.textContent = weatherData.current.feelslike_c + " °C";
      windSpeed.textContent = weatherData.current.wind_kph + " km/h";
    } else {
      feel.textContent = weatherData.current.feelslike_f + " °F";
      windSpeed.textContent = weatherData.current.wind_mph + " mph";
    }
    const humidity = document.querySelector(".humidity");

    humidity.textContent = weatherData.current.humidity + "%";
    const chanceOfRain = document.querySelector(".chanceOfRain");
    chanceOfRain.textContent =
      weatherData.forecast.forecastday[0].day.daily_chance_of_rain + "%";
  }
}

async function forecastInfo(weatherData, measurementSystem) {
  //2 diaforetika render ena gia daily ena gia hourly
  //loopa 3 meres to array
  //poia mera einai
  //temperature
  //feelslike mikrotero
  //kai eikona
}
async function render(city, measurementSystem) {
  let weatherData;
  try {
    weatherData = await getWeather(city);
  } catch (error) {
    console.log("There was an error", error);
  }
  console.log(weatherData);
  mainInfo(weatherData, measurementSystem);
  leftInfo(weatherData, measurementSystem);
  forecastInfo(weatherData, measurementSystem);
}
render(city, "metrics");
