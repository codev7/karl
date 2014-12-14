Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {

  this.route('home', {
    path: '/',
    template: "dailyView",
    waitOn: function() {
      return shiftShedularSubs(new Date().toISOString().slice(0,10).replace(/-/g,"-"));
    },
    data: function() {
      Session.set("thisDate", new Date().toISOString().slice(0,10).replace(/-/g,"-"));
    }
  });

  this.route('daily', {
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

  this.route('schedule', {
    path: '/schedule',
    template: "shiftSchedule"
  });

  this.route('weekly', {
    path: '/week/:_weekStart/:_weekEnd',
    template: "weeklyView",
    waitOn: function() {
      console.log("----------");
      Meteor.subscribe("weeklyShifts", this.params._weekStart, this.params._weekEnd);
    },
    data: function() {
      Session.set("thisWeek", 1);
    }
  });
});

function shiftShedularSubs(date) {
  var subscriptions = [];
  var shiftsSubs = Meteor.subscribe("dailyShift", date);
  subscriptions.push(shiftsSubs);
  var workersSubs = Meteor.subscribe("allWorkers");
  subscriptions.push(workersSubs);
  var uncompletedJobsSubs = Meteor.subscribe("jobsToBeCompleted");
  subscriptions.push(uncompletedJobsSubs);
  // var holidays = Meteor.subscribe("onHoliday");
  // subscriptions.push(holidays);
  return subscriptions;
}
