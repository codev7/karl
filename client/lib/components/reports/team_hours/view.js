Template.teamHours.events({
  'click .savePayroll': function(event) {
    event.preventDefault();
    $(event.target).hide();
    var users = Meteor.users.find().fetch();
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo); 
    console.log(week);
    if(users.length > 0 && week.length == 7) {
      users.forEach(function(user) {
        Meteor.call("createPayroll", week, user._id, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      });
    }
  }
});