// $('#currentDay').text(moment().format('dddd, MMMM Do')) 


var loadWeather = function() {
    weatherSearch = JSON.parse(localStorage.getItem("weatherSearch"));
  
    // if nothing in localStorage, create a new object to track all task status arrays
    if (!weatherSearch) {
      weatherSearch = [];
    }
    else if (weatherSearch.length > 0) {
      displayWeather(weatherSearch[weatherSearch.length - 1]) 
    }
};
loadWeather()

// save to localStorage
var saveWeather = function() {
    localStorage.setItem("weatherSearch", JSON.stringify(weatherSearch));
};

function displayWeather(loc) {
    document.getElementById("wHistory").innerHTML = ''
    document.getElementById("currentSel").innerHTML = ''
    document.getElementById("forecast").innerHTML = ''

    // Display Sidebar History at Bottom Left //
    for (let index = 0; index < weatherSearch.length; index++) {
        var locHtml = "<button class='btn btn-secondary btn-sm btn-block my-2 hButton text-dark font-weight-bold'>" + weatherSearch[index] + "</button>";
        //console.log(weatherSearch[index]);
        document.getElementById("wHistory").innerHTML += locHtml;
        //console.log(locHtml)        
    }
    
    // Get long and lat from another API to plug into the onecall API //
    var apiFetch = "https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&appid=5f485932ce6a77c32c506953dba4be71&units=imperial";
    console.log("loc = " + loc)
    fetch(apiFetch)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      else {
        alert("City was not found.")
      }
    })
    .then(function(response) {
         var coordLon = response.coord.lon;
         var coordLat = response.coord.lat;

         // use onecall API for weather information //
         return fetch(
        'https://api.openweathermap.org/data/2.5/onecall?lat=' +
          coordLat +
          '&lon=' +
          coordLon +
          '&exclude=hourly,minutely&appid=5f485932ce6a77c32c506953dba4be71&units=imperial'
        );
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if (response.length === 0) {
        console.log('Could not find anything for that.');
      } else {

        // Display information at top right for current weather data //
        var temp = response.current.temp;
        var wind = response.current.wind_speed;
        var humidity = response.current.humidity;
        var uvi = response.current.uvi;
        var ico = response.current.weather[0].icon
        var icoUrl = "https://openweathermap.org/img/wn/" + ico + ".png"

        n =  new Date();
        y = n.getFullYear();
        m = n.getMonth() + 1;
        d = n.getDate();
        document.getElementById("currentSel").innerHTML += "<h4 class='font-weight-bold'>" + loc + " (" + m + '/' + d + '/' + y + ") <img src=" + icoUrl + "></h4>";
        document.getElementById("currentSel").innerHTML += "<p>Temp: " + temp + "℉</p>";
        document.getElementById("currentSel").innerHTML += "<p>Wind: " + wind + " MPH</p>";
        document.getElementById("currentSel").innerHTML += "<p>Humidity: " + humidity + " %</p>";
        if (uvi > 6) {
            document.getElementById("currentSel").innerHTML += "<p>UV Index: <span class='bg-danger text-white rounded p-1'> " + uvi + " </span></p>";
        }
        else if (uvi > 3) {
            document.getElementById("currentSel").innerHTML += "<p>UV Index: <span class='bg-warning text-white rounded p-1'> " + uvi + " </span> </p>";
        }
        else {
            document.getElementById("currentSel").innerHTML += "<p>UV Index: <span class='bg-success text-white rounded p-1'> " + uvi + " </span></p>";
        }
        
        // Display 5 day weather forecast at bottom right //
        for (let index = 1; index < 6; index++) {
            var tempFor = response.daily[index].temp.day;
            var windFor = response.daily[index].wind_speed;
            var humidityFor = response.daily[index].humidity;
            var timeUnix = response.daily[index].dt;
            var icoFor = response.daily[index].weather[0].icon
            var icoUrlFor = "https://openweathermap.org/img/wn/" + icoFor + ".png"

            var unixTime = timeUnix;
            var date = new Date(unixTime*1000);
            var humanDate = date.toLocaleDateString("en-US")

            document.getElementById("forecast").innerHTML += 
            "<div class='col-md text-light mr-3 mb-3' id='forecasts'>" +
            "<h5>" + humanDate + "</h5>" +
            "<img src=" + icoUrlFor + ">" +
            "<p>Temp: " + tempFor + " ℉</p>" +
            "<p>Wind: " + windFor + " MPH</p>" +
            "<p>Humidity: " + humidityFor + " %</p>" +
            "</div>";
            
        }
      }
    });
}

document.getElementById("wSearchBtn").addEventListener("click", searchBtn);
function searchBtn() {
  var locInput = document.getElementById("wSearchInput").value;
  if (locInput) {
    weatherSearch.push(locInput);
    saveWeather()
    //console.log(weatherSearch)
    document.getElementById("wSearchInput").value = "";
    displayWeather(locInput)
  }
  else {
    alert("Please enter a valid city name.")
  }
}

$("#wHistory").on("click", "button", function() {
  //$(this).closest(".timeRow").children(".saveBtn").children("span").addClass("oi-lock-unlocked").removeClass("oi-lock-locked")
  var text = $(this)
    .text()
    .trim();
  console.log("text = " + text);
  displayWeather(text);
});



