Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/admin', {
  name: "admin",
  path: '/admin',
  template: "adminView",
  waitOn: function() {
    return adminSubs;
  },
  data: function() {
    Session.set("thisWorker", null);
  }
});

Router.route('/', {
  name: "home",
  path: '/',
  template: "dailyView",
  waitOn: function() {
    var date = moment(new Date()).format("YYYY-MM-DD")
    return shiftShedularSubs(date);
  },
  data: function() {
    var date = moment(new Date()).format("YYYY-MM-DD");
    Session.set("thisDate", date);
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
    var weeklyShiftsSub = Meteor.subscribe("weekly", dates);
    cursors.push(weeklyShiftsSub);
    var jobTypesSub = Meteor.subscribe("jobTypes");
    cursors.push(jobTypesSub);
    return cursors;
  },
  data: function() {
    var dates = getDaysOfWeek(this.params._date);
    Session.set("thisWeek", dates);
  }
});

Router.route('/member/:_id', {
  name: "member",
  path: '/member/:_id',
  template: "teamMemberJobView"
});


function shiftShedularSubs(date) {
  var subscriptions = [];
  var shiftsSubs = Meteor.subscribe("daily", date);
  subscriptions.push(shiftsSubs);
  var workersSubs = Meteor.subscribe("activeWorkers", date);
  subscriptions.push(workersSubs);
  var uncompletedJobsSubs = Meteor.subscribe("unAssignedJobs");
  subscriptions.push(uncompletedJobsSubs);
  var jobTypes = Meteor.subscribe("jobTypes");
  subscriptions.push(jobTypes);
  return subscriptions;
}

function adminSubs(date) {
  var subscriptions = [];
  var adminSubscriptions = Meteor.subscribe("allWorkers");
  subscriptions.push(adminSubscriptions);
  var jobTypesSubs = Meteor.subscribe("jobTypes");
  subscriptions.push(jobTypesSubs);
  var dates = getDaysOfMonth(date);
  var holidaySubs = Meteor.subscribe("monthlyHolidays", dates.start, dates.end);
  subscriptions.push(holidaySubs);
  // var uncompletedJobsSubs = Meteor.subscribe("jobsToBeCompleted");
  // subscriptions.push(uncompletedJobsSubs);
  // var holidays = Meteor.subscribe("onHoliday");
  // subscriptions.push(holidays);
  return subscriptions;
}
