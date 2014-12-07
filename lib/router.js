Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {

  this.route('home', {
    path: '/',
    template: "shiftsList",
    waitOn: function() {
      var subscriptions = [];
      var shiftsSubs = Meteor.subscribe("dailyShift", new Date().toISOString().slice(0,10).replace(/-/g,"-"));
      subscriptions.push(shiftsSubs);
      var workersSubs = Meteor.subscribe("availableWorkers");
      subscriptions.push(workersSubs);
      return subscriptions;
    }
  });

  this.route('schedule', {
    path: '/schedule',
    template: "shiftSchedule"
  });
});
