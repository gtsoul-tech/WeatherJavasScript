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
  render(city.cityName);
});

async function mainInfo(city) {
  let weatherData;
  try {
    weatherData = await getWeather(city);
  } catch (error) {
    console.log("There was an error", error);
  }
  if (weatherData != false) {
    console.log(weatherData);
    const right_content = document.querySelector(".right-content");
    right_content.querySelectorAll("*").forEach((n) => n.remove());
    const description = document.createElement("div");
    description.textContent = weatherData.current.condition.text;
    description.classList.add("description");

    const name = document.createElement("div");
    name.textContent = weatherData.location.name;
    name.classList.add("name");
    const localTime = document.createElement("div");
    localTime.textContent = weatherData.location.localtime;
    localTime.classList.add("localTime");
    const temperature = document.createElement("div");
    temperature.textContent = weatherData.current.temp_c + "°C";
    temperature.classList.add("temperature");

    const metrics = document.createElement("div");
    metrics.textContent = "Display °F";
    metrics.classList.add("metrics");
    const img = document.createElement("img");

    img.src = "https:" + weatherData.current.condition.icon;
    right_content.appendChild(description);
    right_content.appendChild(name);
    right_content.appendChild(localTime);
    right_content.appendChild(temperature);
    right_content.appendChild(metrics);
    right_content.appendChild(img);
  }
}
function render(city) {
  mainInfo(city);
}
render(city);
