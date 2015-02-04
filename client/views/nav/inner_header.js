Template.innerHeader.helpers({
  "title": function() {
    var routeName = Router.current().route.getName();
    if(routeName == "weekly") {
      var week = Session.get("thisWeek");
      var weekTitle = null;
      var sunday_year = moment(new Date(week.day1)).format("YYYY");
      var saturday_year = moment(new Date(week.day7)).format("YYYY");
      if(sunday_year != saturday_year) {
        weekTitle = moment(new Date(week.day1)).format("MMM Do YYYY");
        weekTitle += " - "
        weekTitle += moment(new Date(week.day7)).format("MMM Do YYYY");
      } else {
        weekTitle = moment(new Date(week.day1)).format("MMM Do") + " - " + moment(new Date(week.day7)).format("MMM Do");
        weekTitle += " of " + moment(new Date(week.day1)).format("YYYY")
      }
      return weekTitle;
    } else if(routeName == "daily" || routeName == "home" || routeName == "member") {
      var date = Session.get("thisDate");
      var thisDate = new Date();
      if(date) {
        thisDate = new Date(date);
      }
      var dateTitle = moment(thisDate).format("MMM Do YYYY");
      if(routeName == "member") {
        var workerId = Session.get("thisWorker");
        var worker = Workers.findOne(workerId);
        if(worker) {
          dateTitle += " - " + worker.name;
        }
      }
      return dateTitle;
    }
  },

  'navPermission': function() {
    var routeName = Router.current().route.getName();
    if(routeName == "weekly") {
      return false;
    } else if(routeName == "home" || routeName == "daily" || routeName == "member") {
      return true;
    }
  }
});

Template.innerHeader.events({
  'click #prevDay': function(event) {
    var routeName = Router.current().route.getName();
    var date = null;
    if(routeName == "daily" || routeName == "home") {
      date = Router.current().params._date;
    } else if(routeName == "member") {
      date = Router.current().params.date;
    }
    var toRoute = "";
    if(date) {
      date = new Date(date);
      date.setDate(date.getDate() - 1);
      toRoute = moment(date).format("YYYY-MM-DD");
    } else {
      var today = new Date();   
      today.setDate(today.getDate() - 1);
      var yesterday = moment(today).format("YYYY-MM-DD");
      toRoute = yesterday;
    }
    if(routeName == "daily" || routeName == "home") {
      Router.go("daily", {"_date": toRoute});
    } else if(routeName == "member") {
      var worker = Router.current().params._id;
      Router.go("member", {"_id": worker, "date": toRoute});
    }
  },

  'click #nextDay': function(event) {
    var routeName = Router.current().route.getName();
    var date = null;
    if(routeName == "daily" || routeName == "home") {
      date = Router.current().params._date;
    } else if(routeName == "member") {
      date = Router.current().params.date;
    }
    var toRoute = "";
    if(date) {
      date = new Date(date);
      date.setDate(date.getDate() + 1);
      toRoute = moment(date).format("YYYY-MM-DD");
    } else {
      var today = new Date();   
      today.setDate(today.getDate() + 1);
      var yesterday = moment(today).format("YYYY-MM-DD");
      toRoute = yesterday;
    }
    if(routeName == "daily" || routeName == "home") {
      Router.go("daily", {"_date": toRoute});
    } else if(routeName == "member") {
      var worker = Router.current().params._id;
      Router.go("member", {"_id": worker, "date": toRoute});
    }
  },

  'click #today': function(event) {
    var routeName = Router.current().route.getName();
    if(routeName == "home" || routeName == "daily") {
      Router.go("home");
    } else {
      var worker = Router.current().params._id;
      var today = moment(new Date()).format("YYYY-MM-DD");
      Router.go("member", {"_id": worker, "date": today});
    }
  },

  'click #thisWeek': function(event) {
    Router.go("weekly", {'_date': moment().format("YYYY-MM-DD")})
  },

  'click #prevWeek': function(event) {
    var thisWeek = Session.get("thisWeek");
    var prevWeek = moment(new Date(thisWeek.day1)).weekday(-7).format("YYYY-MM-DD");
    Router.go("weekly", {'_date': prevWeek});
  },

  'click #nextWeek': function(event) {
    var thisWeek = Session.get("thisWeek");
    var nextWeek = moment(new Date(thisWeek.day1)).weekday(7).format("YYYY-MM-DD");
    Router.go("weekly", {'_date': nextWeek});
  },

  'click #title': function() {
    var routeName = Router.current().route.getName();
    if(routeName == "weekly") {
      $("#title").on("show", function(ev) {
        var week = getDaysOfWholeWeek(new Date());
        var daysOfWeek = [];
        if(Session.get("thisWeek")) {
          week = getDaysOfWholeWeek(Session.get("thisWeek").day1);
        } 
        if(week) {
          week.forEach(function(obj) {
            daysOfWeek.push(new Date(moment(obj.date).format("YYYY-M-D")));
          });
        }
        $("#title").datepicker("setDates", daysOfWeek);
      }).datepicker({
        multidate: true,
        multidateSeparator: '-',
        todayBtn: "linked",
        todayHighlight: true
      }).on('changeDate', function(ev){
        var date = moment(ev.date).format("YYYY-MM-DD");
        Session.set("thisDate", date);
        Router.go("weekly", {"_date": date});
        $('#title').datepicker('remove');
      });
    } else if(routeName == "daily" || routeName == "home") {
      $("#title").on("show", function(ev) {
        var date = new Date(moment(new Date()).format("YYYY-M-D"));
        if(Session.get("thisDate")) {
          date = new Date(moment(Session.get("thisDate")).format("YYYY-M-D"))
        }
        $("#title").datepicker("setDate", date);
      }).datepicker({
        todayHighlight: true
      }).on('changeDate', function(ev){
        var date = moment(ev.date).format("YYYY-MM-DD");
        Session.set("thisDate", date);
        Router.go("daily", {"_date": date});
        $('#title').datepicker('remove');
      });
    } 
  }
});