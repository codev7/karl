Template.innerHeader.helpers({
  "title": function() {
    var date = Session.get("thisDate");
    var routeName = Router.current().route.getName();
    if(routeName == "weekly") {
      var week = getDaysOfWeek(date);
      var weekTitle = moment(week.day1).format("MMM-DD") + " - " + moment(week.day7).format("MMM-DD");
      weekTitle += " of " + moment(week.day1).format("YYYY")
      return weekTitle;
      console.log(week);
    } else if(routeName == "daily" || routeName == "home") {
      var thisDate = "";
      if(date) {
        thisDate = new Date(date);
      } else {
        thisDate = new Date();
      }
      return moment(thisDate).format("MMM Do YY")
    }
  }
});

Template.innerHeader.events({
  'click #prevDay': function(event) {
    var pathname = location.pathname.slice(1, 15);
    var toRoute = "";
    if(pathname) {
      var date = location.pathname.substring(1, 11);
      date = new Date(date);
      date.setDate(date.getDate() - "1");
      toRoute = date.toISOString().slice(0,10).replace(/-/g,"-");
    } else {
      var today = new Date();   
      today.setDate(today.getDate() - "1");
      var yesterday = today.toISOString().slice(0,10).replace(/-/g,"-");
      toRoute = yesterday;
    }
    Router.go("daily", {"_date": toRoute});
  },

  'click #nextDay': function(event) {
    var pathname = location.pathname.slice(1, 15);
    var toRoute = "";
    if(pathname) {
      var date = location.pathname.substring(1, 11);
      date = new Date(date);
      date.setDate(date.getDate() + 1);
      toRoute = date.toISOString().slice(0,10).replace(/-/g,"-");
    } else {
      var today = new Date(); 
      today.setDate(today.getDate() + 1);
      var yesterday = today.toISOString().slice(0,10).replace(/-/g,"-");
      toRoute = yesterday;
    }
    Router.go("daily", {"_date": toRoute});
  },

  'click #today': function(event) {
    Router.go("home");
  }
});