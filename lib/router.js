Router.configure({
  layoutTemplate: 'layout'
});

// ------------------MENU
Router.route('/menus', {
  name: "menus",
  path: '/menus',
  template: "menusView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("menuList"));
    // cursors.push(Meteor.subscribe("ingredients"));
    // cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
  
  }
});

Router.route('/menus/submit', {
  name: "menuSubmit",
  path: '/menus/submit',
  template: "menuSubmitView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("menuList"));
    // cursors.push(Meteor.subscribe("ingredients"));
    // cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
  
  }
});

Router.route('/menuItems', {
  name: "menuItemsMaster",
  path: '/menuItems',
  template: "menuItemsListView",
  waitOn: function() {
    return Meteor.subscribe("menuList");
  }
});

Router.route('/menuItem/submit', {
  name: "menuItemSubmitStep1",
  path: '/menuItem/submit',
  template: "submitMenuItemViewStep1",
  waitOn: function() {
    // return adminSubs();
  },
  data: function() {
    // Session.set("thisWorker", null);
  }
});

Router.route('/menuItem/submit/:_id/step2', {
  name: "menuItemSubmitStep2",
  path: '/menuItem/submit/:_id/step2',
  template: "submitMenuItemViewStep2",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("menuItem", this.params._id));
    cursors.push(Meteor.subscribe("ingredients"));
    cursors.push(Meteor.subscribe("jobItems"));
    cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
    Session.set("thisMenuItem", this.params._id);
  }
});

Router.route('/menuItem/:_id', {
  name: "menuItemDetail",
  path: '/menuItem/:_id',
  template: "menuItemDetailedView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("menuItem", this.params._id));
    cursors.push(Meteor.subscribe("jobItems"));
    cursors.push(Meteor.subscribe("ingredients"));
    cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
    Session.set("thisMenuItem", this.params._id);
  }
});

Router.route('/menuItem/:_id/edit', {
  name: "menuItemEdit",
  path: '/menuItem/:_id/edit',
  template: "menuItemEditView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("menuItem", this.params._id));
    cursors.push(Meteor.subscribe("jobItems"));
    cursors.push(Meteor.subscribe("ingredients"));
    cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
    Session.set("thisMenuItem", this.params._id);
  }
});
// ---------------------MENU


// ---------------------JOB ITEM
Router.route('/jobItem/submit', {
  name: "submitJobItem",
  path: '/jobItem/submit',
  template: "submitJobItemView",
  waitOn: function() {
    var cursors = [];
    // cursors.push(Meteor.subscribe("menuItem", this.params._id));
    cursors.push(Meteor.subscribe("ingredients"));
    cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
 
  }
});

Router.route('/jobItems', {
  name: "jobItemsMaster",
  path: '/jobItems',
  template: "jobItemsListView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("jobItems"));
    cursors.push(Meteor.subscribe("ingredients"));
    cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
  
  }
});

Router.route('/jobItem/:_id', {
  name: "jobItemDetailed",
  path: '/jobItem/:_id',
  template: "jobItemDetailedView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("jobItem", this.params._id));
    cursors.push(Meteor.subscribe("ingredients"));
    cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
    Session.set("thisJobItem", this.params._id);
  }
});

Router.route('/jobItem/:_id/edit', {
  name: "jobItemEdit",
  path: '/jobItem/:_id/edit',
  template: "jobItemEditView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("jobItem", this.params._id));
    cursors.push(Meteor.subscribe("ingredients"));
    cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
    Session.set("thisJobItem", this.params._id);
  }
});


Router.route('/jobs/:date', {
  name: "jobs",
  path: '/jobs/:date',
  template: "jobsView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("unAssignedJobs"));
    // cursors.push(Meteor.subscribe("ingredients"));
    // cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
  },
  data: function() {
  
  }
});
// -------------------JOB ITEM

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



Router.route('/ingredients', {
  name: "ingredientsList",
  path: '/ingredients',
  template: "ingredientsListView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("ingredients"));
    cursors.push(Meteor.subscribe("allConversions"));
    return cursors;
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

Router.route('/unitsConversion', {
  name: "unitsConversionList",
  path: '/unitsConversion',
  template: "unitsConversionListView",
  waitOn: function() {
    return Meteor.subscribe("allConversions");
  },
  data: function() {
    // Session.set("thisWorker", null);
  }
});

Router.route('/', {
  name: "home",
  path: '/',
  template: "homeView"
});

Router.route('/shift/daily/:_date', {
  name: 'shiftsDaily',
  path: '/shift/daily/:_date',
  template: "shiftsDailyView",
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
