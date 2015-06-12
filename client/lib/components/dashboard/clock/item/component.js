var component = FlowComponents.define("clockItem", function(props) {
  this.item = props.item;
  this.item["text"] = props.text;
  this.item["class"] = props.class;
  this.item["tag"] = props.tag;
  this.item["subText"] = props.subText;

  this.onRendered(this.onClockRendered);
});

component.state.item = function() {
  if(this.item) {
    return this.item;
  }
}

component.state.timeFromNow = function() {
  if(this.item.text == "Clock In") {
    return Session.get("timeLeft");
  } else if(this.item.text == "Clock Out") {
    return Session.get("timeSpent");
  } else if(this.item.text == "Clock Ended") {
    var shiftId = Session.get("newlyEndedShift");
    var shift = Shifts.findOne(shiftId);
    var time = 0;
    if(shift) {
      time = shift.finishedAt - shift.startedAt;
      return time;
    }
  }
}

component.state.clockIn = function() {
  if(this.item.text == "Clock In") {
    return true;
  } else {
    return false;
  } 
}

component.state.clockOut = function() {
  if(this.item.text == "Clock Out") {
    return true;
  } else {
    return false;
  } 
}


component.state.clockEnded = function() {
  if(this.item.text == "Clock Ended") {
    return true;
  } else {
    return false;
  } 
}

component.prototype.onClockRendered = function() {
  if(this.item.text == "Clock In") {
    var upplerLimit = new Date().getTime() + 5 * 3600 * 1000;
    var lowerLimit = new Date().getTime() - 2 * 3600 * 1000;

    var clock = new Date(this.item.startTime).getTime();
    var timeLeft = function() {
      if(clock > lowerLimit && clock < upplerLimit) {
        clock--;
        Session.set("timeLeft", clock);
        return;
      }
    };

    var interval = Meteor.setInterval(timeLeft, 1000);

  } else if(this.item.text == "Clock Out") {

    var clock = new Date(this.item.startedAt).getTime();
    var timeSpent = function() {
      if(clock < new Date().getTime()) {
        clock--;
        var spent = new Date().getTime() - clock;
        Session.set("timeSpent", spent);
        return;
      }
    };
    var interval = Meteor.setInterval(timeSpent, 1000);
  }
}