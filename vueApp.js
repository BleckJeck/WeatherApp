/*jshint esversion: 6 */

const app = new Vue({
  el: '#app',
  data: {
    currentLocation: 'Searching...',
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
    isCurrent: true,
    isSearching: false,
    displayCelsius: true,
  },
  watch: {
    searchLocation: function() {
      this.displayLocation = 'Searching...';
      if (this.searchLocation.length > 0) {
        this.isSearching = true;
        this.getWeather();
      } else {
        this.isSearching = false;
      }
    },
  },
  mounted: function() {
    var vm = this;
    var icon = '';
    var url = 'https://api.openweathermap.org/data/2.5/weather?lat=';
    var auth = '&APPID=fbb4562a1c0d9b559f73274031640058';
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        vm.currentLatitude = position.coords.latitude;
        vm.currentLongitude = position.coords.longitude;
        axios.get(url + vm.currentLatitude + '&lon=' + vm.currentLongitude + auth)
          .then(function(response) {
            vm.currentLocation = response.data.name + ', ' + response.data.sys.country;
            vm.currentWeather = response.data.weather[0].description.toUpperCase();
            icon = response.data.weather[0].icon;
            vm.selectCurrIcon(icon);
            vm.currTempC = Math.round(response.data.main.temp - 273.15) + '°';
            vm.currTempF = Math.round(9 / 5 * (response.data.main.temp - 273.15) + 32) + '°';
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
      var icon = '';
      axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + vm.searchLocation + '&APPID=fbb4562a1c0d9b559f73274031640058')
        .then(function(response) {
          vm.displayLocation = response.data.name + ", " + response.data.sys.country;
          vm.weatherForLocation = response.data.weather[0].description.toUpperCase();
          icon = response.data.weather[0].icon;
          vm.selectIcon(icon);
          vm.tempC = Math.round(response.data.main.temp - 273.15) + '°';
          vm.tempF = Math.round(9 / 5 * (response.data.main.temp - 273.15) + 32) + '°';
        })
        .catch(function(error) {
          vm.displayLocation = 'That probably does not exist!';
        });
    }, 500),
    toggleTemp: function() {
      var vm = this;
      vm.displayCelsius = !vm.displayCelsius;
    },
    toggleView: function() {
      var vm = this;
      vm.isCurrent = !vm.isCurrent;
    },
    reset: function() {
      var vm = this;
      vm.searchLocation = '';
      vm.displayLocation = '';
      vm.weatherForLocation = '';
      vm.weatherIcon = '';
      vm.tempC = '';
      vm.tempF = '';
    },
    selectCurrIcon: function(icon) {
      var vm = this;
      switch (icon) {
        case '01d':
          vm.currWeatherIcon = 'wi wi-day-sunny';
          break;
        case '01n':
          vm.currWeatherIcon = 'wi wi-night-clear';
          break;
        case '02d':
        case '03d':
        case '04d':
          vm.currWeatherIcon = 'wi wi-day-cloudy';
          break;
        case '02n':
        case '03n':
        case '04n':
          vm.currWeatherIcon = 'wi wi-night-alt-cloudy';
          break;
        case '09d':
        case '10d':
        case '09n':
        case '10n':
          vm.currWeatherIcon = 'wi wi-rain';
          break;
        case '11d':
        case '11n':
          vm.currWeatherIcon = 'wi wi-thunderstorm';
          break;
        case '13d':
        case '13n':
          vm.currWeatherIcon = 'wi wi-snow';
          break;
        case '50d':
        case '50n':
          vm.currWeatherIcon = 'wi wi-fog';
          break;
        default:
          vm.currWeatherIcon = 'wi wi-na';
      }
    },
    selectIcon: function(icon) {
      var vm = this;
      switch (icon) {
        case '01d':
          vm.weatherIcon = 'wi wi-day-sunny';
          break;
        case '01n':
          vm.weatherIcon = 'wi wi-night-clear';
          break;
        case '02d':
        case '03d':
        case '04d':
          vm.weatherIcon = 'wi wi-day-cloudy';
          break;
        case '02n':
        case '03n':
        case '04n':
          vm.weatherIcon = 'wi wi-night-alt-cloudy';
          break;
        case '09d':
        case '10d':
        case '09n':
        case '10n':
          vm.weatherIcon = 'wi wi-rain';
          break;
        case '11d':
        case '11n':
          vm.weatherIcon = 'wi wi-thunderstorm';
          break;
        case '13d':
        case '13n':
          vm.weatherIcon = 'wi wi-snow';
          break;
        case '50d':
        case '50n':
          vm.weatherIcon = 'wi wi-fog';
          break;
        default:
          vm.weatherIcon = 'wi wi-na';
      }
    }
  }
});
