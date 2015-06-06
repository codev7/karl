Template.dailyRosterMainView.helpers({
  title: function() {
    var date = Router.current().params.date;
    return "Roster for " + moment(date).format("dddd, Do of MMMM YYYY")
  }
});