Template.salesForecastList.events({
  'click .generateJobs': function(event) {
    var forecast = Forecast.find().fetch();
    var menuInfo = [];
    if(forecast.length > 0) {
      forecast.forEach(function(item) {
        var doc = {};
        doc.id = item._id;

        var menuItem = MenuItems.findOne(item._id);
        var portions = parseFloat(item.expectedRevenue / menuItem.salesPrice);
        if(!portions && portions < 0) {
          portions = 0;
        } else {
          portions = Math.round(portions)
        }
        if(portions == portions) {
          if(portions == Infinity) {
            portions = 0;
          } 
        } else {
          portions = 0;
        }
        doc.quantity = portions;
        menuInfo.push(doc);
      });
      console.log("........", menuInfo)
      Meteor.call("generateJobs", menuInfo, new Date(), function(err, result) {
        if(err) {
          console.log(err);
          return;
        } else {
          console.log(result);
          Router.go("jobs");
        }
      });
    }
    
  }
});