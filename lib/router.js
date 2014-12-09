Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {

  this.route('home', {
    path: '/',
    template: "shiftsList",
    waitOn: function() {
      return shiftShedularSubs(new Date().toISOString().slice(0,10).replace(/-/g,"-"));
    },
    data: function() {
      Session.set("thisDate", new Date().toISOString().slice(0,10).replace(/-/g,"-"));
    }
  });

  this.route('daily', {
    path: '/:_date',
    template: "shiftsList",
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
});

function shiftShedularSubs(date) {
  var subscriptions = [];
  var shiftsSubs = Meteor.subscribe("dailyShift", date);
  subscriptions.push(shiftsSubs);
  var workersSubs = Meteor.subscribe("availableWorkers");
  subscriptions.push(workersSubs);
  var uncompletedJobsSubs = Meteor.subscribe("jobsToBeCompleted");
  subscriptions.push(uncompletedJobsSubs);
  return subscriptions;
}
