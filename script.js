const APIkey = "ec4309bb6b4d4c40b85172526233009";
let days = "3";
let city = "Larisa";
let url;

async function getWeather(city) {
  try {
    //console.time("API call");
    url = `https://api.weatherapi.com/v1/forecast.json?key=${APIkey}&q=${city}&days=${days}`;
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) {
      const weatherData = await response.json();
      //console.timeEnd("API call");

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
  render(city.cityName, "metrics", "daily");
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
        render(weatherData.location.name, "ImperialSystem", "daily");
      } else {
        render(weatherData.location.name, "metrics", "daily");
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

async function forecastDaily(weatherData, measurementSystem) {
  if (weatherData != false) {
    const forecastContent = document.querySelector(".forecastContent");
    forecastContent.querySelectorAll("*").forEach((n) => n.remove());
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    weatherData.forecast.forecastday.forEach((item, index) => {
      const forecastContent = document.querySelector(".forecastContent");

      forecastContent.classList.remove("flex-start");
      forecastContent.classList.add("spaced-evenly");
      const dayBox = document.createElement("div");
      dayBox.classList.add("dayBox");
      const day = document.createElement("div");
      const date = new Date(item.date_epoch * 1000);
      day.textContent = days[date.getDay()];
      day.classList.add("dayName");
      const temperatureMax = document.createElement("div");
      const temperatureMin = document.createElement("div");
      temperatureMin.classList.add("smaller");
      const img = document.createElement("img");
      img.classList.add("square");

      img.src = "https:" + item.day.condition.icon;
      if (measurementSystem == "metrics") {
        temperatureMax.textContent = "Max " + item.day.maxtemp_c + " °C";
        temperatureMin.textContent = "Min " + item.day.mintemp_c + " °C";
      } else {
        temperatureMax.textContent = "Max " + item.day.maxtemp_f + " °F";
        temperatureMin.textContent = "Min " + item.day.mintemp_f + " °F";
      }
      dayBox.appendChild(day);
      dayBox.appendChild(temperatureMax);
      dayBox.appendChild(temperatureMin);
      dayBox.appendChild(img);
      forecastContent.appendChild(dayBox);
    });
  }
}

async function forecastHourly(weatherData, measurementSystem) {
  if (weatherData != false) {
    const forecastContent = document.querySelector(".forecastContent");
    forecastContent.classList.add("flex-start");
    forecastContent.classList.remove("spaced-evenly");
    forecastContent.querySelectorAll("*").forEach((n) => n.remove());
    weatherData.forecast.forecastday.forEach((item, index) => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      item.hour.forEach((hours, index) => {
        const hourBox = document.createElement("div");
        hourBox.classList.add("dayBox");
        const day = document.createElement("div");
        const dateDay = new Date(item.date_epoch * 1000);
        day.textContent = days[dateDay.getDay()];
        day.classList.add("smaller");
        const hour = document.createElement("div");
        const date = new Date(hours.time_epoch * 1000);
        hour.textContent = date.toLocaleString("en-US", {
          hour: "numeric",
          hour12: true,
        });
        hour.classList.add("dayName");

        const temperature = document.createElement("div");

        const img = document.createElement("img");
        img.classList.add("square");

        img.src = "https:" + hours.condition.icon;

        if (measurementSystem == "metrics") {
          temperature.textContent = hours.temp_c + " °C";
        } else {
          temperature.textContent = hours.temp_f + " °F";
        }
        hourBox.appendChild(day);
        hourBox.appendChild(hour);
        hourBox.appendChild(temperature);
        hourBox.appendChild(img);

        forecastContent.appendChild(hourBox);
      });
    });
  }
}
async function render(city, measurementSystem, which) {
  let weatherData;
  try {
    weatherData = await getWeather(city);
  } catch (error) {
    console.log("There was an error", error);
  }
  //console.log(weatherData);
  mainInfo(weatherData, measurementSystem);
  leftInfo(weatherData, measurementSystem);
  if (which == "daily") {
    forecastDaily(weatherData, measurementSystem);
  } else if (which == "hourly") {
    forecastHourly(weatherData, measurementSystem);
  }
}
render(city, "metrics", "daily");

const dailyButton = document.querySelector(".dailyButton");
dailyButton.addEventListener("click", (city) => {
  const cityName = document.querySelector(".name");
  const measurementSystem = document.querySelector(".temperature");
  let mm;
  if (measurementSystem.textContent.includes("C")) {
    mm = "metrics";
  } else {
    mm = "ImperialSystem";
  }
  render(cityName.textContent, mm, "daily");
});

const hourlyButton = document.querySelector(".hourlyButton");
hourlyButton.addEventListener("click", () => {
  const cityName = document.querySelector(".name");
  const measurementSystem = document.querySelector(".temperature");
  let mm;
  if (measurementSystem.textContent.includes("C")) {
    mm = "metrics";
  } else {
    mm = "ImperialSystem";
  }
  render(cityName.textContent, mm, "hourly");
});
