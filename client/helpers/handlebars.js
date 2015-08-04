//Formatted time with AM PM
UI.registerHelper('timeFormat', function(time) {
  return moment(time).format("HH:mm");
});

//Formatted time with AM PM
UI.registerHelper('time', function(time) {
  return moment(time).format("hh:mm");
});

//Formatted time with Ago 
UI.registerHelper('timeFromNow', function(time) {
  return moment(time).fromNow();
});

//duration
UI.registerHelper('timeDuration', function(time) {
  var hours = moment.duration(time).hours();
  var mins = moment.duration(time).minutes();
  var text = null;
  if(hours > 0) {
    if(hours == 1) {
      text = hours + " hour ";
    } else {
      text = hours + " hours ";
    }
  }
  if(text) {
    if(mins == 1) {
      text += mins + " minute";
    } else {
      text += mins + " minutes";
    }
  } else {
    text = mins + " minute";
    if(mins == 1) {
      text = mins + " minute";
    } else {
      text = mins + " minutes";
    }
  }
  return text;
});

UI.registerHelper('timeDurationWithDecimal', function(time) {
  var hours = moment.duration(time).hours();
  var mins = moment.duration(time).minutes();
  var text = null;
  if(mins < 10) {
    text = hours + ".0" + mins;
  } else {
    text = hours + "." + mins;
  }
  return text;
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

UI.registerHelper("dateFormat", function(date) {
  var dateFormatted = moment(date).format('YYYY-MM-DD');
  return dateFormatted;
});

UI.registerHelper("username", function(id) {
  var user = Meteor.users.findOne(id);
  if(user) {
    return user.username;
  }
});

UI.registerHelper("jobTypeById", function(id) {
  var type = JobTypes.findOne(id);
  if(type) {
    return type.name;
  }
});

UI.registerHelper("sectionById", function(id) {
  var section = Sections.findOne(id);
  if(section) {
    return section.name;
  }
});

UI.registerHelper("roundCount", function(count) {
  return Math.round(count * 100)/100;
});