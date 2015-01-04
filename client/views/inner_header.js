Template.innerHeader.helpers({
  "dateTitle": function() {
    var date = Session.get("thisDate");
    var thisDate = "";
    if(date) {
      thisDate = new Date(date);
    } else {
      thisDate = new Date();
    }
    return moment(thisDate).format("MMM Do YY")
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