Template.salesListedView.helpers({
  date: function() {
    var date = Router.current().params.date;
    return date;
  }
});

Template.salesListedView.events({
  'click .today': function(event) {
    var date = moment(new Date()).format("YYYY-MM-DD");
    Router.go("sales", {"date": date});
  },

  'click .previousDay': function(event) {
    var date = Router.current().params.date;
    var yesterday = new Date(date).getTime() - (24 * 60 * 60 * 1000);
    yesterday = moment(yesterday).format("YYYY-MM-DD");
    Router.go("sales", {"date": yesterday});

  },

  'click .nextDay': function(event) {
    var date = Router.current().params.date;
    var tomorrow = new Date(date).getTime() + (24 * 60 * 60 * 1000);
    tomorrow = moment(tomorrow).format("YYYY-MM-DD");
    Router.go("sales", {"date": tomorrow});

  }
});