Template.salesForecastView.helpers({
  date: function() {
    var date = Router.current().params.date;
    return date;
  },

  todaysIsoDate: function() {
    var date = Router.current().params.date;
    return new Date(date);
  }
});

Template.salesForecastView.events({
  'click .today': function(event) {
    var date = moment(new Date()).format("YYYY-MM-DD");
    Router.go("salesForecast", {"date": date});
  },

  'click .previousDay': function(event) {
    var date = Router.current().params.date;
    var yesterday = new Date(date).getTime() - (24 * 60 * 60 * 1000);
    yesterday = moment(yesterday).format("YYYY-MM-DD");
    Router.go("salesForecast", {"date": yesterday});

  },

  'click .nextDay': function(event) {
    var date = Router.current().params.date;
    var tomorrow = new Date(date).getTime() + (24 * 60 * 60 * 1000);
    tomorrow = moment(tomorrow).format("YYYY-MM-DD");
    Router.go("salesForecast", {"date": tomorrow});

  },

  'click .generateJobs': function(event) {
    var date = Router.current().params.date;
    var forecast = SalesForecast.find({"date": new Date(date)}).fetch();
    var menuDoc = [];
    forecast.forEach(function(item) {
      var doc = {"id": item.menuItem, "quantity": item.quantity};
      menuDoc.push(doc);
    });
    if(menuDoc.length > 0) {
      Meteor.call("generateJobs", menuDoc, date, function(err, result) {
        if(err) {
          console.log(err);
          return alert(err);
        } else {
          console.log("......result.", result);
        }
      });
    }
  },

  'click .viewGeneratedJobs': function(event) {
    event.preventDefault();
    Router.go("jobs");
  }
});