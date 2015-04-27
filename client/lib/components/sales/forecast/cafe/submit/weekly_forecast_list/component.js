var component = FlowComponents.define("weeklyForecastList", function(props) {
  var doc = ForecastCafe.find().fetch();
  if(doc.length <= 0) {
    weeklyItems = [
      {'_id': 'Monday', 'revenue': 0, 'menus': []}, 
      {'_id' :'Tuesday', 'revenue': 0, 'menus': []},
      {'_id': 'Wednesday', 'revenue': 0, 'menus': []},
      {'_id': 'Thursday', 'revenue': 0, 'menus': []},
      {'_id': 'Friday', 'revenue': 0, 'menus': []},
      {'_id': 'Saturday', 'revenue': 0, 'menus': []},
      {'_id': 'Sunday', 'revenue': 0, 'menus': []},
    ] 
    weeklyItems.forEach(function(day) {
      ForecastCafe.insert(day);
    });
  } 
  this.onRendered(this.onPageRender);
});

component.state.week = function() {
  var week = ForecastCafe.find();
  return week;
}

component.state.expectedTotalRevenue = function() {
  var forecast = ForecastCafe.find().fetch();
  var total = 0;
  if(forecast) {
    forecast.forEach(function(item) {
      total += item.revenue;
    });
  }
  return total;
}

component.prototype.onPageRender = function() {
  var doc = ForecastCafe.find().fetch();
  if(doc.length > 0) {
    doc.forEach(function(item) {
      ForecastCafe.update({"_id": item._id}, {$set: {"menus": [], "selected": []}});
    });
  } 
}
