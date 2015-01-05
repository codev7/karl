UI.registerHelper('timeFormat', function(time) {
  var timeFormatted = moment(time).format("hh:mm A");
  return timeFormatted;
});