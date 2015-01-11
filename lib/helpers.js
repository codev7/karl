UI.registerHelper('timeFormat', function(time) {
  var timeFormatted = moment(time).format("hh:mm A");
  return timeFormatted;
});

getDaysOfWeek = function(date) {
  var monday = moment(date).weekday(0).format("YYYY-MM-DD"); // Monday
  var sunday = moment(date).weekday(6).format("YYYY-MM-DD"); // Friday
  return {
    "day1": monday,
    "day7": sunday 
  };
}

// getDate