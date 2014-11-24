Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {

  this.route('home', {
    path: '/',
    template: "shiftsList"
  });

  this.route('schedule', {
    path: '/schedule',
    template: "shiftSchedule"
  });
});
