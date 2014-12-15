Template.dailyShifts.helpers({
  'weekDays': function() {
    var shifts = Shifts.find({}, {sort: {"shiftDate": 1}});
    console.log(shifts);
    return shifts;
  },

  'shifts': function() {
    var shifts = Shifts.find();
  }
});