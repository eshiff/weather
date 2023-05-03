$(document).ready(function () {
   
    // this code defines an event listener for a button click and executes two functions to retrieve and display weather data and forecast information for a user's search term on a web page.
    $("#search-button").on("click", function () {
     
      var searchTerm = $("#search-value").val();
     
      $("#search-value").val("");
      weatherFunction(searchTerm);
      weatherForecast(searchTerm);
    });
  
   // the code defines an event listener for a keypress event on a button and executes the same functions as the "click" event listener when the Enter key is pressed while the button is in focus.
    $("#search-button").keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode === 13) {
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
      }
    });
  
  // This code retrieves an array of search history data stored in the browser's localStorage object under the key "history". It allows the search history to be maintained and updated across the application or website.
    var history = JSON.parse(localStorage.getItem("history")) || [];
  
  // this code initializes the weather app or website by checking for any stored search history data and displaying it on the web page. If there is any stored search history data, the code also automatically retrieves the most recent search term and displays weather information for it on the web page.
    if (history.length > 0) {
      weatherFunction(history[history.length - 1]);
    }
    
    for (var i = 0; i < history.length; i++) {
      createRow(history[i]);
    }
  
    // This function creates a new list item with the given text and appends it to the ".history" element in the HTML document. The function is used to add search terms to the search history list on the page. 
    function createRow(text) {
      var listItem = $("<li>").addClass("list-group-item").text(text);
      $(".history").append(listItem);
    }
  
    // This code adds a click event listener to all list items within an HTML element with class "history". When a user clicks on one of the list items, the code retrieves the text content of that list item and passes it as an argument to the "weatherFunction()" and "weatherForecast()" functions. This allows users to click on a previous search term and immediately retrieve weather information for that term, without having to re-enter it manually.
    $(".history").on("click", "li", function () {
      weatherFunction($(this).text());
      weatherForecast($(this).text());
    });
  
    // This is a function named weatherFunction that takes a searchTerm parameter. It makes an AJAX request to OpenWeatherMap API to get weather data for the specified location. If the searchTerm is not already in the history array, it pushes it to the array and saves the updated history array to local storage using localStorage.setItem. It then creates a card element and appends it to the #today div with the weather data returned from the API. It also makes another AJAX request to get the UV Index data for the location and updates the uvIndex element in the card with the returned data. The color of the UV Index value is also set based on the value of the index.
    function weatherFunction(searchTerm) {
  
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=9f112416334ce37769e5c8683b218a0d",
  
  
      }).then(function (data) {
       
        if (history.indexOf(searchTerm) === -1) {
        
          history.push(searchTerm);
          
          localStorage.setItem("history", JSON.stringify(history));
          createRow(searchTerm);
        }
     
        $("#today").empty();
  
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
  
  
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");
        console.log(data)
        var lon = data.coord.lon;
        var lat = data.coord.lat;
  
        $.ajax({
          type: "GET",
          url: "https://api.openweathermap.org/data/2.5/uvi?appid=9f112416334ce37769e5c8683b218a0d&lat=" + lat + "&lon=" + lon,
  
  
        }).then(function (response) {
          console.log(response);
  
          var uvColor;
          var uvResponse = response.value;
          var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
          var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);
  
  
          if (uvResponse < 3) {
            btn.addClass("btn-success");
          } else if (uvResponse < 7) {
            btn.addClass("btn-warning");
          } else {
            btn.addClass("btn-danger");
          }
  
          // This code adds the "uvIndex" and "btn" elements to a card on the web page, likely to display information related to the UV index. The "btn" element may provide additional functionality or information about the UV index.
          cardBody.append(uvIndex);
          $("#today .card-body").append(uvIndex.append(btn));
  
        });
  
       // this code retrieves current weather data for a given location, formats the data as a card, and appends the card to the web page.
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
        console.log(data);
      });
    }
   
    // This code defines a function called weatherForecast that takes in a searchTerm as a parameter. It then sends a GET request to OpenWeatherMap API to retrieve the 5-day forecast for the location specified by the searchTerm. Once the data is retrieved, it creates HTML elements to display the forecast information for each day at 3 PM (i.e., if the time in dt_txt includes "15:00:00"). It creates a div element with a class of col-md-2.5 to hold each day's information and adds it to a div element with a class of row. Finally, it appends the row div to an HTML element with an id of forecast.
    function weatherForecast(searchTerm) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=9f112416334ce37769e5c8683b218a0d&units=imperial",
  
      }).then(function (data) {
        console.log(data);
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
  
       
        for (var i = 0; i < data.list.length; i++) {
  
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
  
            var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var colFive = $("<div>").addClass("col-md-2.5");
            var cardFive = $("<div>").addClass("card bg-primary text-white");
            var cardBodyFive = $("<div>").addClass("card-body p-2");
            var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
            var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
  
          
            colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
            
            $("#forecast .row").append(colFive);
          }
        }
      });
    }
  
  });