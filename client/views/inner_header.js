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
  },

  'click #week': function(event) {
    event.preventDefault();
    var today_s = new Date();
    var today_day_s = today_s.getDay() - 1;
    today_s.setDate(today_s.getDate() - today_day_s);
    var weekStart = today_s.toISOString().slice(0,10).replace(/-/g,"-");
    console.log("---------s-----", weekStart, today_day_s);

    var today_e = new Date();
    var today_day_e = today_e.getDay() - 1;
    // console.log(today_day_e, typeof(today_day_e));
    today_e.setDate(today_e.getDate() + today_day_e);
    var weekEnd = today_e.toISOString().slice(0,10).replace(/-/g,"-");
    console.log("--------e------", weekEnd, today_day_e);

    Router.go("weekly", {"_weekStart": weekStart, "_weekEnd": weekEnd})
  }
});