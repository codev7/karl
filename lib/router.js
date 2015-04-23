var subs = new SubsManager();

Router.configure({
  layoutTemplate: 'applicationLayout'
});

//--------------------HOME ROUTE
Router.route('/', {
  name: "home",
  path: '/',
  template: "home"
});

Router.route('/signIn', {
  name: "signIn",
  path: "/signIn",
  template: 'signIn',
});


//--------------------MENU ITEMS ROUTES
Router.route('/menuItems/:category/:status', {
  name: "menuItemsMaster",
  path: '/menuItems/:category/:status',
  template: "menuItemsListView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allCategories"));
    if(this.params.category) {
      cursors.push(Meteor.subscribe("menuList", this.params.category, this.params.status));
    }
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("category", this.params.category);
    Session.set("status", this.params.status);
  },
  fastRender: true
});

Router.route('/menuItem/submit', {
  name: "submitMenuItem",
  path: '/menuItem/submit',
  template: "submitMenuItemView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobItems"));
    cursors.push(subs.subscribe('allCategories'));
    return cursors;
  }, 
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
  },
  fastRender: true
});

Router.route('/menuItem/:_id', {
  name: "menuItemDetail",
  path: '/menuItem/:_id',
  template: "menuItemDetailedView",
  waitOn: function() {
    var cursors = [];
    cursors = menuItemSubs(this.params._id);
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("usersList"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisMenuItem", this.params._id);
  },
  fastRender: true
});

Router.route('/menuItem/:_id/edit', {
  name: "menuItemEdit",
  path: '/menuItem/:_id/edit',
  template: "menuItemEditView",
  waitOn: function() {
    return menuItemSubs(this.params._id);
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("thisMenuItem", this.params._id);
    Session.set("selectedIngredients", null);
    Session.set("selectedJobItems", null);
  },
  fastRender: true
});


// ---------------------JOB ITEMS ROUTES
Router.route('/jobItems', {
  name: "jobItemsMaster",
  path: '/jobItems',
  template: "jobItemsListView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobItems"));
    cursors.push(subs.subscribe("allIngredients"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
  },
  fastRender: true
});

Router.route('/jobItem/submit', {
  name: "submitJobItem",
  path: '/jobItem/submit',
  template: "submitJobItemView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("ingredients", []));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("thisJobItem", null);
    Session.set("selectedIngredients", null);
  },
  fastRender: true
});

