var component = FlowComponents.define("teamHours", function(props) {
  this.onRendered(this.onListRendered);
});

component.state.week = function() {
  var weekNo = Router.current().params.week;
  var week = getDatesFromWeekNumber(weekNo);
  return week;
}

component.state.users = function() {
  return Meteor.users.find();
}

component.prototype.onListRendered = function() {
  // $.fn.editable.defaults.mode = 'inline';
  // $.fn.editable.defaults.showbuttons = false;

  $('.dataTables-example').dataTable({
    responsive: true,
    "dom": 'T<"clear">lfrtip',
    "tableTools": {
      "sSwfPath": "/swf/copy_csv_xls_pdf.swf"
    }
  });
  
  // datatable.$('td').editable({
  //   success: function(response, newValue) {
  //     if(newValue) {
  //       console.log("...........reason", response);
  //       console.log("...........reason", newValue);

  //       // var ing = $(this).data("pk");
  //       // var type = $(this).data("itemtype");
  //       // if(type == "ings") {
  //       //   Meteor.call("addIngredients", menu, [{"_id": ing, "quantity": newValue}], function(err) {
  //       //     if(err) {
  //       //       console.log(err);
  //       //       return alert(err.reason);
  //       //     }
  //       //     return;
  //       //   });
  //       // } else if(type == "prep") {
  //       //   Meteor.call("addJobItem", menu, [{"_id": ing, "quantity": newValue}], function(err) {
  //       //     if(err) {
  //       //       console.log(err);
  //       //       return alert(err.reason);
  //       //     }
  //       //     return;
  //       //   });
  //       // }
  //     }
  //   }
  // });
}