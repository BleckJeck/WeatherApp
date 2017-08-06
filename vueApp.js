/*jshint esversion: 6 */

const app = new Vue({
  el: '#app',
  data: {
    currentLocation: 'Looking for you...',
    currentLatitude: null,
    currentLongitude: null,
    searchLocation: '',
    displayLocation: '',
    currentWeather: '',
    weatherForLocation: '',
    currWeatherIcon: '',
    weatherIcon: '',
    currTempC: '',
    currTempF: '',
    tempC: '',
    tempF: '',
    isSearching: false,
    displayCelsius: true,
  },
  watch: {
    searchLocation: function() {
      this.displayLocation = this.searchLocation;
      if (this.searchLocation.length > 1) {
        this.isSearching = true;
        this.getWeather();
      } else {
        this.isSearching = false;
      }
    },
  },
  mounted: function() {
    var vm = this;
    var url = 'https://api.openweathermap.org/data/2.5/weather?lat=';
    var auth = '&APPID=fbb4562a1c0d9b559f73274031640058';
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        vm.currentLatitude = position.coords.latitude;
        vm.currentLongitude = position.coords.longitude;
        axios.get(url + vm.currentLatitude + '&lon=' + vm.currentLongitude + auth)
          .then(function(response) {
            vm.currentLocation = 'Showing weather for ' + response.data.name + ', ' + response.data.sys.country;
            vm.currentWeather = response.data.weather[0].description.toUpperCase();
            vm.currWeatherIcon = 'https://openweathermap.org/img/w/' + response.data.weather[0].icon + '.png';
            vm.currTempC = Math.round(response.data.main.temp - 273.15) + "°C";
            vm.currTempF = Math.round(9 / 5 * (response.data.main.temp - 273.15) + 32) + "°F";
          })
          .catch(function(error) {
            vm.currentLocation = "Our spies couldn't find you! Maybe it's time to stop hiding?";
          });
      });
    } else {
      vm.currentLocation = "Our spies cannot find you! Maybe it's time to stop hiding?";
    }
  },
  methods: {
    getWeather: _.debounce(function() {
      var vm = this;
      axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + vm.searchLocation + '&APPID=fbb4562a1c0d9b559f73274031640058')
        .then(function(response) {
          vm.displayLocation = response.data.name + ", " + response.data.sys.country;
          vm.weatherForLocation = response.data.weather[0].description.toUpperCase();
          vm.weatherIcon = 'https://openweathermap.org/img/w/' + response.data.weather[0].icon + '.png';
          vm.tempC = Math.round(response.data.main.temp - 273.15) + "°C";
          vm.tempF = Math.round(9 / 5 * (response.data.main.temp - 273.15) + 32) + "°F";
        })
        .catch(function(error) {
          vm.displayLocation = 'a probably non-existent place';
        });
    }, 500),
    toggleTemp: function() {
      var vm = this;
      vm.displayCelsius = !vm.displayCelsius;
    }
  }
});