Router.route('/jobItem/:_id', {
  name: "jobItemDetailed",
  path: '/jobItem/:_id',
  template: "jobItemDetailedView",
  waitOn: function() {
    var cursors = [];
    cursors = jobItemSubs(this.params._id);
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("usersList"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisJobItem", this.params._id);
  },
  fastRender: true
});

Router.route('/jobItem/:_id/edit', {
  name: "jobItemEdit",
  path: '/jobItem/:_id/edit',
  template: "jobItemEditView",
  waitOn: function() {
    return jobItemSubs(this.params._id);
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("thisJobItem", this.params._id);
  },
  fastRender: true
});


// ---------------------INGREDIENTS ROUTES
Router.route('/ingredients', {
  name: "ingredientsList",
  path: '/ingredients',
  template: "ingredientsListView",
  waitOn: function() {
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
  },
  fastRender: true
});

// ---------------------SALES ROUTES
Router.route('/sales/forecast/catering', {
  name: "cateringSalesForecast",
  path: '/sales/forecast/catering',
  template: "cateringSalesForecastView",
  waitOn: function() {
    return subs.subscribe("menuList", null, null);
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
  },
  fastRender: true
});

Router.route('/sales/forecast/cafe', {
  name: "cafeSalesForecast",
  path: '/sales/forecast/cafe',
  template: "cafeSalesForecastView",
  waitOn: function() {
    return subs.subscribe("menuList", null, null);
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
  },
  fastRender: true
});

Router.route('/sales/calibration', {
  name: "salesCalibration",
  path: '/sales/calibration',
  template: "salesCalibratedView",
  waitOn: function() {
    return subs.subscribe("menuList", null, null);
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("dateRange", 1);
  },
  fastRender: true
});

Router.route('/sales/:date', {
  name: "actualSales",
  path: '/sales/:date',
  template: "actualSalesView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("menuList", null, null));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    } else {
      Meteor.call("createSalesMenus", this.params.date, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  },
  fastRender: true
});





// ---------------------ADMIN ROUTE
Router.route('/admin', {
  name: "admin",
  path: '/admin',
  template: "adminView",
  waitOn: function() {
    return subs.subscribe("usersList");
  },
  data: function() {
    if(!Meteor.userId() || !Meteor.user().isAdmin) {
      Router.go("/");
    }
  },
  fastRender: true
});




// ------------------MENU
// Router.route('/menus', {
//   name: "menus",
//   path: '/menus',
//   template: "menusView",
//   waitOn: function() {
//     var cursors = [];
//     cursors.push(Meteor.subscribe("menus"));
//     // cursors.push(Meteor.subscribe("ingredients"));
//     return cursors;
//   },
//   data: function() {
  
//   }
// });

// Router.route('/menus/submit', {
//   name: "menuSubmit",
//   path: '/menus/submit',
//   template: "menuSubmitView",
//   waitOn: function() {
//     var cursors = [];
//     cursors.push(Meteor.subscribe("menuList"));
//     return cursors;
//   }
// });

// Router.route('/menu/:_id', {
//   name: "menuDetailed",
//   path: '/menu/:_id',
//   template: "menuDetailedView",
//   waitOn: function() {
//     var cursors = [];
//     cursors.push(Meteor.subscribe("menu", this.params._id));
//     return cursors;
//   },
//   data: function() {
//     Session.set("thisMenu", this.params._id);
//   }
// });




Router.route('/jobs', {
  name: "jobs",
  path: '/jobs',
  template: "jobsView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("unAssignedJobs"));
    // cursors.push(Meteor.subscribe("ingredients"));
    return cursors;
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
  var adminSubscriptions = subs.subscribe("allWorkers");
  subscriptions.push(adminSubscriptions);
  var jobTypesSubs = subs.subscribe("jobTypes");
  subscriptions.push(jobTypesSubs);
  var date = new Date();
  var dates = getDaysOfMonth(date);
  var holidaySubs = subs.subscribe("monthlyHolidays", dates.start, dates.end);
  subscriptions.push(holidaySubs);
  return subscriptions;
}

function jobItemSubs(id) {
  var cursors = [];
  var jobItemCursor = subs.subscribe("jobItem", id);
  cursors.push(jobItemCursor);
  if(jobItemCursor) {
    var jobItem = JobItems.findOne(id);
    if(jobItem) {
      if(jobItem.ingredients) {
        var ids = [];
        jobItem.ingredients.forEach(function(doc) {
          ids.push(doc._id);
        });
        if(ids.length > 0) {
          cursors.push(subs.subscribe("ingredients", ids))
        }
      }
    }
  } 
  cursors.push(subs.subscribe("jobTypes"));
  return cursors;
}

function menuItemSubs(id) {
  var cursors = [];
  var menuItemCursor = Meteor.subscribe("menuItem", id);
  cursors.push(menuItemCursor);
  if(menuItemCursor) {
    var menuItem = MenuItems.findOne(id);
    if(menuItem) {
      if(menuItem.ingredients) {
        var ids = [];
        menuItem.ingredients.forEach(function(doc) {
          ids.push(doc._id);
        });
        if(ids.length > 0) {
          cursors.push(subs.subscribe("ingredients", ids))
        }
      }
      // if(menuItem.jobItems) {
      //   var jobIds = [];
      //   menuItem.jobItems.forEach(function(doc) {
      //     jobIds.push(doc._id);
      //   });
      //   if(jobIds.length > 0) {
      //     cursors.push(Meteor.subscribe("menuItemJobItems", jobIds));
      //   }
      // }
    }
  }  
  cursors.push(subs.subscribe("allJobItems"));
  cursors.push(subs.subscribe("allCategories"));
  return cursors;
}

function homePageCursors() {
  var cursors = [];
  return cursors;
}
