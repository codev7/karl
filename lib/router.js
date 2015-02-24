Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/admin', {
  name: "admin",
  path: '/admin',
  template: "adminView",
  waitOn: function() {
  },
  data: function() {
  }
});

Router.route('/workers', {
  name: "workers",
  path: '/workers',
  template: "workersListView",
  waitOn: function() {
    return adminSubs();
  },
  data: function() {
    Session.set("thisWorker", null);
  }
});

Router.route('/menuItems', {
  name: "menuItems",
  path: '/menuItems',
  template: "menuItemsListView",
  waitOn: function() {
    // return adminSubs();
  },
  data: function() {
    // Session.set("thisWorker", null);
  }
});

Router.route('/menuItem/:_id', {
  name: "menuItemDetail",
  path: '/menuItem/:_id',
  template: "menuItemDetailedView",
  waitOn: function() {
    // return adminSubs();
  },
  data: function() {
    // Session.set("thisWorker", null);
  }
});

Router.route('/ingredients', {
  name: "ingredientsList",
  path: '/ingredients',
  template: "ingredientsListView",
  waitOn: function() {
    // return adminSubs();
  },
  data: function() {
    // Session.set("thisWorker", null);
  }
});

Router.route('/jobItemsList', {
  name: "jobItemsList",
  path: '/jobItemsList',
  template: "jobItemsListView",
  waitOn: function() {
    // return adminSubs();
  },
  data: function() {
    // Session.set("thisWorker", null);
  }
});

Router.route('/', {
  name: "home",
  path: '/',
  template: "dailyView",
  waitOn: function() {
    var date = moment(new Date()).format("YYYY-MM-DD")
    return dailySubs(date);
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
      return dailySubs(this.params._date)
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
    return weeklySubs(this.params._date);
  },
  data: function() {
    var dates = getDaysOfWeek(this.params._date);
    Session.set("thisWeek", dates);
  }
});


Router.route('/member/:_id/:date', {
  name: "member",
  path: '/member/:_id/:date',
  template: "teamMemberJobView",
  waitOn: function() {
    return Meteor.subscribe("daily", this.params.date, this.params._id);
  },
  data: function() {
    Session.set("thisDate", this.params.date);
    Session.set("thisWorker", this.params._id);
  }
});


function dailySubs(date) {
  var subscriptions = [];
  var shiftsSubs = Meteor.subscribe("daily", date, null);
  subscriptions.push(shiftsSubs);
  var workersSubs = Meteor.subscribe("activeWorkers", date);
  subscriptions.push(workersSubs);
  var uncompletedJobsSubs = Meteor.subscribe("unAssignedJobs");
  subscriptions.push(uncompletedJobsSubs);
  var jobTypes = Meteor.subscribe("jobTypes");
  subscriptions.push(jobTypes);
  return subscriptions;

}

function weeklySubs(date) {
  var dates = getDaysOfWeek(date);
  var cursors = [];
  var weeklyShiftsSub = Meteor.subscribe("weekly", dates);
  cursors.push(weeklyShiftsSub);
  var jobTypesSub = Meteor.subscribe("jobTypes");
  cursors.push(jobTypesSub);
  var salesSub = Meteor.subscribe("weeklySales", dates.day1, dates.day7);
  cursors.push(salesSub);
  return cursors;
}

function adminSubs() {
  var subscriptions = [];
  var adminSubscriptions = Meteor.subscribe("allWorkers");
  subscriptions.push(adminSubscriptions);
  var jobTypesSubs = Meteor.subscribe("jobTypes");
  subscriptions.push(jobTypesSubs);
  var date = new Date();
  var dates = getDaysOfMonth(date);
  var holidaySubs = Meteor.subscribe("monthlyHolidays", dates.start, dates.end);
  subscriptions.push(holidaySubs);
  return subscriptions;
}
