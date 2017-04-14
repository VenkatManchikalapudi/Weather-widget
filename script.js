var appWeatherWidget = angular.module('weatherWidget', []);

appWeatherWidget.directive('weatherWidget', function() {
  return {
    controller: 'weatherWidgetCtrl',
    restrict: 'AE',
    scope: {},
    templateUrl: 'weatherWidgetTemplate.html',
    link: function(scope, ele, attrs) {
      scope.init(attrs.config);
    }
  }
});

appWeatherWidget.controller('weatherWidgetCtrl', ['$scope', '$http', 'weatherService', function($scope, $http, weatherService) {
  $scope.init = function(config) {
    //Resolve the config to access users preferences. ex. window[config], or resolve the id using a service.
    weatherService.getWeather().success(function(response) {
      $scope.loadWeather(response.query.results.channel);
    });
  };

  $scope.loadWeather = function(objWeather) {
    $scope.weatherLocation = objWeather.location.city + ', ' + objWeather.location.region;
    $scope.temperature = objWeather.item.condition.temp;
    $scope.conditions = objWeather.item.condition.text;
    $scope.forecast = objWeather.item.forecast.splice(0, 5);
    $scope.conditionImgCode = objWeather.item.condition.code;
  };

}]);

appWeatherWidget.service('weatherService', ['$http', function($http){
  this.getWeather = function(){
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22mclean%2C%20va%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    return $http.get(url);
  };
}]);