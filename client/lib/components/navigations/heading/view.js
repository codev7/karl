Template.pageHeading.helpers({
  // Route for Home link in breadcrumbs
  home: 'dashboard1'
});

Template.pageHeading.events({
  'click #submitMenuItem': function(event) {
    event.preventDefault();
    Router.go("submitMenuItem");
  },

  'click .subscribeMenuItemBtn': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "menulist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .unSubscribeMenuItemBtn': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "menulist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click #menuSubmit': function(event) {
    event.preventDefault();
    $("#submitNewMenu").submit();
  },

  'click #submitJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click .subscribeJobsList': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "joblist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .unSubscribeJobsList': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "joblist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .today': function(event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    Router.go("actualSales", {"date": date});
  },

  'click .previousDay': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var yesterday = moment(date).subtract(1, "days").format("YYYY-MM-DD");
    Router.go("actualSales", {"date": yesterday});
  },

  'click .nextDay': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    var tomorrow = moment(date).add(1, "days").format("YYYY-MM-DD")
    Router.go("actualSales", {"date": tomorrow});
  },

  'click .thisWeek': function(event) {
    event.preventDefault();
    var week = moment().format("w");
    Router.go("cafeSalesForecast", {"week": week});
  },

  'click .nextWeek': function(event) {
    event.preventDefault();
    var week = parseInt(Router.current().params.week) + 1;
    Router.go("cafeSalesForecast", {"week": week});
  },

  'click .previousWeek': function(event) {
    event.preventDefault();
    var week = parseInt(Router.current().params.week) - 1;
    Router.go("cafeSalesForecast", {"week": week});
  }
});