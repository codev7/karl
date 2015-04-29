Template.dailyShiftScheduling.events({
  'click .today': function(event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    Router.go("dailyShiftScheduling", {"date": date});
  },

  'click .prevDay': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    date = new Date(date);
    date.setDate(date.getDate() - 1);
    date = moment(date).format("YYYY-MM-DD");
    Router.go("dailyShiftScheduling", {"date": date});
  },

  'click .nextDay': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    date = new Date(date);
    date.setDate(date.getDate() + 1);
    date = moment(date).format("YYYY-MM-DD");
    Router.go("dailyShiftScheduling", {"date": date});
  }
});

Template.dailyShiftScheduling.rendered = function() {
  // $(".shiftedJobs").sortable({
  //   connectWith: "#jobsList, .shiftedJobs"
  // })
}