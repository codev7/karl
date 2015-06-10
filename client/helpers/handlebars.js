//Formatted time with AM PM
UI.registerHelper('timeFormat', function(time) {
  return moment(time).format("hh:mm A");
});

//Formatted time with Ago 
UI.registerHelper('timeFromNow', function(time) {
  return moment(time).fromNow();
});

UI.registerHelper('secondsToMinutes', function(secs) {
  var mins = secs/60;
  return mins;
});

UI.registerHelper("timeFormattedWithDate", function(time) {
  var timeFormatted = moment(time).format('MMMM Do YYYY, h:mm:ss a');
  return timeFormatted;
});

UI.registerHelper("dayFormat", function(date) {
  var dateFormatted = moment(date).format('ddd, Do MMMM');
  return dateFormatted;
});

UI.registerHelper("username", function(id) {
  var user = Meteor.users.findOne(id);
  if(user) {
    return user.username;
  }
});