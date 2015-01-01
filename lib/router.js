Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/admin', {
  name: "admin",
  path: '/admin',
  template: "adminView",
  waitOn: function() {
    return Meteor.subscribe("allWorkers");
  }
});

Router.route('/', {
  name: "home",
  path: '/',
  template: "dailyView",
  waitOn: function() {
    return shiftShedularSubs(new Date().toISOString().slice(0,10).replace(/-/g,"-"));
  },
  data: function() {
    Session.set("thisDate", new Date().toISOString().slice(0,10).replace(/-/g,"-"));
  }
});

Router.route('/:_date', {
  name: 'daily',
  path: '/:_date',
  template: "dailyView",
  waitOn: function() {
    if(this.params._date != null) {
      return shiftShedularSubs(this.params._date)
    }
  },
  data: function() {
    Session.set("thisDate", this.params._date);
  }
});

Router.route('/week/:_date', {
  name: "weekly",
  path: '/week/:_date',
  template: "weeklyView",
  waitOn: function() {
    var dates = getDaysOfWeek(this.params._date)
    Meteor.subscribe("weeklyShifts", dates);
  },
  data: function() {
    Session.set("thisWeek", 1);
  }
});


// Router.route('/admin', {
//   name: "adminsettings",
//   path: '/adm',
//   template: 'adminView',
//   // waitOn: function() {
//   //   console.log("----------");

//   // },
//   data: function() {
//     console.log("----------");
//   }
// });


function shiftShedularSubs(date) {
  var subscriptions = [];
  var shiftsSubs = Meteor.subscribe("dailyShift", date);
  subscriptions.push(shiftsSubs);
  var workersSubs = Meteor.subscribe("availableWorkers", date);
  subscriptions.push(workersSubs);
  var uncompletedJobsSubs = Meteor.subscribe("jobsToBeCompleted");
  subscriptions.push(uncompletedJobsSubs);
  // var holidays = Meteor.subscribe("onHoliday");
  // subscriptions.push(holidays);
  return subscriptions;
}


function getDaysOfWeek(date) {
  var curr = new Date(date); // get current date
  var firstDay = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var lastDay = firstDay + 6; // last day is the first day + 6

  var firstDayofWeek = new Date(curr.setDate(firstDay)).toISOString();
  var lastDayofWeek = new Date(curr.setDate(lastDay)).toISOString();
  return {
    "day1": firstDayofWeek,
    "day7": lastDayofWeek 
  };
}