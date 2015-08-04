Template.stockCounting.events({
  'click .addStock': function(event) {
    event.preventDefault();
    $("#stocksListModal").modal("show");
  },

  'click .reOrder': function(event) {
    event.preventDefault();
    Meteor.call("checkReOrdering", function(err, list) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        console.log("......", list)
      }
    });
  },

  'click .generateOrders': function(event) {
    event.preventDefault();
    var date = Session.get("thisDate");
    if(date) {
      Meteor.call("generateOrders", date, function(err, result) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          Router.go("stocktakeOrdering", {"date": moment(Session.get("thisDate")).format("YYYY-MM-DD")})
        }
      });
    }
  }
});

Template.stockCounting.rendered = function() {
  $('#newStocktakeDate').editable({
    type: "combodate",
    title: "Select date",
    mode: "inline",
    format: 'YYYY-MM-DD',    
    viewformat: 'YYYY-MM-DD',    
    template: 'YYYY-MM-DD',    
    combodate: {
      minYear: 2000,
      maxYear: 2020,
      minuteStep: 1
    },
    success: function(response, newValue) {
      console.log("...........", newValue);
    }
  });
}