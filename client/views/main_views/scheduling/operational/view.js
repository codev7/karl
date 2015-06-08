Template.shiftMainView.helpers({
  title: function() {
    var id = Router.current().params._id;
    var shift = Shifts.findOne(id);
    if(shift) {
      return "Roster for " + moment(parseInt(shift.shiftDate)).format("dddd, Do of MMMM YYYY");
    }
  }
});