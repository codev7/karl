var subs = new SubsManager();

Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound'
});

// //--------------------HOME ROUTE
Router.route("/", function() {
  this.render('home');
  if(!Meteor.userId()) {
    this.layout('blankLayout');
  }
}, {
  name: "home"
});

Router.route('/signIn', function() {
  this.render('signIn');
  this.layout('blankLayout');
}, {
  name: "signIn",
  path: "/signIn",
});


//--------------------MENU ITEMS ROUTES
Router.route('/menuItems/:category/:status', {
  name: "menuItemsMaster",
  path: '/menuItems/:category/:status',
  template: "menuItemsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allCategories"));
    if(this.params.category) {
      cursors.push(Meteor.subscribe("menuList", this.params.category, this.params.status));
    }
    cursors.push(subs.subscribe("userSubs", 'menulist', null, Meteor.userId()));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
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
  template: "menuItemSubmitMainView",
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
  template: "menuItemDetailedMainView",
  waitOn: function() {
    var cursors = [];
    cursors = menuItemSubs(this.params._id);
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("usersList"));
    cursors.push(subs.subscribe("userSubs", 'menulist', this.params._id, Meteor.userId()));
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
  template: "menuItemEditMainView",
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
  template: "jobItemsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allJobItems"));
    cursors.push(subs.subscribe("allIngredients"));
    cursors.push(subs.subscribe("userSubs", "joblist", null, Meteor.userId()));
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
  template: "submitJobItemMainView",
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
  template: "jobItemDetailedMainView",
  waitOn: function() {
    var cursors = [];
    cursors = jobItemSubs(this.params._id);
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("usersList"));
    cursors.push(subs.subscribe("userSubs", "joblist", this.params._id, Meteor.userId()));
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


