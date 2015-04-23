var component = FlowComponents.define("forecastedListItemPerDay", function(props) {
  this.forecast = props.forecast;
  console.log(this.forecast);
});

component.state.day = function() {
  return this.forecast._id;
}

component.state.revenue = function() {
  return this.forecast.revenue;
}

component.state.isNullForecastOptions = function() {
  if(this.forecast.relevantOnDates.length > 0) {
    return true;
  } else {
    return false;
  } 
}

component.state.forecastOptions = function() {
  if(this.forecast.relevantOnDates.length >= 0) {
  console.log("---------", this.forecast.relevantOnDates);
    return this.forecast.relevantOnDates;
  } 
}
