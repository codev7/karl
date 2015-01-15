Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/admin', {
  name: "admin",
  path: '/admin',
  template: "adminView",
  waitOn: function() {
    return adminSubs;
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
    var dates = getDaysOfWeek(this.params._date);
    var cursors = [];
    var weeklyShifts = Meteor.subscribe("weeklyShifts", dates);
    cursors.push(weeklyShifts);
    var jobTypes = Meteor.subscribe("jobTypes");
    cursors.push(jobTypes);
    return cursors;
  },
  data: function() {
    var dates = getDaysOfWeek(this.params._date);
    Session.set("thisWeek", dates);
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
  var workersSubs = Meteor.subscribe("activeWorkers", date);
  subscriptions.push(workersSubs);
  var uncompletedJobsSubs = Meteor.subscribe("jobsToBeCompleted");
  subscriptions.push(uncompletedJobsSubs);
  var jobTypes = Meteor.subscribe("jobTypes");
  subscriptions.push(jobTypes);
  // var holidays = Meteor.subscribe("onHoliday");
  // subscriptions.push(holidays);
  return subscriptions;
}

function adminSubs(date) {
  var subscriptions = [];
  var adminSubscriptions = Meteor.subscribe("admin");
  subscriptions.push(adminSubscriptions);
  // var uncompletedJobsSubs = Meteor.subscribe("jobsToBeCompleted");
  // subscriptions.push(uncompletedJobsSubs);
  // var holidays = Meteor.subscribe("onHoliday");
  // subscriptions.push(holidays);
  return subscriptions;
}