// // ---------------------INGREDIENTS ROUTES
Router.route('/ingredients', {
  name: "ingredientsList",
  path: '/ingredients',
  template: "ingredientsListMainView",
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
// Router.route('/sales/forecast/catering', {
//   name: "cateringSalesForecast",
//   path: '/sales/forecast/catering',
//   template: "cateringSalesForecastView",
//   waitOn: function() {
//     return subs.subscribe("menuList", null, null);
//   },
//   data: function() {
//     if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
//       Router.go("/");
//     }
//   },
//   fastRender: true
// });

Router.route('/sales/forecast/cafe/:week', {
  name: "cafeSalesForecast",
  path: '/sales/forecast/cafe/:week',
  template: "weeklyForecastListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("menuList", "all", "active"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
  },
  fastRender: true
});

Router.route('/sales/forecast/cafe/edit/:week', {
  name: "weeklySalesForecastMenusList",
  path: '/sales/forecast/cafe/edit/:week',
  template: "weeklySalesForecastMenusListView",
  waitOn: function() {
    return subs.subscribe("menuList", "all", "all");
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
  },
  fastRender: true
})

Router.route('/sales/calibration', {
  name: "salesCalibration",
  path: '/sales/calibration',
  template: "salesCalibratedMainView",
  waitOn: function() {
    var cursor = [];
    cursor.push(subs.subscribe("menuList", "all", "all"));
    cursor.push(subs.subscribe("salesCalibration"));
    return cursor;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("dateRange", 1);
  },
  fastRender: true
});

Router.route('/sales/:date', {
  name: "actualSales",
  path: '/sales/:date',
  template: "actualSalesMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("menuList", null, null));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
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

// //-----------------SCHEDULING ROUTES

Router.route('/scheduling/daily/:date', {
  name: "dailyShiftScheduling",
  path: '/scheduling/daily/:date',
  template: "dailyShiftSchedulingMainView",
  waitOn: function() {
    if(this.params.date != null) {
      return dailySubs(this.params.date)
    }
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("thisDate", this.params.date);
  },
  fastRender: true
});

// Router.route('/scheduling/weekly/:week', {
//   name: "weeklyShiftScheduling",
//   path: '/scheduling/weekly/:week',
//   template: "dailyShiftSchedulingView",
//   waitOn: function() {
//     if(this.params.date != null) {
//       return dailySubs(this.params.date)
//     }
//   },
//   data: function() {
//     if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
//       Router.go("/");
//     }
//     Session.set("thisDate", this.params.date);
//   },
//   fastRender: true
// });



// ---------------------ADMIN ROUTE
Router.route('/users', {
  name: "users",
  path: '/users',
  template: "usersListMainView",
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




// // ------------------MENU
// // Router.route('/menus', {
// //   name: "menus",
// //   path: '/menus',
// //   template: "menusView",
// //   waitOn: function() {
// //     var cursors = [];
// //     cursors.push(Meteor.subscribe("menus"));
// //     // cursors.push(Meteor.subscribe("ingredients"));
// //     return cursors;
// //   },
// //   data: function() {
  
// //   }
// // });

// // Router.route('/menus/submit', {
// //   name: "menuSubmit",
// //   path: '/menus/submit',
// //   template: "menuSubmitView",
// //   waitOn: function() {
// //     var cursors = [];
// //     cursors.push(Meteor.subscribe("menuList"));
// //     return cursors;
// //   }
// // });

// // Router.route('/menu/:_id', {
// //   name: "menuDetailed",
// //   path: '/menu/:_id',
// //   template: "menuDetailedView",
// //   waitOn: function() {
// //     var cursors = [];
// //     cursors.push(Meteor.subscribe("menu", this.params._id));
// //     return cursors;
// //   },
// //   data: function() {
// //     Session.set("thisMenu", this.params._id);
// //   }
// // });




Router.route('/jobs', {
  name: "jobs",
  path: '/jobs',
  template: "jobsMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("unAssignedJobs"));
    // cursors.push(Meteor.subscribe("ingredients"));
    return cursors;
  },
  data: function() {
  
  }
});

// Router.route('/week/:_date', {
//   name: "weekly",
//   path: '/week/:_date',
//   template: "weeklyView",
//   waitOn: function() {
//     return weeklySubs(this.params._date);
//   },
//   data: function() {
//     var dates = getDaysOfWeek(this.params._date);
//     Session.set("thisWeek", dates);
//   }
// });


// Router.route('/member/:_id/:date', {
//   name: "member",
//   path: '/member/:_id/:date',
//   template: "teamMemberJobView",
//   waitOn: function() {
//     return Meteor.subscribe("daily", this.params.date, this.params._id);
//   },
//   data: function() {
//     Session.set("thisDate", this.params.date);
//     Session.set("thisWorker", this.params._id);
//   }
// });


function dailySubs(date) {
  var subscriptions = [];
  var shiftsSubs = Meteor.subscribe("daily", date, null);
  subscriptions.push(shiftsSubs);
  var workersSubs = Meteor.subscribe("workers");
  subscriptions.push(workersSubs);
  var uncompletedJobsSubs = Meteor.subscribe("unAssignedJobs");
  subscriptions.push(uncompletedJobsSubs);
  var jobTypes = subs.subscribe("jobTypes");
  subscriptions.push(jobTypes);
  var jobItems = subs.subscribe("allJobItems");
  subscriptions.push(jobItems);
  return subscriptions;

}

// function weeklySubs(date) {
//   var dates = getDaysOfWeek(date);
//   var cursors = [];
//   var weeklyShiftsSub = Meteor.subscribe("weekly", dates);
//   cursors.push(weeklyShiftsSub);
//   var jobTypesSub = Meteor.subscribe("jobTypes");
//   cursors.push(jobTypesSub);
//   var salesSub = Meteor.subscribe("weeklySales", dates.day1, dates.day7);
//   cursors.push(salesSub);
//   return cursors;
// }

// function adminSubs() {
//   var subscriptions = [];
//   // var adminSubscriptions = subs.subscribe("allWorkers");
//   // subscriptions.push(adminSubscriptions);
//   var jobTypesSubs = subs.subscribe("jobTypes");
//   subscriptions.push(jobTypesSubs);
//   var date = new Date();
//   var dates = getDaysOfMonth(date);
//   var holidaySubs = subs.subscribe("monthlyHolidays", dates.start, dates.end);
//   subscriptions.push(holidaySubs);
//   return subscriptions;
// }

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

// function homePageCursors() {
//   var cursors = [];
//   return cursors;
// }


//
// Dashboards routes
//

Router.route('/dashboard1', function () {
    this.render('dashboard1');
});
Router.route('/dashboard2', function () {
    this.render('dashboard2');
});
Router.route('/dashboard3', function () {
    this.render('dashboard3');
});
Router.route('/dashboard4', function () {
    this.render('dashboard4');
    this.layout('layout2');
});
Router.route('/dashboard4l', function () {
    this.render('dashboard4l');
});


//
// Layouts route
//

Router.route('/layouts', function () {
  this.render('layouts');
});

//
// Graphs routes
//

Router.route('/graphFlot', function () {
  this.render('graphFlot');
});

Router.route('/graphRickshaw', function () {
    this.render('graphRickshaw');
});

Router.route('/graphChartJs', function () {
    this.render('graphChartJs');
});

Router.route('/graphPeity', function () {
    this.render('graphPeity');
});

Router.route('/graphSparkline', function () {
    this.render('graphSparkline');
});

//
// Mailbox
//

Router.route('/mailbox', function () {
    this.render('mailbox');
});

Router.route('/emailView', function () {
    this.render('emailView');
});

Router.route('/emailCompose', function () {
    this.render('emailCompose');
});

Router.route('/emailTemplates', function () {
    this.render('emailTemplates');
});

//
// Widgets
//

Router.route('/widgets', function () {
    this.render('widgets');
});

//
// Forms
//

Router.route('/formBasic', function () {
    this.render('formBasic');
});

Router.route('/formAdvanced', function () {
    this.render('formAdvanced');
});

Router.route('/formWizard', function () {
    this.render('formWizard');
});

Router.route('/formUpload', function () {
    this.render('formUpload');
});

Router.route('/textEditor', function () {
    this.render('textEditorInspinia');
});

//
// App Views
//

Router.route('/contacts', function () {
    this.render('contacts');
});

Router.route('/profile', function () {
    this.render('profile');
});

Router.route('/projects', function () {
    this.render('projects');
});

Router.route('/projectDetail', function () {
    this.render('projectDetail');
});

Router.route('/teamsBoard', function () {
    this.render('teamsBoard');
});

Router.route('/clients', function () {
    this.render('clients');
});

Router.route('/fullHeight', function () {
    this.render('fullHeight');
});

Router.route('/offCanvas', function () {
    this.render('offCanvas');
});

Router.route('/fileManager', function () {
    this.render('fileManager');
});

Router.route('/calendar', function () {
    this.render('calendar');
});

Router.route('/issueTracker', function () {
    this.render('issueTracker');
});

Router.route('/blog', function () {
    this.render('blog');
});

Router.route('/article', function () {
    this.render('article');
});

Router.route('/faq', function () {
    this.render('faq');
});

Router.route('/timelineOne', function () {
    this.render('timelineOne');
});

Router.route('/pinBoard', function () {
    this.render('pinBoard');
});

//
// Other pages
//

Router.route('/searchResult', function () {
    this.render('searchResult');
});

Router.route('/lockScreen', function () {
    this.render('lockScreen');
    this.layout('blankLayout')
});

Router.route('/invoice', function () {
    this.render('invoice');
});

Router.route('/invoicePrint', function () {
    this.render('invoicePrint');
    this.layout('blankLayout')
});

Router.route('/loginTwo', function () {
    this.render('loginTwo');
    this.layout('blankLayout')
});

Router.route('/forgotPassword', function () {
    this.render('forgotPassword');
    this.layout('blankLayout')
});

// Router.route('/register', function () {
//     this.render('register');
//     this.layout('blankLayout')
// });

Router.route('/errorOne', function () {
    this.render('errorOne');
    this.layout('blankLayout')
});

Router.route('/errorTwo', function () {
    this.render('errorTwo');
    this.layout('blankLayout')
});

Router.route('/emptyPage', function () {
    this.render('emptyPage');
});

//
// Miscellaneous
//

Router.route('/toastrNotification', function () {
    this.render('toastrNotification');
});

Router.route('/nestableList', function () {
    this.render('nestableList');
});

Router.route('/agileBoard', function () {
    this.render('agileBoard');
});

Router.route('/timelineTwo', function () {
    this.render('timelineTwo');
});

Router.route('/diff', function () {
    this.render('diff');
});

Router.route('/idleTimer', function () {
    this.render('idleTimer');
});

Router.route('/spinners', function () {
    this.render('spinners');
});

Router.route('/liveFavicon', function () {
    this.render('liveFavicon');
});

Router.route('/googleMaps', function () {
    this.render('googleMaps');
});

Router.route('/codeEditor', function () {
    this.render('codeEditor');
});

Router.route('/modalWindow', function () {
    this.render('modalWindow');
});

Router.route('/forumView', function () {
    this.render('forumView');
});

Router.route('/forumDetail', function () {
    this.render('forumDetail');
});

Router.route('/validation', function () {
    this.render('validation');
});

Router.route('/treeView', function () {
    this.render('treeView');
});

Router.route('/chatView', function () {
    this.render('chatView');
});

//
// UI Elements
//

Router.route('/typography', function () {
    this.render('typography');
});

Router.route('/icons', function () {
    this.render('icons');
});

Router.route('/draggablePanels', function () {
    this.render('draggablePanels');
});

Router.route('/buttons', function () {
    this.render('buttons');
});

Router.route('/video', function () {
    this.render('video');
});

Router.route('/tabsPanels', function () {
    this.render('tabsPanels');
});

Router.route('/notifications', function () {
    this.render('notifications');
});

Router.route('/badgesLabels', function () {
    this.render('badgesLabels');
});

//
// Grid Options
//

Router.route('/gridOptions', function () {
    this.render('gridOptions');
});

//
// Tables
//

Router.route('/tableStatic', function () {
    this.render('tableStatic');
});

Router.route('/dataTables', function () {
    this.render('dataTables');
});

//
// Gallery
//

Router.route('/gallery', function () {
    this.render('gallery');
});

Router.route('/carusela', function () {
    this.render('carusela');
});


//
// CSS Animations
//

Router.route('/cssAnimations', function () {
    this.render('cssAnimations');
});

//
// Other pages routes
//
Router.route('/notFound', function () {
    this.render('notFound');
});

