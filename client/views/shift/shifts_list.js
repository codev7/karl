Template.shiftsList.helpers({
  "shifts": function() {
    var shifts = Shifts.find().fetch();
    return shifts;
  }
});